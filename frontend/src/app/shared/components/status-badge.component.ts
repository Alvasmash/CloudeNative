import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  EstadoPedido,
  ESTADO_PEDIDO_CONFIG,
} from '../../core/models/estado-pedido.model';
import { OrderStatusPipe } from '../pipes/order-status.pipe';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule, OrderStatusPipe],
  template: `
    <span
      class="status-badge"
      [style.backgroundColor]="config.bgLight"
      [style.color]="config.color"
      [style.borderColor]="config.color + '40'"
    >
      <span class="dot" [style.backgroundColor]="config.color"></span>
      {{ estado | orderStatus }}
    </span>
  `,
  styles: [
    `
      .status-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 12px;
        border-radius: 9999px;
        font-size: 0.8125rem;
        font-weight: 600;
        border: 1px solid transparent;
        letter-spacing: 0.01em;
        white-space: nowrap;
        transition: all 0.2s ease;
      }
      .dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        display: inline-block;
        box-shadow: 0 0 6px currentColor;
      }
    `,
  ],
})
export class StatusBadgeComponent {
  @Input({ required: true }) estado!: EstadoPedido;

  get config() {
    return (
      ESTADO_PEDIDO_CONFIG[this.estado] || {
        label: this.estado,
        color: '#6B7280',
        bgLight: '#F3F4F6',
      }
    );
  }
}
