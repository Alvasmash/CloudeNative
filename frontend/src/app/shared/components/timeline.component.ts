import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadoPedido } from '../../core/models/estado-pedido.model';

interface Step {
  estado: EstadoPedido;
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-order-timeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (currentEstado === EstadoPedido.CANCELADO) {
      <div class="cancelled-banner">
        <div class="cancelled-icon">
          <svg
            viewBox="0 0 24 24"
            width="28"
            height="28"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <div>
          <h4 class="cancelled-title">Este pedido fue Cancelado</h4>
          <p class="cancelled-desc">
            La orden no continúa en curso. Si requieres asistencia, contacta al
            soporte.
          </p>
        </div>
      </div>
    } @else {
      <div class="timeline-wrapper">
        <div class="timeline-steps">
          @for (step of steps; track step.estado; let i = $index) {
            <div
              class="step-item"
              [class.completed]="isStepCompleted(step.estado)"
              [class.active]="currentEstado === step.estado"
            >
              <div class="step-node">
                <div class="node-circle">
                  @if (
                    isStepCompleted(step.estado) &&
                    currentEstado !== step.estado
                  ) {
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="3"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  } @else {
                    <span>{{ i + 1 }}</span>
                  }
                </div>
                @if (i < steps.length - 1) {
                  <div
                    class="node-line"
                    [class.filled]="
                      isStepCompleted(steps[i + 1].estado) ||
                      currentEstado === steps[i + 1].estado
                    "
                  ></div>
                }
              </div>
              <div class="step-info">
                <span class="step-title">{{ step.title }}</span>
                <span class="step-desc">{{ step.description }}</span>
              </div>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [
    `
      .timeline-wrapper {
        padding: 16px 0;
      }
      .timeline-steps {
        display: flex;
        justify-content: space-between;
        position: relative;
      }
      .step-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        position: relative;
      }
      .step-node {
        display: flex;
        align-items: center;
        width: 100%;
        position: relative;
        margin-bottom: 12px;
      }
      .node-circle {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: #e2e8f0;
        color: #64748b;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.875rem;
        margin: 0 auto;
        z-index: 2;
        transition: all 0.3s ease;
        box-shadow: 0 0 0 4px #ffffff;
      }
      .node-line {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 3px;
        background: #e2e8f0;
        z-index: 1;
        transform: translateY(-50%);
        transition: background 0.3s ease;
      }
      .node-line.filled {
        background: #10b981;
      }
      .step-item.completed .node-circle {
        background: #10b981;
        color: #ffffff;
      }
      .step-item.active .node-circle {
        background: #f97316;
        color: #ffffff;
        box-shadow: 0 0 0 5px rgba(249, 115, 22, 0.25);
        animation: pulse 2s infinite;
      }
      @keyframes pulse {
        0%,
        100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.08);
        }
      }
      .step-title {
        display: block;
        font-weight: 700;
        font-size: 0.875rem;
        color: #1e293b;
        margin-bottom: 2px;
      }
      .step-item.active .step-title {
        color: #f97316;
      }
      .step-desc {
        display: block;
        font-size: 0.75rem;
        color: #64748b;
      }
      .cancelled-banner {
        display: flex;
        align-items: center;
        gap: 16px;
        background: #fef2f2;
        border: 1px solid #fca5a5;
        border-radius: 12px;
        padding: 16px 20px;
      }
      .cancelled-icon {
        color: #dc2626;
        flex-shrink: 0;
      }
      .cancelled-title {
        color: #991b1b;
        font-size: 1rem;
        font-weight: 700;
        margin: 0 0 4px 0;
      }
      .cancelled-desc {
        color: #7f1d1d;
        font-size: 0.875rem;
        margin: 0;
      }
      @media (max-width: 640px) {
        .timeline-steps {
          flex-direction: column;
          gap: 20px;
          align-items: flex-start;
        }
        .step-item {
          flex-direction: row;
          align-items: flex-start;
          gap: 14px;
          width: 100%;
          text-align: left;
        }
        .step-node {
          width: auto;
          margin-bottom: 0;
        }
        .node-line {
          display: none;
        }
      }
    `,
  ],
})
export class OrderTimelineComponent {
  @Input({ required: true }) currentEstado!: EstadoPedido;
  readonly EstadoPedido = EstadoPedido;

  readonly steps: Step[] = [
    {
      estado: EstadoPedido.PENDIENTE,
      title: 'Pedido Recibido',
      description: 'Confirmado en sistema',
      icon: 'clock',
    },
    {
      estado: EstadoPedido.EN_PREPARACION,
      title: 'En Preparación',
      description: 'En cocina',
      icon: 'flame',
    },
    {
      estado: EstadoPedido.EN_CAMINO,
      title: 'En Camino',
      description: 'Con repartidor',
      icon: 'truck',
    },
    {
      estado: EstadoPedido.ENTREGADO,
      title: 'Entregado',
      description: 'Completado con éxito',
      icon: 'check',
    },
  ];

  private readonly orderProgression: Record<EstadoPedido, number> = {
    [EstadoPedido.PENDIENTE]: 1,
    [EstadoPedido.EN_PREPARACION]: 2,
    [EstadoPedido.EN_CAMINO]: 3,
    [EstadoPedido.ENTREGADO]: 4,
    [EstadoPedido.CANCELADO]: 0,
  };

  isStepCompleted(stepEstado: EstadoPedido): boolean {
    const currentWeight = this.orderProgression[this.currentEstado] || 0;
    const stepWeight = this.orderProgression[stepEstado] || 0;
    return currentWeight >= stepWeight;
  }
}
