import { Pedido } from './pedido.model';

export interface AdminDashboardResponse {
  totalPedidos: number;
  totalRecaudado: number;
  pedidos: Pedido[];
}
