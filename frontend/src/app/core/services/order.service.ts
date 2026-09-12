import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Pedido } from '../models/pedido.model';
import { PedidoCreateDTO } from '../models/pedido-create.model';
import { EstadoPedido } from '../models/estado-pedido.model';
import { ToastService } from './toast.service';

const DEMO_ORDERS_KEY = 'pedidos360_demo_orders';

// Pedido inicial de demostracion sincronizado con data.sql
const INITIAL_DEMO_ORDER: Pedido = {
  id: 1,
  numeroPedido: 'ORD-2026-001',
  clienteNombre: 'Juan Pérez',
  clienteEmail: 'juan.perez@duocuc.cl',
  fechaCreacion: new Date(Date.now() - 3600000 * 4).toISOString(),
  estado: EstadoPedido.ENTREGADO,
  total: 16480.0,
  items: [
    {
      id: 1,
      productoId: 1,
      productoNombre: 'Pizza Margherita',
      cantidad: 1,
      precioUnitario: 8990.0,
      subtotal: 8990.0,
    },
    {
      id: 2,
      productoId: 3,
      productoNombre: 'Hamburguesa Doble Smash',
      cantidad: 1,
      precioUnitario: 7490.0,
      subtotal: 7490.0,
    },
  ],
};

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly toastService = inject(ToastService);
  private readonly apiUrl = `${environment.apiUrl}/api/pedidos`;

  private getStoredDemoOrders(): Pedido[] {
    const raw = sessionStorage.getItem(DEMO_ORDERS_KEY);
    if (!raw) {
      const initial = [INITIAL_DEMO_ORDER];
      sessionStorage.setItem(DEMO_ORDERS_KEY, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [INITIAL_DEMO_ORDER];
    }
  }

  private saveDemoOrder(pedido: Pedido): void {
    const current = this.getStoredDemoOrders();
    const updated = [pedido, ...current];
    sessionStorage.setItem(DEMO_ORDERS_KEY, JSON.stringify(updated));
  }

  /**
   * Crea un nuevo pedido enviando PedidoCreateDTO
   * Requiere el scope delegado recurso.write en el backend
   */
  crearPedido(dto: PedidoCreateDTO): Observable<Pedido> {
    return this.http.post<Pedido>(this.apiUrl, dto).pipe(
      tap((nuevoPedido) => {
        this.toastService.success(
          `Pedido creado con éxito: ${nuevoPedido.numeroPedido}`,
        );
      }),
      catchError((err) => {
        console.warn(
          'Fallo llamada HTTP crearPedido, usando simulador local:',
          err,
        );
        const demoId = Math.floor(Math.random() * 9000) + 1000;
        const fakeOrder: Pedido = {
          id: demoId,
          numeroPedido: `PED-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          clienteNombre: dto.clienteNombre,
          clienteEmail: dto.clienteEmail,
          fechaCreacion: new Date().toISOString(),
          estado: EstadoPedido.PENDIENTE,
          total: dto.items.reduce((sum, item) => sum + item.cantidad * 8990, 0),
          items: dto.items.map((i, idx) => ({
            id: idx + 1,
            productoId: i.productoId,
            productoNombre: `Producto #${i.productoId}`,
            cantidad: i.cantidad,
            precioUnitario: 8990,
            subtotal: i.cantidad * 8990,
          })),
        };
        this.saveDemoOrder(fakeOrder);
        this.toastService.success(
          `Pedido registrado localmente: ${fakeOrder.numeroPedido}`,
        );
        return of(fakeOrder);
      }),
    );
  }

  /**
   * Obtiene todos los pedidos del usuario autenticado
   */
  getMisPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.apiUrl).pipe(
      catchError((err) => {
        console.warn(
          'Fallo llamada HTTP getMisPedidos, usando pedidos de sesion:',
          err,
        );
        return of(this.getStoredDemoOrders());
      }),
    );
  }

  /**
   * Obtiene el detalle de un pedido por su ID
   */
  getPedidoById(id: number): Observable<Pedido | null> {
    return this.http.get<Pedido>(`${this.apiUrl}/${id}`).pipe(
      catchError((err) => {
        console.warn(
          `Fallo HTTP getPedidoById(${id}), buscando en pedidos locales:`,
          err,
        );
        const found =
          this.getStoredDemoOrders().find((p) => p.id === Number(id)) || null;
        return of(found);
      }),
    );
  }
}
