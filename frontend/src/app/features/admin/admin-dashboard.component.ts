import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';
import { Pedido } from '../../core/models/pedido.model';
import { EstadoPedido } from '../../core/models/estado-pedido.model';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal.component';
import { ClpCurrencyPipe } from '../../shared/pipes/clp-currency.pipe';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    DatePipe,
    StatusBadgeComponent,
    ConfirmModalComponent,
    ClpCurrencyPipe
  ],
  template: `
    <div class="admin-page">
      <!-- Admin Header -->
      <div class="admin-header">
        <div>
          <div class="admin-badge">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Área Restringida &bull; Rol ROLE_ADMIN
          </div>
          <h1 class="admin-title">Panel de Administración</h1>
          <p class="admin-subtitle">Control integral de pedidos, recaudación en tiempo real y flujo de cocina.</p>
        </div>

        <button type="button" class="btn btn-refresh" (click)="loadData()" [disabled]="isLoading()">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" [class.spinning]="isLoading()">
            <path d="M23 4v6h-6M1 20v-6h6"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          Actualizar Datos
        </button>
      </div>

      <!-- KPI Metrics Cards -->
      <div class="metrics-grid">
        <div class="kpi-card highlight-revenue">
          <div class="kpi-icon">💰</div>
          <div class="kpi-info">
            <span class="kpi-label">Total Recaudado</span>
            <strong class="kpi-val">{{ totalRecaudado() | clp }}</strong>
            <small class="kpi-sub">Suma global de ventas</small>
          </div>
        </div>

        <div class="kpi-card highlight-orders">
          <div class="kpi-icon">📋</div>
          <div class="kpi-info">
            <span class="kpi-label">Total Pedidos</span>
            <strong class="kpi-val">{{ totalPedidos() }}</strong>
            <small class="kpi-sub">Órdenes registradas</small>
          </div>
        </div>

        <div class="kpi-card highlight-pending">
          <div class="kpi-icon">⏳</div>
          <div class="kpi-info">
            <span class="kpi-label">Pendientes</span>
            <strong class="kpi-val">{{ countByEstado(EstadoPedido.PENDIENTE) }}</strong>
            <small class="kpi-sub">Requieren atención</small>
          </div>
        </div>

        <div class="kpi-card highlight-prep">
          <div class="kpi-icon">🔥</div>
          <div class="kpi-info">
            <span class="kpi-label">En Cocina / Preparación</span>
            <strong class="kpi-val">{{ countByEstado(EstadoPedido.EN_PREPARACION) }}</strong>
            <small class="kpi-sub">En elaboración</small>
          </div>
        </div>
      </div>

      <!-- Controls & Search -->
      <div class="admin-table-container">
        <div class="table-top-bar">
          <div class="search-box">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Buscar por cliente, email o código de pedido..."
              [(ngModel)]="searchTerm"
              class="search-input"
            />
          </div>

          <div class="filter-group">
            <label class="filter-label">Estado:</label>
            <select [(ngModel)]="statusFilter" class="filter-select">
              <option value="ALL">Todos los Estados</option>
              <option [value]="EstadoPedido.PENDIENTE">Pendientes</option>
              <option [value]="EstadoPedido.EN_PREPARACION">En Preparación</option>
              <option [value]="EstadoPedido.EN_CAMINO">En Camino</option>
              <option [value]="EstadoPedido.ENTREGADO">Entregados</option>
              <option [value]="EstadoPedido.CANCELADO">Cancelados</option>
            </select>
          </div>
        </div>

        <!-- Orders Table -->
        @if (isLoading()) {
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Cargando órdenes desde el backend...</p>
          </div>
        } @else if (filteredOrders().length === 0) {
          <div class="empty-table">
            <p>No se encontraron pedidos que coincidan con los criterios de búsqueda.</p>
          </div>
        } @else {
          <div class="table-responsive">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>N° Pedido</th>
                  <th>Cliente</th>
                  <th>Email</th>
                  <th>Fecha</th>
                  <th class="text-right">Total</th>
                  <th>Estado Actual</th>
                  <th>Cambiar Estado</th>
                  <th class="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (order of filteredOrders(); track order.id) {
                  <tr>
                    <td>
                      <a [routerLink]="['/pedidos', order.id]" class="order-code-link" title="Ver detalle">
                        {{ order.numeroPedido }}
                      </a>
                    </td>
                    <td>
                      <strong class="customer-name">{{ order.clienteNombre }}</strong>
                    </td>
                    <td>
                      <span class="customer-email">{{ order.clienteEmail }}</span>
                    </td>
                    <td class="date-cell">
                      {{ order.fechaCreacion | date:'dd/MM/yyyy HH:mm' }}
                    </td>
                    <td class="text-right total-cell">
                      {{ order.total | clp }}
                    </td>
                    <td>
                      <app-status-badge [estado]="order.estado" />
                    </td>
                    <td>
                      <!-- Direct status changer dropdown (triggers PATCH) -->
                      <select
                        [ngModel]="order.estado"
                        (ngModelChange)="onEstadoChange(order.id, $event)"
                        class="status-changer-select"
                      >
                        <option [value]="EstadoPedido.PENDIENTE">Pendiente</option>
                        <option [value]="EstadoPedido.EN_PREPARACION">En Preparación</option>
                        <option [value]="EstadoPedido.EN_CAMINO">En Camino</option>
                        <option [value]="EstadoPedido.ENTREGADO">Entregado</option>
                        <option [value]="EstadoPedido.CANCELADO">Cancelado</option>
                      </select>
                    </td>
                    <td class="text-center">
                      <div class="actions-cell">
                        <a [routerLink]="['/pedidos', order.id]" class="btn-action btn-view" title="Ver Detalle">
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                          </svg>
                        </a>
                        <button
                          type="button"
                          class="btn-action btn-delete"
                          (click)="openDeleteModal(order)"
                          title="Eliminar pedido permanentemente"
                        >
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>

      <!-- Delete Confirmation Modal -->
      <app-confirm-modal
        [isOpen]="isDeleteModalOpen()"
        title="¿Eliminar Pedido?"
        [message]="deleteModalMessage"
        confirmText="Sí, eliminar pedido"
        variant="danger"
        (confirm)="confirmDeleteOrder()"
        (cancel)="isDeleteModalOpen.set(false)"
      />
    </div>
  `,
  styles: [`
    .admin-page {
      max-width: 1360px;
      margin: 0 auto;
      padding: 32px 24px 64px;
    }
    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 32px;
    }
    .admin-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.3);
      color: #D97706;
      font-size: 0.775rem;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 6px;
      margin-bottom: 8px;
    }
    .admin-title {
      font-size: 2.15rem;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 6px 0;
      letter-spacing: -0.025em;
    }
    .admin-subtitle {
      font-size: 0.95rem;
      color: #64748B;
      margin: 0;
    }
    .btn-refresh {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      border-radius: 10px;
      background: #FFFFFF;
      border: 1px solid #CBD5E1;
      color: #334155;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-refresh:hover:not(:disabled) {
      background: #F8FAFC;
      border-color: #94A3B8;
    }
    .spinning {
      animation: spin 1s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }
    .kpi-card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 16px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04);
      transition: transform 0.2s ease;
    }
    .kpi-card:hover {
      transform: translateY(-2px);
    }
    .kpi-icon {
      font-size: 2.2rem;
      width: 56px;
      height: 56px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #F8FAFC;
    }
    .highlight-revenue .kpi-icon { background: #ECFDF5; }
    .highlight-orders .kpi-icon { background: #EFF6FF; }
    .highlight-pending .kpi-icon { background: #FEF3C7; }
    .highlight-prep .kpi-icon { background: #EDE9FE; }
    .kpi-info {
      display: flex;
      flex-direction: column;
    }
    .kpi-label {
      font-size: 0.75rem;
      color: #64748B;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.04em;
    }
    .kpi-val {
      font-size: 1.5rem;
      font-weight: 800;
      color: #0F172A;
      line-height: 1.2;
    }
    .kpi-sub {
      font-size: 0.725rem;
      color: #94A3B8;
    }
    .admin-table-container {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 16px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }
    .table-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid #F1F5F9;
      flex-wrap: wrap;
      gap: 14px;
      background: #F8FAFC;
    }
    .search-box {
      position: relative;
      flex: 1;
      max-width: 440px;
      display: flex;
      align-items: center;
    }
    .search-box svg {
      position: absolute;
      left: 12px;
      color: #94A3B8;
      pointer-events: none;
    }
    .search-input {
      width: 100%;
      padding: 8px 12px 8px 36px;
      border-radius: 8px;
      border: 1px solid #CBD5E1;
      font-size: 0.875rem;
      background: #FFFFFF;
    }
    .search-input:focus {
      outline: none;
      border-color: #F97316;
    }
    .filter-group {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .filter-label {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #475569;
    }
    .filter-select {
      padding: 8px 12px;
      border-radius: 8px;
      border: 1px solid #CBD5E1;
      background: #FFFFFF;
      font-size: 0.875rem;
      color: #1E293B;
    }
    .table-responsive {
      overflow-x: auto;
    }
    .admin-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
      text-align: left;
    }
    .admin-table th {
      padding: 14px 18px;
      background: #FFFFFF;
      color: #64748B;
      font-weight: 600;
      font-size: 0.775rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      border-bottom: 2px solid #F1F5F9;
    }
    .admin-table td {
      padding: 14px 18px;
      border-bottom: 1px solid #F1F5F9;
      color: #334155;
      vertical-align: middle;
    }
    .admin-table tr:hover {
      background: #F8FAFC;
    }
    .order-code-link {
      color: #2563EB;
      font-weight: 700;
      text-decoration: none;
    }
    .order-code-link:hover {
      text-decoration: underline;
    }
    .customer-name {
      display: block;
      color: #0F172A;
    }
    .customer-email {
      font-size: 0.8rem;
      color: #64748B;
    }
    .date-cell {
      font-size: 0.8rem;
      color: #64748B;
      white-space: nowrap;
    }
    .total-cell {
      font-weight: 800;
      color: #0F172A;
      font-size: 0.95rem;
    }
    .status-changer-select {
      padding: 6px 10px;
      border-radius: 8px;
      border: 1px solid #CBD5E1;
      font-size: 0.8125rem;
      background: #FFFFFF;
      color: #1E293B;
      cursor: pointer;
      font-weight: 500;
    }
    .status-changer-select:focus {
      outline: none;
      border-color: #F97316;
    }
    .actions-cell {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    .btn-action {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;
      transition: all 0.15s;
    }
    .btn-view {
      background: #EFF6FF;
      color: #2563EB;
    }
    .btn-view:hover {
      background: #DBEAFE;
    }
    .btn-delete {
      background: #FEF2F2;
      color: #DC2626;
    }
    .btn-delete:hover {
      background: #FEE2E2;
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .loading-state, .empty-table {
      text-align: center;
      padding: 48px 20px;
      color: #64748B;
    }
    .spinner {
      width: 32px;
      height: 32px;
      border: 3px solid #E2E8F0;
      border-top-color: #F97316;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 12px;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  readonly EstadoPedido = EstadoPedido;
  readonly orders = signal<Pedido[]>([]);
  readonly totalPedidos = signal<number>(0);
  readonly totalRecaudado = signal<number>(0);
  readonly isLoading = signal<boolean>(true);

  searchTerm: string = '';
  statusFilter: string = 'ALL';

  // Modal de confirmación de eliminación
  readonly isDeleteModalOpen = signal<boolean>(false);
  private selectedOrderToDelete: Pedido | null = null;
  deleteModalMessage: string = '';

  readonly filteredOrders = computed(() => {
    let list = this.orders();
    const query = this.searchTerm.trim().toLowerCase();
    const filter = this.statusFilter;

    if (filter !== 'ALL') {
      list = list.filter(o => o.estado === filter);
    }

    if (query) {
      list = list.filter(o =>
        o.numeroPedido.toLowerCase().includes(query) ||
        o.clienteNombre.toLowerCase().includes(query) ||
        o.clienteEmail.toLowerCase().includes(query)
      );
    }

    return list;
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    this.adminService.getDashboardData().subscribe({
      next: (data) => {
        this.orders.set(data.pedidos || []);
        this.totalPedidos.set(data.totalPedidos || (data.pedidos ? data.pedidos.length : 0));
        this.totalRecaudado.set(data.totalRecaudado || 0);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  countByEstado(estado: EstadoPedido): number {
    return this.orders().filter(o => o.estado === estado).length;
  }

  onEstadoChange(orderId: number, nuevoEstado: EstadoPedido): void {
    this.adminService.actualizarEstado(orderId, nuevoEstado).subscribe({
      next: (updatedOrder) => {
        const updatedList = this.orders().map(o => o.id === orderId ? { ...o, estado: nuevoEstado } : o);
        this.orders.set(updatedList);
      },
      error: (err) => {
        console.error('Error al actualizar estado:', err);
      }
    });
  }

  openDeleteModal(order: Pedido): void {
    this.selectedOrderToDelete = order;
    this.deleteModalMessage = `¿Estás seguro de que deseas eliminar permanentemente el pedido "${order.numeroPedido}" del cliente ${order.clienteNombre}? Esta acción no se puede deshacer.`;
    this.isDeleteModalOpen.set(true);
  }

  confirmDeleteOrder(): void {
    if (!this.selectedOrderToDelete) return;
    const id = this.selectedOrderToDelete.id;
    this.isDeleteModalOpen.set(false);

    this.adminService.eliminarPedido(id).subscribe({
      next: () => {
        const remaining = this.orders().filter(o => o.id !== id);
        this.orders.set(remaining);
        this.totalPedidos.set(remaining.length);
        this.totalRecaudado.set(remaining.reduce((sum, o) => sum + o.total, 0));
        this.selectedOrderToDelete = null;
      },
      error: (err) => {
        console.error('Error al eliminar pedido:', err);
      }
    });
  }
}
