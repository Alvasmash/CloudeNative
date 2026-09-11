import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AdminDashboardResponse } from '../models/admin-dashboard.model';
import { Pedido } from '../models/pedido.model';
import { EstadoPedido } from '../models/estado-pedido.model';
import { EstadoPedidoDTO } from '../models/pedido-create.model';
import { ToastService } from './toast.service';

const DEMO_ORDERS_KEY = 'pedidos360_demo_orders';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly toastService = inject(ToastService);
  private readonly apiUrl = `${environment.apiUrl}/api/admin/pedidos`;

  private getStoredOrders(): Pedido[] {
    const raw = sessionStorage.getItem(DEMO_ORDERS_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  private saveStoredOrders(orders: Pedido[]): void {
    sessionStorage.setItem(DEMO_ORDERS_KEY, JSON.stringify(orders));
  }

  /**
   * Obtiene el listado completo de pedidos y metricas de recaudacion
   * Exige ROLE_ADMIN en el backend
   */
  getDashboardData(): Observable<AdminDashboardResponse> {
    return this.http.get<AdminDashboardResponse>(this.apiUrl).pipe(
      catchError(err => {
        console.warn('Fallo GET /api/admin/pedidos, calculando metricas locales:', err);
        const orders = this.getStoredOrders();
        const totalRecaudado = orders.reduce((sum, o) => sum + o.total, 0);
        return of({
          totalPedidos: orders.length,
          totalRecaudado,
          pedidos: orders
        });
      })
    );
  }

  /**
   * Actualiza el estado de una orden (PATCH /api/admin/pedidos/{id}/estado)
   * Exige ROLE_ADMIN
   */
  actualizarEstado(id: number, nuevoEstado: EstadoPedido): Observable<Pedido> {
    const dto: EstadoPedidoDTO = { estado: nuevoEstado };
    return this.http.patch<Pedido>(`${this.apiUrl}/${id}/estado`, dto).pipe(
      tap(actualizado => {
        this.toastService.success(`Estado actualizado a ${nuevoEstado} para orden #${id}`);
      }),
      catchError(err => {
        console.warn(`Fallo PATCH estado orden ${id}, aplicando localmente:`, err);
        const orders = this.getStoredOrders();
        const idx = orders.findIndex(o => o.id === Number(id));
        if (idx !== -1) {
          orders[idx].estado = nuevoEstado;
          this.saveStoredOrders(orders);
          this.toastService.success(`Estado actualizado localmente: ${nuevoEstado}`);
          return of(orders[idx]);
        }
        throw err;
      })
    );
  }

  /**
   * Elimina un pedido permanentemente (DELETE /api/admin/pedidos/{id})
   * Exige ROLE_ADMIN
   */
  eliminarPedido(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.toastService.success(`Pedido #${id} eliminado satisfactoriamente`);
      }),
      catchError(err => {
        console.warn(`Fallo DELETE pedido ${id}, eliminando de sesion local:`, err);
        const orders = this.getStoredOrders().filter(o => o.id !== Number(id));
        this.saveStoredOrders(orders);
        this.toastService.success(`Pedido #${id} eliminado de la vista local`);
        return of(void 0);
      })
    );
  }
}
