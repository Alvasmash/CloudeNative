import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Producto } from '../models/producto.model';
import { PedidoCreateDTO } from '../models/pedido-create.model';
import { ToastService } from './toast.service';

export interface CartItem {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

const CART_STORAGE_KEY = 'pedidos360_cart_items';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly toastService = inject(ToastService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly items = signal<CartItem[]>([]);

  readonly totalCount = computed(() =>
    this.items().reduce((acc, item) => acc + item.cantidad, 0)
  );

  readonly totalPrice = computed(() =>
    this.items().reduce((acc, item) => acc + item.subtotal, 0)
  );

  readonly isEmpty = computed(() => this.items().length === 0);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCartFromStorage();
    }
  }

  private loadCartFromStorage(): void {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as CartItem[];
        this.items.set(parsed);
      } catch {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
  }

  private saveCartToStorage(items: CartItem[]): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }

  addItem(producto: Producto, cantidad: number = 1): boolean {
    if (cantidad <= 0) return false;

    const currentItems = [...this.items()];
    const existingIndex = currentItems.findIndex(i => i.producto.id === producto.id);

    if (existingIndex > -1) {
      const currentQty = currentItems[existingIndex].cantidad;
      const targetQty = currentQty + cantidad;

      if (targetQty > producto.stock) {
        this.toastService.warning(
          `Stock insuficiente. Solo quedan ${producto.stock} unidades de ${producto.nombre}.`,
          'Límite de Stock'
        );
        return false;
      }

      currentItems[existingIndex] = {
        producto,
        cantidad: targetQty,
        subtotal: targetQty * producto.precio
      };
    } else {
      if (cantidad > producto.stock) {
        this.toastService.warning(
          `Solo hay ${producto.stock} unidades disponibles de ${producto.nombre}.`,
          'Límite de Stock'
        );
        return false;
      }

      currentItems.push({
        producto,
        cantidad,
        subtotal: cantidad * producto.precio
      });
    }

    this.items.set(currentItems);
    this.saveCartToStorage(currentItems);
    this.toastService.success(`Agregado al carrito: ${producto.nombre}`);
    return true;
  }

  updateQuantity(productoId: number, nuevaCantidad: number): boolean {
    if (nuevaCantidad <= 0) {
      this.removeItem(productoId);
      return true;
    }

    const currentItems = [...this.items()];
    const index = currentItems.findIndex(i => i.producto.id === productoId);
    if (index === -1) return false;

    const item = currentItems[index];
    if (nuevaCantidad > item.producto.stock) {
      this.toastService.warning(
        `No puedes agregar más de ${item.producto.stock} unidades.`,
        'Stock Máximo'
      );
      return false;
    }

    currentItems[index] = {
      ...item,
      cantidad: nuevaCantidad,
      subtotal: nuevaCantidad * item.producto.precio
    };

    this.items.set(currentItems);
    this.saveCartToStorage(currentItems);
    return true;
  }

  removeItem(productoId: number): void {
    const filtered = this.items().filter(i => i.producto.id !== productoId);
    this.items.set(filtered);
    this.saveCartToStorage(filtered);
    this.toastService.info('Producto eliminado del carrito');
  }

  clearCart(): void {
    this.items.set([]);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }

  /**
   * Construye el DTO exacto PedidoCreateDTO esperado por el backend en POST /api/pedidos
   */
  buildCheckoutPayload(clienteNombre: string, clienteEmail: string): PedidoCreateDTO {
    return {
      clienteNombre: clienteNombre.trim(),
      clienteEmail: clienteEmail.trim(),
      items: this.items().map(item => ({
        productoId: item.producto.id,
        cantidad: item.cantidad
      }))
    };
  }
}
