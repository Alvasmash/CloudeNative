import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="login-wrapper">
      <div class="login-card">
        <!-- Logo & Branding -->
        <div class="login-header">
          <div class="logo-badge">
            <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <h1 class="login-title">Pedidos<span class="text-orange">360</span></h1>
          <p class="login-subtitle">
            Plataforma Cloud Native de Pedidos Gastronómicos. Inicia sesión con tu cuenta institucional o de Microsoft Azure AD.
          </p>
        </div>

        <!-- Microsoft Login Primary Button -->
        <div class="auth-section">
          <button
            type="button"
            class="btn-msal"
            (click)="loginWithMicrosoft()"
            [disabled]="authService.isLoading()"
          >
            @if (authService.isLoading()) {
              <span class="spinner"></span>
              <span>Conectando con Microsoft...</span>
            } @else {
              <!-- Official Microsoft 4-color square logo -->
              <svg class="ms-logo" viewBox="0 0 21 21" width="20" height="20">
                <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
                <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
                <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
                <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
              </svg>
              <span>Iniciar sesión con Microsoft</span>
            }
          </button>
        </div>

        <!-- Academic Evaluation / Demo Fallback Section -->
        @if (authService.isDemoMode()) {
          <div class="demo-box">
            <div class="demo-badge">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              Evaluación Académica / Acceso Rápido
            </div>
            <p class="demo-text">
              Para calificar y probar los endpoints del backend y las rutas protegidas sin configurar un Tenant real de Azure, selecciona un perfil:
            </p>
            <div class="demo-buttons">
              <button
                type="button"
                class="btn-demo btn-demo-admin"
                (click)="loginAsDemo('ADMIN')"
              >
                <span class="role-icon">🛡️</span>
                <div class="btn-demo-content">
                  <strong>Entrar como ADMIN</strong>
                  <small>Acceso completo al Dashboard y PATCH/DELETE</small>
                </div>
              </button>

              <button
                type="button"
                class="btn-demo btn-demo-user"
                (click)="loginAsDemo('USER')"
              >
                <span class="role-icon">👤</span>
                <div class="btn-demo-content">
                  <strong>Entrar como Cliente</strong>
                  <small>Catálogo, Carrito y Crear Pedidos</small>
                </div>
              </button>
            </div>
          </div>
        }

        <!-- Security & Infrastructure Guarantee footer note -->
        <div class="login-footer">
          <div class="security-tag">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            OAuth2 Resource Server &bull; Microsoft MSAL &bull; Spring Security
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-wrapper {
      min-height: calc(100vh - 160px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px 16px;
      background: radial-gradient(circle at 50% 20%, rgba(249, 115, 22, 0.08) 0%, transparent 60%);
    }
    .login-card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 20px;
      box-shadow: 0 20px 35px -10px rgba(15, 23, 42, 0.1), 0 8px 16px -6px rgba(15, 23, 42, 0.04);
      max-width: 480px;
      width: 100%;
      padding: 40px 32px;
      text-align: center;
      animation: fadeInCard 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes fadeInCard {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .login-header {
      margin-bottom: 28px;
    }
    .logo-badge {
      width: 64px;
      height: 64px;
      margin: 0 auto 16px;
      border-radius: 18px;
      background: linear-gradient(135deg, #F97316 0%, #EA580C 100%);
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 20px rgba(249, 115, 22, 0.35);
    }
    .login-title {
      font-size: 1.85rem;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 8px 0;
      letter-spacing: -0.02em;
    }
    .text-orange {
      color: #F97316;
    }
    .login-subtitle {
      font-size: 0.925rem;
      color: #64748B;
      line-height: 1.5;
      margin: 0;
    }
    .auth-section {
      margin-bottom: 28px;
    }
    .btn-msal {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 14px 20px;
      background: #0F172A;
      color: #FFFFFF;
      border: 1px solid #1E293B;
      border-radius: 12px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
    }
    .btn-msal:hover:not(:disabled) {
      background: #1E293B;
      transform: translateY(-2px);
      box-shadow: 0 8px 18px rgba(15, 23, 42, 0.25);
    }
    .btn-msal:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    .ms-logo {
      flex-shrink: 0;
    }
    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #FFFFFF;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .demo-box {
      background: #F8FAFC;
      border: 1px dashed #CBD5E1;
      border-radius: 14px;
      padding: 20px;
      text-align: left;
      margin-bottom: 24px;
    }
    .demo-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.775rem;
      font-weight: 700;
      color: #0369A1;
      background: #E0F2FE;
      padding: 3px 8px;
      border-radius: 6px;
      margin-bottom: 8px;
    }
    .demo-text {
      font-size: 0.825rem;
      color: #64748B;
      line-height: 1.4;
      margin: 0 0 14px 0;
    }
    .demo-buttons {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .btn-demo {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      border-radius: 10px;
      border: 1px solid #E2E8F0;
      background: #FFFFFF;
      cursor: pointer;
      text-align: left;
      transition: all 0.15s ease;
    }
    .btn-demo:hover {
      transform: translateX(4px);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    }
    .btn-demo-admin:hover {
      border-color: #F59E0B;
      background: #FFFBEB;
    }
    .btn-demo-user:hover {
      border-color: #3B82F6;
      background: #EFF6FF;
    }
    .role-icon {
      font-size: 1.25rem;
    }
    .btn-demo-content {
      display: flex;
      flex-direction: column;
    }
    .btn-demo-content strong {
      font-size: 0.875rem;
      color: #1E293B;
    }
    .btn-demo-content small {
      font-size: 0.75rem;
      color: #64748B;
    }
    .login-footer {
      border-top: 1px solid #F1F5F9;
      padding-top: 16px;
    }
    .security-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.75rem;
      color: #94A3B8;
    }
  `]
})
export class LoginComponent implements OnInit {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    // Si ya está autenticado, redirigir al destino previsto o al menú
    if (this.authService.isAuthenticated()) {
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/menu';
      this.router.navigateByUrl(returnUrl);
    }
  }

  async loginWithMicrosoft(): Promise<void> {
    await this.authService.loginWithMicrosoft();
  }

  loginAsDemo(role: 'ADMIN' | 'USER'): void {
    this.authService.setDemoUser(role);
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || (role === 'ADMIN' ? '/admin' : '/menu');
    this.router.navigateByUrl(returnUrl);
  }
}
