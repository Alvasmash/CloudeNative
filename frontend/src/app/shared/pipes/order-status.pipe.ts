import { Pipe, PipeTransform } from '@angular/core';
import {
  EstadoPedido,
  ESTADO_PEDIDO_CONFIG,
} from '../../core/models/estado-pedido.model';

@Pipe({
  name: 'orderStatus',
  standalone: true,
})
export class OrderStatusPipe implements PipeTransform {
  transform(value: EstadoPedido | string | null | undefined): string {
    if (!value) return 'Desconocido';
    const config = ESTADO_PEDIDO_CONFIG[value as EstadoPedido];
    return config ? config.label : value;
  }
}
