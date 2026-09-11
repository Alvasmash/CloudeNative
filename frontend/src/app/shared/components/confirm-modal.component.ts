import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div class="modal-backdrop" (click)="onCancel()">
        <div class="modal-dialog" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-icon" [ngClass]="'icon-' + variant">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <div>
              <h3 class="modal-title">{{ title }}</h3>
              <p class="modal-desc">{{ message }}</p>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" (click)="onCancel()">
              {{ cancelText }}
            </button>
            <button
              type="button"
              class="btn"
              [ngClass]="variant === 'danger' ? 'btn-danger' : 'btn-primary'"
              (click)="onConfirm()"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(11, 19, 37, 0.65);
      backdrop-filter: blur(4px);
      z-index: 9998;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      animation: fadeIn 0.2s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .modal-dialog {
      background: #FFFFFF;
      border-radius: 16px;
      max-width: 460px;
      width: 100%;
      padding: 24px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.08);
      animation: scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes scaleUp {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .modal-header {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      margin-bottom: 24px;
    }
    .modal-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .icon-danger {
      background: #FEE2E2;
      color: #DC2626;
    }
    .icon-warning {
      background: #FEF3C7;
      color: #D97706;
    }
    .icon-primary {
      background: #EFF6FF;
      color: #2563EB;
    }
    .modal-title {
      font-size: 1.125rem;
      font-weight: 700;
      color: #0F172A;
      margin: 0 0 6px 0;
    }
    .modal-desc {
      font-size: 0.9rem;
      color: #64748B;
      margin: 0;
      line-height: 1.5;
    }
    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
    .btn {
      padding: 10px 18px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.15s ease;
    }
    .btn-secondary {
      background: #F1F5F9;
      color: #475569;
    }
    .btn-secondary:hover {
      background: #E2E8F0;
    }
    .btn-danger {
      background: #DC2626;
      color: #FFFFFF;
    }
    .btn-danger:hover {
      background: #B91C1C;
    }
    .btn-primary {
      background: #F97316;
      color: #FFFFFF;
    }
    .btn-primary:hover {
      background: #EA580C;
    }
  `]
})
export class ConfirmModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirmar acción';
  @Input() message = '¿Estás seguro de continuar con esta operación?';
  @Input() confirmText = 'Confirmar';
  @Input() cancelText = 'Cancelar';
  @Input() variant: 'danger' | 'warning' | 'primary' = 'primary';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
