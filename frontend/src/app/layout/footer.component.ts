import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-brand">
          <div class="footer-logo">
            <span class="logo-icon">🍽️</span>
            <strong>Pedidos<span class="text-orange">360</span></strong>
          </div>
          <p class="footer-desc">
            Plataforma Cloud Native de gestión de pedidos gastronómicos en tiempo real.
            Desarrollado para DSY1107 - Desarrollo Cloud Native I.
          </p>
        </div>

        <div class="footer-meta">
          <div class="architecture-pill">
            <span class="status-dot"></span>
            Arquitectura: Angular 19 + MSAL &bull; Spring Boot 3.4 &bull; H2 / RDS
          </div>
          <p class="copyright">
            &copy; {{ currentYear }} Pedidos360 &bull; Duoc UC &bull; Evaluación Parcial N° 1
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: #0B1325;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      color: #94A3B8;
      padding: 36px 0 24px 0;
      margin-top: auto;
    }
    .footer-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
    }
    .footer-brand {
      max-width: 480px;
    }
    .footer-logo {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.15rem;
      font-weight: 800;
      color: #FFFFFF;
      margin-bottom: 8px;
    }
    .text-orange {
      color: #F97316;
    }
    .footer-desc {
      font-size: 0.85rem;
      line-height: 1.5;
      margin: 0;
      color: #64748B;
    }
    .footer-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;
    }
    .architecture-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 9999px;
      font-size: 0.775rem;
      font-weight: 600;
      color: #CBD5E1;
    }
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10B981;
      box-shadow: 0 0 6px #10B981;
    }
    .copyright {
      font-size: 0.8rem;
      color: #64748B;
      margin: 0;
    }
    @media (max-width: 768px) {
      .footer-container {
        flex-direction: column;
        align-items: flex-start;
      }
      .footer-meta {
        align-items: flex-start;
      }
    }
  `]
})
export class FooterComponent {
  readonly currentYear = new Date().getFullYear();
}
