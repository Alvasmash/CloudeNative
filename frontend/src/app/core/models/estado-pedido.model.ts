export enum EstadoPedido {
  PENDIENTE = 'PENDIENTE',
  EN_PREPARACION = 'EN_PREPARACION',
  EN_CAMINO = 'EN_CAMINO',
  ENTREGADO = 'ENTREGADO',
  CANCELADO = 'CANCELADO',
}

export interface EstadoPedidoInfo {
  label: string;
  color: string;
  bgLight: string;
  icon: string;
  description: string;
}

export const ESTADO_PEDIDO_CONFIG: Record<EstadoPedido, EstadoPedidoInfo> = {
  [EstadoPedido.PENDIENTE]: {
    label: 'Pendiente',
    color: '#D97706',
    bgLight: '#FEF3C7',
    icon: 'clock',
    description: 'Pedido recibido por el sistema',
  },
  [EstadoPedido.EN_PREPARACION]: {
    label: 'En Preparación',
    color: '#2563EB',
    bgLight: '#DBEAFE',
    icon: 'flame',
    description: 'Cocina preparando los productos',
  },
  [EstadoPedido.EN_CAMINO]: {
    label: 'En Camino',
    color: '#7C3AED',
    bgLight: '#EDE9FE',
    icon: 'truck',
    description: 'Repartidor en ruta al domicilio',
  },
  [EstadoPedido.ENTREGADO]: {
    label: 'Entregado',
    color: '#059669',
    bgLight: '#D1FAE5',
    icon: 'check-circle',
    description: 'Pedido recibido por el cliente',
  },
  [EstadoPedido.CANCELADO]: {
    label: 'Cancelado',
    color: '#DC2626',
    bgLight: '#FEE2E2',
    icon: 'x-circle',
    description: 'Pedido anulado',
  },
};
