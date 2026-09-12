import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { Pedido } from '../../core/models/pedido.model';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { OrderTimelineComponent } from '../../shared/components/timeline.component';
import { ClpCurrencyPipe } from '../../shared/pipes/clp-currency.pipe';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DatePipe,
    StatusBadgeComponent,
    OrderTimelineComponent,
    ClpCurrencyPipe,
  ],
  template: `
    <div class="order-detail-page">
      <!-- Back navigation -->
      <div class="back-bar">
        <a routerLink="/pedidos" class="btn-back">
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Volver a Mis Pedidos
        </a>
      </div>

      @if (isLoading()) {
        <div class="loading-box">
          <div class="spinner"></div>
          <p>Cargando detalle del pedido...</p>
        </div>
      } @else if (!order()) {
        <div class="not-found-card">
          <h2>Pedido no encontrado</h2>
          <p>
            No se pudo localizar la orden solicitada. Es posible que haya sido
            eliminada o que el ID sea inválido.
          </p>
          <a routerLink="/pedidos" class="btn btn-primary"
            >Volver al Historial</a
          >
        </div>
      } @else {
        <!-- Main Detail Content -->
        <div class="detail-container">
          <!-- Top summary banner -->
          <div class="summary-banner">
            <div class="banner-info">
              <span class="banner-tag">Orden Confirmada</span>
              <h1 class="order-code">{{ order()!.numeroPedido }}</h1>
              <span class="order-timestamp">
                Realizado el
                {{ order()!.fechaCreacion | date: 'dd/MM/yyyy, HH:mm' }}
              </span>
            </div>
            <div class="banner-status">
              <app-status-badge [estado]="order()!.estado" />
            </div>
          </div>

          <!-- Visual Timeline Stepper -->
          <div class="timeline-card">
            <h3 class="card-section-title">Seguimiento en Tiempo Real</h3>
            <app-order-timeline [currentEstado]="order()!.estado" />
          </div>

          <!-- Two-column Info: Items vs Customer -->
          <div class="detail-grid">
            <!-- Items Breakdown Column -->
            <div class="items-column">
              <div class="card">
                <h3 class="card-section-title">Detalle de Productos</h3>
                <div class="items-table-wrapper">
                  <table class="items-table">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th class="text-center">Cant.</th>
                        <th class="text-right">Precio Unitario</th>
                        <th class="text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (item of order()!.items; track item.id) {
                        <tr>
                          <td>
                            <strong class="item-product-name">{{
                              item.productoNombre
                            }}</strong>
                            <small class="item-ref"
                              >Cód. #{{ item.productoId }}</small
                            >
                          </td>
                          <td class="text-center">{{ item.cantidad }}</td>
                          <td class="text-right">
                            {{ item.precioUnitario | clp }}
                          </td>
                          <td class="text-right item-subtotal-cell">
                            {{ item.subtotal | clp }}
                          </td>
                        </tr>
                      }
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colspan="3" class="text-right foot-label">
                          Total Pagado:
                        </td>
                        <td class="text-right foot-total">
                          {{ order()!.total | clp }}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            <!-- Customer & Delivery Column -->
            <div class="customer-column">
              <div class="card">
                <h3 class="card-section-title">Datos del Receptor</h3>
                <div class="info-list">
                  <div class="info-item">
                    <span class="info-label">Nombre del Cliente</span>
                    <strong class="info-val">{{
                      order()!.clienteNombre
                    }}</strong>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Correo de Notificación</span>
                    <span class="info-val">{{ order()!.clienteEmail }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Método de Pago</span>
                    <span class="info-val">Pago Contra Entrega / Digital</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">ID de Registro</span>
                    <span class="info-val">#{{ order()!.id }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .order-detail-page {
        max-width: 1100px;
        margin: 0 auto;
        padding: 32px 24px 64px;
      }
      .back-bar {
        margin-bottom: 24px;
      }
      .btn-back {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: #64748b;
        text-decoration: none;
        font-weight: 600;
        font-size: 0.9rem;
        transition: color 0.15s;
      }
      .btn-back:hover {
        color: #0f172a;
      }
      .detail-container {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }
      .summary-banner {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        border-radius: 20px;
        padding: 36px 32px;
        color: #ffffff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 20px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
      }
      .banner-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .banner-tag {
        font-size: 0.75rem;
        font-weight: 700;
        color: #fb923c;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .order-code {
        font-size: 2.25rem;
        font-weight: 900;
        margin: 0;
        letter-spacing: -0.02em;
      }
      .order-timestamp {
        font-size: 0.875rem;
        color: #94a3b8;
      }
      .timeline-card,
      .card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      }
      .card-section-title {
        font-size: 1.1rem;
        font-weight: 800;
        color: #0f172a;
        margin: 0 0 20px 0;
      }
      .detail-grid {
        display: grid;
        grid-template-columns: 1fr 340px;
        gap: 24px;
        align-items: flex-start;
      }
      .items-table-wrapper {
        overflow-x: auto;
      }
      .items-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9rem;
      }
      .items-table th {
        text-align: left;
        color: #64748b;
        font-weight: 600;
        font-size: 0.775rem;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        padding-bottom: 12px;
        border-bottom: 2px solid #f1f5f9;
      }
      .items-table td {
        padding: 14px 0;
        border-bottom: 1px solid #f1f5f9;
        color: #334155;
      }
      .item-product-name {
        display: block;
        color: #0f172a;
      }
      .item-ref {
        color: #94a3b8;
        font-size: 0.75rem;
      }
      .item-subtotal-cell {
        font-weight: 700;
        color: #0f172a;
      }
      .text-center {
        text-align: center;
      }
      .text-right {
        text-align: right;
      }
      .foot-label {
        font-weight: 700;
        color: #0f172a;
        font-size: 1rem;
        padding-top: 16px;
      }
      .foot-total {
        font-weight: 900;
        font-size: 1.4rem;
        color: #f97316;
        padding-top: 16px;
      }
      .info-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .info-item {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .info-label {
        font-size: 0.75rem;
        color: #94a3b8;
        text-transform: uppercase;
        font-weight: 600;
      }
      .info-val {
        font-size: 0.95rem;
        color: #0f172a;
      }
      .loading-box,
      .not-found-card {
        text-align: center;
        padding: 64px 24px;
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
      }
      .spinner {
        width: 36px;
        height: 36px;
        border: 3px solid #e2e8f0;
        border-top-color: #f97316;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin: 0 auto 16px;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      .btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 20px;
        border-radius: 10px;
        font-weight: 600;
        text-decoration: none;
        border: none;
        cursor: pointer;
      }
      .btn-primary {
        background: #f97316;
        color: #ffffff;
      }
      @media (max-width: 800px) {
        .detail-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class OrderDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly orderService = inject(OrderService);

  readonly order = signal<Pedido | null>(null);
  readonly isLoading = signal<boolean>(true);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.isLoading.set(false);
      return;
    }

    this.orderService.getPedidoById(id).subscribe({
      next: (order) => {
        this.order.set(order);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }
}
