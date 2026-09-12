import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { Pedido } from '../../core/models/pedido.model';
import { EstadoPedido } from '../../core/models/estado-pedido.model';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { ClpCurrencyPipe } from '../../shared/pipes/clp-currency.pipe';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DatePipe,
    StatusBadgeComponent,
    ClpCurrencyPipe,
  ],
  template: `
    <div class="orders-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Historial de Pedidos</h1>
          <p class="page-subtitle">
            Revisa el estado y detalle de tus compras gastronómicas en tiempo
            real.
          </p>
        </div>
        <a routerLink="/menu" class="btn btn-primary">
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Nuevo Pedido
        </a>
      </div>

      <!-- Filters by Status -->
      <div class="status-filters">
        <button
          type="button"
          class="filter-pill"
          [class.active]="selectedFilter() === 'ALL'"
          (click)="selectedFilter.set('ALL')"
        >
          Todos ({{ orders().length }})
        </button>
        <button
          type="button"
          class="filter-pill"
          [class.active]="selectedFilter() === EstadoPedido.PENDIENTE"
          (click)="selectedFilter.set(EstadoPedido.PENDIENTE)"
        >
          Pendientes
        </button>
        <button
          type="button"
          class="filter-pill"
          [class.active]="selectedFilter() === EstadoPedido.EN_PREPARACION"
          (click)="selectedFilter.set(EstadoPedido.EN_PREPARACION)"
        >
          En Preparación
        </button>
        <button
          type="button"
          class="filter-pill"
          [class.active]="selectedFilter() === EstadoPedido.EN_CAMINO"
          (click)="selectedFilter.set(EstadoPedido.EN_CAMINO)"
        >
          En Camino
        </button>
        <button
          type="button"
          class="filter-pill"
          [class.active]="selectedFilter() === EstadoPedido.ENTREGADO"
          (click)="selectedFilter.set(EstadoPedido.ENTREGADO)"
        >
          Entregados
        </button>
      </div>

      @if (isLoading()) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Cargando tus pedidos desde el servidor...</p>
        </div>
      } @else if (filteredOrders().length === 0) {
        <div class="empty-orders">
          <div class="empty-icon">📦</div>
          <h2>No tienes pedidos en esta categoría</h2>
          <p>
            Cuando realices una orden en el menú, podrás ver su seguimiento
            aquí.
          </p>
          <a routerLink="/menu" class="btn btn-primary">Ir al Menú</a>
        </div>
      } @else {
        <div class="orders-grid">
          @for (order of filteredOrders(); track order.id) {
            <article class="order-card">
              <div class="order-card-header">
                <div class="order-ref">
                  <span class="order-num">{{ order.numeroPedido }}</span>
                  <span class="order-date">{{
                    order.fechaCreacion | date: 'dd/MM/yyyy, HH:mm'
                  }}</span>
                </div>
                <app-status-badge [estado]="order.estado" />
              </div>

              <div class="order-card-body">
                <div class="order-meta">
                  <div class="meta-item">
                    <span class="meta-label">Cliente</span>
                    <span class="meta-value">{{ order.clienteNombre }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">Total</span>
                    <span class="meta-value text-total">{{
                      order.total | clp
                    }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">Artículos</span>
                    <span class="meta-value"
                      >{{ order.items.length }} ítem(s)</span
                    >
                  </div>
                </div>

                <!-- Preview of first items -->
                <div class="items-preview">
                  @for (item of order.items.slice(0, 2); track item.id) {
                    <span class="preview-tag">
                      {{ item.cantidad }}x {{ item.productoNombre }}
                    </span>
                  }
                  @if (order.items.length > 2) {
                    <span class="preview-tag more"
                      >+{{ order.items.length - 2 }} más</span
                    >
                  }
                </div>
              </div>

              <div class="order-card-footer">
                <a [routerLink]="['/pedidos', order.id]" class="btn-detail">
                  <span>Ver Detalle y Seguimiento</span>
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </article>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .orders-page {
        max-width: 1280px;
        margin: 0 auto;
        padding: 32px 24px 64px;
      }
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;
        margin-bottom: 28px;
      }
      .page-title {
        font-size: 2rem;
        font-weight: 800;
        color: #0f172a;
        margin: 0 0 4px 0;
        letter-spacing: -0.02em;
      }
      .page-subtitle {
        font-size: 0.95rem;
        color: #64748b;
        margin: 0;
      }
      .status-filters {
        display: flex;
        gap: 8px;
        overflow-x: auto;
        padding-bottom: 8px;
        margin-bottom: 28px;
      }
      .filter-pill {
        padding: 7px 16px;
        border-radius: 9999px;
        background: #ffffff;
        border: 1px solid #e2e8f0;
        color: #64748b;
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.15s ease;
      }
      .filter-pill:hover {
        background: #f8fafc;
        border-color: #cbd5e1;
      }
      .filter-pill.active {
        background: #0f172a;
        border-color: #0f172a;
        color: #ffffff;
      }
      .orders-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
        gap: 24px;
      }
      .order-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        display: flex;
        flex-direction: column;
        gap: 16px;
        transition: all 0.2s ease;
      }
      .order-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 20px -5px rgba(15, 23, 42, 0.1);
        border-color: #cbd5e1;
      }
      .order-card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        border-bottom: 1px solid #f1f5f9;
        padding-bottom: 14px;
      }
      .order-ref {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .order-num {
        font-size: 1.05rem;
        font-weight: 800;
        color: #0f172a;
        letter-spacing: -0.01em;
      }
      .order-date {
        font-size: 0.775rem;
        color: #94a3b8;
      }
      .order-card-body {
        display: flex;
        flex-direction: column;
        gap: 14px;
        flex: 1;
      }
      .order-meta {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
      }
      .meta-item {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .meta-label {
        font-size: 0.7rem;
        color: #94a3b8;
        text-transform: uppercase;
        font-weight: 600;
      }
      .meta-value {
        font-size: 0.9rem;
        font-weight: 700;
        color: #1e293b;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .text-total {
        color: #f97316;
      }
      .items-preview {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .preview-tag {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        color: #475569;
        font-size: 0.775rem;
        padding: 3px 8px;
        border-radius: 6px;
        font-weight: 500;
      }
      .preview-tag.more {
        background: #f1f5f9;
        color: #64748b;
      }
      .order-card-footer {
        border-top: 1px solid #f1f5f9;
        padding-top: 14px;
      }
      .btn-detail {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        text-decoration: none;
        color: #f97316;
        font-weight: 700;
        font-size: 0.9rem;
        padding: 6px 0;
        transition: color 0.15s;
      }
      .btn-detail:hover {
        color: #ea580c;
      }
      .loading-state,
      .empty-orders {
        text-align: center;
        padding: 64px 20px;
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
      .empty-icon {
        font-size: 3rem;
        margin-bottom: 12px;
      }
      .btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 20px;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
        transition: all 0.18s;
        border: none;
      }
      .btn-primary {
        background: #f97316;
        color: #ffffff;
      }
      .btn-primary:hover {
        background: #ea580c;
      }
    `,
  ],
})
export class OrdersListComponent implements OnInit {
  private readonly orderService = inject(OrderService);

  readonly EstadoPedido = EstadoPedido;
  readonly orders = signal<Pedido[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly selectedFilter = signal<string>('ALL');

  readonly filteredOrders = computed(() => {
    const list = this.orders();
    const filter = this.selectedFilter();
    if (filter === 'ALL') return list;
    return list.filter((o) => o.estado === filter);
  });

  ngOnInit(): void {
    this.orderService.getMisPedidos().subscribe({
      next: (data) => {
        this.orders.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }
}
