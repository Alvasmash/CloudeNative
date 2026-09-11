import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  readonly toasts = signal<Toast[]>([]);

  show(toast: Omit<Toast, 'id'>): void {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      id,
      duration: 4500,
      ...toast
    };

    this.toasts.update(current => [...current, newToast]);

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => this.remove(id), newToast.duration);
    }
  }

  success(message: string, title: string = 'Éxito'): void {
    this.show({ message, title, type: 'success' });
  }

  error(message: string, title: string = 'Error'): void {
    this.show({ message, title, type: 'error' });
  }

  warning(message: string, title: string = 'Advertencia'): void {
    this.show({ message, title, type: 'warning' });
  }

  info(message: string, title: string = 'Información'): void {
    this.show({ message, title, type: 'info' });
  }

  remove(id: string): void {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }
}
