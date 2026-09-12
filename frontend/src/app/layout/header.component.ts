import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';
import { CartService } from '../core/services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="navbar">
      <div class="nav-container">
        <!-- Brand Logo -->
        <a routerLink="/menu" class="brand">
          <div class="brand-icon">
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"
              />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <span class="brand-name"
            >Pedidos<span class="brand-highlight">360</span></span
          >
        </a>

        <!-- Desktop Navigation Links -->
        <nav class="nav-links">
          <a routerLink="/menu" routerLinkActive="active" class="nav-link">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M3 3h18v18H3z" />
              <path d="M3 9h18M9 21V9" />
            </svg>
            Menú
          </a>
          @if (authService.isAuthenticated()) {
            <a routerLink="/pedidos" routerLinkActive="active" class="nav-link">
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              Mis Pedidos
            </a>
          }
          @if (authService.isAdmin()) {
            <a
              routerLink="/admin"
              routerLinkActive="active"
              class="nav-link nav-link-admin"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                <path
                  d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
                />
              </svg>
              Administración
              <span class="admin-chip">ADMIN</span>
            </a>
          }
        </nav>

        <!-- Right Side: Cart + User Profile / Login -->
        <div class="nav-actions">
          <!-- Cart Icon with badge -->
          <a routerLink="/carrito" class="cart-btn" title="Ver Carrito">
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path
                d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
              />
            </svg>
            @if (cartService.totalCount() > 0) {
              <span class="cart-badge">{{ cartService.totalCount() }}</span>
            }
          </a>

          <!-- Demo Mode Role Switcher (Academic Evaluation Feature) -->
          @if (authService.isDemoMode()) {
            <div class="demo-role-selector">
              <button
                type="button"
                class="role-switch-btn"
                [class.role-admin]="authService.isAdmin()"
                (click)="toggleDemoRole()"
                title="Alternar rol para evaluación académica"
              >
                <span class="role-icon">{{
                  authService.isAdmin() ? '🛡️' : '👤'
                }}</span>
                <span class="role-text">{{
                  authService.isAdmin() ? 'ADMIN' : 'CLIENTE'
                }}</span>
              </button>
            </div>
          }

          <!-- User Profile / Auth State -->
          @if (authService.isAuthenticated()) {
            <div class="user-menu">
              <div class="user-pill" (click)="toggleDropdown()">
                <div class="user-avatar">{{ userInitials }}</div>
                <div class="user-info">
                  <span class="user-name">{{ authService.userName() }}</span>
                  <span class="user-role">{{
                    authService.isAdmin() ? 'Administrador' : 'Cliente'
                  }}</span>
                </div>
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>

              @if (isDropdownOpen()) {
                <div class="dropdown-menu">
                  <div class="dropdown-header">
                    <strong>{{ authService.userName() }}</strong>
                    <small>{{ authService.userEmail() }}</small>
                  </div>
                  <div class="dropdown-divider"></div>
                  <a
                    routerLink="/pedidos"
                    class="dropdown-item"
                    (click)="closeDropdown()"
                  >
                    Mis Pedidos
                  </a>
                  @if (authService.isAdmin()) {
                    <a
                      routerLink="/admin"
                      class="dropdown-item"
                      (click)="closeDropdown()"
                    >
                      Panel de Administración
                    </a>
                  }
                  <div class="dropdown-divider"></div>
                  <button
                    type="button"
                    class="dropdown-item text-danger"
                    (click)="logout()"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              }
            </div>
          } @else {
            <a routerLink="/login" class="btn btn-login"> Iniciar Sesión </a>
          }

          <!-- Mobile Hamburger Toggle -->
          <button
            type="button"
            class="mobile-toggle"
            (click)="toggleMobileNav()"
            aria-label="Menú móvil"
          >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Drawer -->
      @if (isMobileNavOpen()) {
        <div class="mobile-nav">
          <a
            routerLink="/menu"
            (click)="closeMobileNav()"
            class="mobile-nav-link"
            >Menú</a
          >
          @if (authService.isAuthenticated()) {
            <a
              routerLink="/pedidos"
              (click)="closeMobileNav()"
              class="mobile-nav-link"
              >Mis Pedidos</a
            >
          }
          @if (authService.isAdmin()) {
            <a
              routerLink="/admin"
              (click)="closeMobileNav()"
              class="mobile-nav-link text-warning"
              >Administración</a
            >
          }
          <a
            routerLink="/carrito"
            (click)="closeMobileNav()"
            class="mobile-nav-link"
          >
            Carrito ({{ cartService.totalCount() }})
          </a>
          @if (authService.isAuthenticated()) {
            <button
              type="button"
              class="mobile-nav-link btn-logout"
              (click)="logout()"
            >
              Cerrar Sesión
            </button>
          } @else {
            <a
              routerLink="/login"
              (click)="closeMobileNav()"
              class="mobile-nav-link text-primary"
              >Iniciar Sesión</a
            >
          }
        </div>
      }
    </header>
  `,
  styles: [
    `
      .navbar {
        position: sticky;
        top: 0;
        z-index: 1000;
        background: rgba(15, 23, 42, 0.94);
        backdrop-filter: blur(12px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        color: #f8fafc;
      }
      .nav-container {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 24px;
        height: 72px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
        color: #ffffff;
        font-weight: 800;
        font-size: 1.35rem;
        letter-spacing: -0.02em;
      }
      .brand-icon {
        width: 38px;
        height: 38px;
        border-radius: 10px;
        background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(249, 115, 22, 0.35);
      }
      .brand-highlight {
        color: #f97316;
      }
      .nav-links {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .nav-link {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 14px;
        border-radius: 8px;
        text-decoration: none;
        color: #94a3b8;
        font-size: 0.925rem;
        font-weight: 500;
        transition: all 0.15s ease;
      }
      .nav-link:hover {
        color: #f8fafc;
        background: rgba(255, 255, 255, 0.06);
      }
      .nav-link.active {
        color: #f8fafc;
        background: rgba(255, 255, 255, 0.12);
        font-weight: 600;
      }
      .nav-link-admin {
        color: #fbbf24;
      }
      .nav-link-admin:hover {
        color: #fde68a;
        background: rgba(251, 191, 36, 0.12);
      }
      .admin-chip {
        background: #f59e0b;
        color: #0f172a;
        font-size: 0.65rem;
        font-weight: 800;
        padding: 2px 6px;
        border-radius: 4px;
        letter-spacing: 0.05em;
      }
      .nav-actions {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .cart-btn {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 42px;
        height: 42px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.06);
        color: #f8fafc;
        text-decoration: none;
        transition: all 0.2s;
      }
      .cart-btn:hover {
        background: rgba(249, 115, 22, 0.2);
        color: #f97316;
        transform: translateY(-1px);
      }
      .cart-badge {
        position: absolute;
        top: -4px;
        right: -4px;
        background: #f97316;
        color: #ffffff;
        font-size: 0.72rem;
        font-weight: 800;
        min-width: 19px;
        height: 19px;
        border-radius: 9999px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 4px;
        box-shadow: 0 0 10px rgba(249, 115, 22, 0.6);
        animation: pop 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      }
      @keyframes pop {
        0% {
          transform: scale(0.6);
        }
        100% {
          transform: scale(1);
        }
      }
      .role-switch-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        border-radius: 8px;
        font-size: 0.75rem;
        font-weight: 700;
        cursor: pointer;
        border: 1px solid rgba(255, 255, 255, 0.15);
        background: rgba(255, 255, 255, 0.06);
        color: #94a3b8;
        transition: all 0.2s;
      }
      .role-switch-btn:hover {
        background: rgba(255, 255, 255, 0.12);
        color: #ffffff;
      }
      .role-switch-btn.role-admin {
        background: rgba(245, 158, 11, 0.15);
        border-color: #f59e0b;
        color: #fbbf24;
      }
      .user-menu {
        position: relative;
      }
      .user-pill {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 4px 10px 4px 6px;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 9999px;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .user-pill:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      .user-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        font-weight: 700;
      }
      .user-info {
        display: flex;
        flex-direction: column;
        text-align: left;
      }
      .user-name {
        font-size: 0.8125rem;
        font-weight: 600;
        color: #f8fafc;
        line-height: 1.2;
      }
      .user-role {
        font-size: 0.7rem;
        color: #94a3b8;
        line-height: 1.2;
      }
      .dropdown-menu {
        position: absolute;
        right: 0;
        top: calc(100% + 8px);
        background: #1e293b;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 8px 0;
        min-width: 220px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
        z-index: 1001;
        animation: dropDown 0.15s ease-out;
      }
      @keyframes dropDown {
        from {
          opacity: 0;
          transform: translateY(-6px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .dropdown-header {
        padding: 10px 16px;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .dropdown-header strong {
        font-size: 0.875rem;
        color: #f8fafc;
      }
      .dropdown-header small {
        font-size: 0.75rem;
        color: #94a3b8;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .dropdown-divider {
        height: 1px;
        background: rgba(255, 255, 255, 0.08);
        margin: 6px 0;
      }
      .dropdown-item {
        display: block;
        width: 100%;
        padding: 8px 16px;
        text-align: left;
        font-size: 0.875rem;
        color: #cbd5e1;
        text-decoration: none;
        background: none;
        border: none;
        cursor: pointer;
        transition: all 0.15s;
      }
      .dropdown-item:hover {
        background: rgba(255, 255, 255, 0.08);
        color: #ffffff;
      }
      .text-danger {
        color: #f87171 !important;
      }
      .text-danger:hover {
        background: rgba(239, 68, 68, 0.15) !important;
        color: #fecaca !important;
      }
      .btn-login {
        background: #f97316;
        color: #ffffff;
        padding: 8px 18px;
        border-radius: 8px;
        text-decoration: none;
        font-size: 0.875rem;
        font-weight: 600;
        transition: all 0.2s;
      }
      .btn-login:hover {
        background: #ea580c;
      }
      .mobile-toggle {
        display: none;
        background: none;
        border: none;
        color: #f8fafc;
        cursor: pointer;
        padding: 4px;
      }
      .mobile-nav {
        display: none;
        flex-direction: column;
        background: #0f172a;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        padding: 12px 24px;
        gap: 10px;
      }
      .mobile-nav-link {
        padding: 10px 0;
        color: #cbd5e1;
        text-decoration: none;
        font-weight: 500;
        font-size: 0.95rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        background: none;
        border: none;
        text-align: left;
        cursor: pointer;
      }
      .text-warning {
        color: #fbbf24 !important;
      }
      .text-primary {
        color: #f97316 !important;
      }
      @media (max-width: 900px) {
        .nav-links,
        .user-info {
          display: none;
        }
        .mobile-toggle {
          display: block;
        }
        .mobile-nav {
          display: flex;
        }
      }
    `,
  ],
})
export class HeaderComponent {
  readonly authService = inject(AuthService);
  readonly cartService = inject(CartService);

  readonly isDropdownOpen = signal<boolean>(false);
  readonly isMobileNavOpen = signal<boolean>(false);

  get userInitials(): string {
    const name = this.authService.userName();
    return (
      name
        .split(' ')
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase() || 'U'
    );
  }

  toggleDropdown(): void {
    this.isDropdownOpen.update((v) => !v);
  }

  closeDropdown(): void {
    this.isDropdownOpen.set(false);
  }

  toggleMobileNav(): void {
    this.isMobileNavOpen.update((v) => !v);
  }

  closeMobileNav(): void {
    this.isMobileNavOpen.set(false);
  }

  toggleDemoRole(): void {
    const nextRole = this.authService.isAdmin() ? 'USER' : 'ADMIN';
    this.authService.setDemoUser(nextRole);
  }

  logout(): void {
    this.closeDropdown();
    this.closeMobileNav();
    this.authService.logout();
  }
}
