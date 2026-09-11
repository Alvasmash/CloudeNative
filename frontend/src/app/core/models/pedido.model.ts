import { EstadoPedido } from './estado-pedido.model';
import { ItemPedido } from './item-pedido.model';

export interface Pedido {
  id: number;
  numeroPedido: string;
  clienteNombre: string;
  clienteEmail: string;
  fechaCreacion: string;
  estado: EstadoPedido;
  total: number;
  items: ItemPedido[];
}
