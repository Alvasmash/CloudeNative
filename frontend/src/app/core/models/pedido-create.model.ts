export interface ItemPedidoCreate {
  productoId: number;
  cantidad: number;
}

export interface PedidoCreateDTO {
  clienteNombre: string;
  clienteEmail: string;
  items: ItemPedidoCreate[];
}

export interface EstadoPedidoDTO {
  estado: string;
}
