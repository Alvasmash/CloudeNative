import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { EventMessage, EventType, AccountInfo, AuthenticationResult } from '@azure/msal-browser';
import { filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AppUser } from '../models/user-profile.model';
import { ToastService } from '../services/toast.service';

const DEMO_USER_STORAGE_KEY = 'pedidos360_demo_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly msalService = inject(MsalService);
  private readonly msalBroadcastService = inject(MsalBroadcastService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly platformId = inject(PLATFORM_ID);

  // Estados Reactivos Principales
  readonly currentUser = signal<AppUser | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly isDemoMode = signal<boolean>(environment.demoMode);

  // Computados
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly isAdmin = computed(() => this.currentUser()?.isAdmin ?? false);
  readonly userName = computed(() => this.currentUser()?.name ?? 'Invitado');
  readonly userEmail = computed(() => this.currentUser()?.email ?? '');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initAuth();
    }
  }

  private initAuth(): void {
    // 1. Verificar si hay usuario demo almacenado (para evaluacion)
    const storedDemoUser = sessionStorage.getItem(DEMO_USER_STORAGE_KEY);
    if (storedDemoUser) {
      try {
        const user = JSON.parse(storedDemoUser) as AppUser;
        this.currentUser.set(user);
        return;
      } catch {
        sessionStorage.removeItem(DEMO_USER_STORAGE_KEY);
      }
    }

    // 2. Escuchar eventos de MSAL
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) =>
          msg.eventType === EventType.LOGIN_SUCCESS ||
          msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
          msg.eventType === EventType.ACTIVE_ACCOUNT_CHANGED
        )
      )
      .subscribe((result: EventMessage) => {
        const payload = result.payload as AuthenticationResult;
        if (payload?.account) {
          this.msalService.instance.setActiveAccount(payload.account);
          this.processAccount(payload.account);
        }
      });

    // 3. Revisar si ya existe una cuenta activa en MSAL
    const activeAccount = this.msalService.instance.getActiveAccount();
    if (activeAccount) {
      this.processAccount(activeAccount);
    } else {
      const accounts = this.msalService.instance.getAllAccounts();
      if (accounts.length > 0) {
        this.msalService.instance.setActiveAccount(accounts[0]);
        this.processAccount(accounts[0]);
      }
    }
  }

  /**
   * Procesa la cuenta de Azure AD y extrae los claims del ID Token
   */
  private processAccount(account: AccountInfo): void {
    const claims = account.idTokenClaims as Record<string, any> | undefined;
    const roles: string[] = claims?.['roles'] || [];
    const isAdmin = roles.includes('ADMIN') || roles.includes('ROLE_ADMIN');

    const appUser: AppUser = {
      name: account.name || account.username || 'Usuario Azure AD',
      email: account.username || '',
      username: account.username || '',
      roles,
      isAdmin
    };

    this.currentUser.set(appUser);
  }

  /**
   * Inicia sesion mediante Microsoft Entra ID (Azure AD) usando Popup
   */
  async loginWithMicrosoft(): Promise<void> {
    this.isLoading.set(true);
    try {
      // Si los placeholders de Azure no se han configurado aun, advertir amigablemente
      if (environment.azure.clientId === 'TU_AZURE_CLIENT_ID_PLACEHOLDER') {
        this.toastService.warning(
          'Azure AD no esta configurado con Client ID real. Puedes usar el modo Demo para probar el sistema.',
          'Configuracion Azure'
        );
        this.isLoading.set(false);
        return;
      }

      const result = await this.msalService.loginPopup({
        scopes: environment.azure.loginScopes,
        prompt: 'select_account'
      }).toPromise();

      if (result?.account) {
        this.msalService.instance.setActiveAccount(result.account);
        this.processAccount(result.account);
        this.toastService.success(`Bienvenido/a, ${result.account.name || 'Usuario'}!`);
        this.router.navigate(['/menu']);
      }
    } catch (err: any) {
      console.error('Error durante login con Azure AD:', err);
      this.toastService.error(
        err.message || 'No se pudo completar la autenticacion con Microsoft',
        'Error de Autenticacion'
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Cierra sesion tanto en Azure AD como en el estado local
   */
  async logout(): Promise<void> {
    this.currentUser.set(null);
    sessionStorage.removeItem(DEMO_USER_STORAGE_KEY);

    try {
      const activeAccount = this.msalService.instance.getActiveAccount();
      if (activeAccount) {
        await this.msalService.logoutPopup({
          account: activeAccount
        }).toPromise();
      }
    } catch (err) {
      console.warn('Error en logout de MSAL (posible sesion local limpia):', err);
    } finally {
      this.toastService.info('Sesion cerrada correctamente');
      this.router.navigate(['/login']);
    }
  }

  /**
   * Modo Demostracion / Evaluacion Academica:
   * Permite a los evaluadores cambiar entre rol Cliente y Admin instantaneamente.
   */
  setDemoUser(role: 'ADMIN' | 'USER'): void {
    const isAdmin = role === 'ADMIN';
    const demoUser: AppUser = {
      name: isAdmin ? 'Profesor / Administrador' : 'Estudiante Duoc UC',
      email: isAdmin ? 'admin.pedidos360@duocuc.cl' : 'estudiante@duocuc.cl',
      username: isAdmin ? 'admin.pedidos360' : 'estudiante.duoc',
      roles: isAdmin ? ['ROLE_ADMIN', 'ADMIN'] : ['ROLE_USER'],
      isAdmin
    };

    this.currentUser.set(demoUser);
    sessionStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoUser));
    this.toastService.success(
      `Sesion iniciada en Modo Demo como ${isAdmin ? 'ADMINISTRADOR (ROLE_ADMIN)' : 'CLIENTE REGULAR'}`,
      'Modo Demostracion'
    );
    this.router.navigate(['/menu']);
  }
}
