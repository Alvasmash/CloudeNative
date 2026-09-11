import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" aria-live="polite">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast-item" [ngClass]="'toast-' + toast.type">
          <div class="toast-icon">
            @switch (toast.type) {
              @case ('success') {
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              }
              @case ('error') {
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              }
              @case ('warning') {
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              }
              @default {
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              }
            }
          </div>
          <div class="toast-content">
            @if (toast.title) {
              <strong class="toast-title">{{ toast.title }}</strong>
            }
            <p class="toast-msg">{{ toast.message }}</p>
          </div>
          <button class="toast-close" (click)="toastService.remove(toast.id)" aria-label="Cerrar">
            &times;
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 420px;
      width: calc(100% - 48px);
      pointer-events: none;
    }
    .toast-item {
      pointer-events: auto;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 14px 18px;
      border-radius: 12px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(12px);
      animation: slideIn 0.28s cubic-bezier(0.16, 1, 0.3, 1);
      color: #1E293B;
      border-left: 5px solid;
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .toast-success {
      background: #ECFDF5;
      border-color: #10B981;
      color: #065F46;
    }
    .toast-error {
      background: #FEF2F2;
      border-color: #EF4444;
      color: #991B1B;
    }
    .toast-warning {
      background: #FFFBEB;
      border-color: #F59E0B;
      color: #92400E;
    }
    .toast-info {
      background: #EFF6FF;
      border-color: #3B82F6;
      color: #1E40AF;
    }
    .toast-icon {
      flex-shrink: 0;
      margin-top: 2px;
    }
    .toast-content {
      flex: 1;
    }
    .toast-title {
      display: block;
      font-size: 0.875rem;
      font-weight: 700;
      margin-bottom: 2px;
    }
    .toast-msg {
      font-size: 0.84rem;
      margin: 0;
      line-height: 1.4;
    }
    .toast-close {
      background: none;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
      color: currentColor;
      opacity: 0.6;
      padding: 0;
      line-height: 1;
      transition: opacity 0.15s;
    }
    .toast-close:hover {
      opacity: 1;
    }
  `]
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);
}
