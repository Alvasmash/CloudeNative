import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/auth/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { ClpCurrencyPipe } from '../../shared/pipes/clp-currency.pipe';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ClpCurrencyPipe,
    ConfirmModalComponent,
  ],
  template: `
    <div class="cart-page">
      <div class="cart-header">
        <h1 class="page-title">Tu Carrito de Compras</h1>
        <p class="page-subtitle">
          Revisa tus productos y confirma tu orden con un solo clic.
        </p>
      </div>

      @if (cartService.isEmpty()) {
        <!-- Empty Cart View -->
        <div class="empty-cart-card">
          <div class="empty-icon-wrapper">
            <svg
              viewBox="0 0 24 24"
              width="48"
              height="48"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path
                d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
              />
            </svg>
          </div>
          <h2>Tu carrito está vacío</h2>
          <p>Aún no has agregado ninguna pizza, hamburguesa o bebida.</p>
          <a routerLink="/menu" class="btn btn-primary">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Explorar Menú
          </a>
        </div>
      } @else {
        <!-- Cart Items & Checkout Layout -->
        <div class="cart-layout">
          <!-- Items List Column -->
          <div class="cart-items-column">
            <div class="items-card">
              <div class="items-header">
                <span class="items-count"
                  >{{ cartService.totalCount() }} productos en el carrito</span
                >
                <button
                  type="button"
                  class="btn-clear-cart"
                  (click)="openClearModal()"
                >
                  Vaciar carrito
                </button>
              </div>

              <div class="items-list">
                @for (item of cartService.items(); track item.producto.id) {
                  <div class="cart-item-row">
                    <img
                      [src]="item.producto.imagenUrl"
                      [alt]="item.producto.nombre"
                      class="item-thumb"
                    />

                    <div class="item-details">
                      <h4 class="item-name">{{ item.producto.nombre }}</h4>
                      <span class="item-category">{{
                        item.producto.categoria
                      }}</span>
                      <span class="item-unit-price"
                        >{{ item.producto.precio | clp }} c/u</span
                      >
                    </div>

                    <!-- Quantity Controls -->
                    <div class="qty-control">
                      <button
                        type="button"
                        class="qty-btn"
                        (click)="decrementQuantity(item)"
                        title="Disminuir"
                      >
                        -
                      </button>
                      <span class="qty-value">{{ item.cantidad }}</span>
                      <button
                        type="button"
                        class="qty-btn"
                        [disabled]="item.cantidad >= item.producto.stock"
                        (click)="incrementQuantity(item)"
                        title="Aumentar"
                      >
                        +
                      </button>
                    </div>

                    <!-- Subtotal & Remove -->
                    <div class="item-subtotal-group">
                      <span class="item-subtotal">{{
                        item.subtotal | clp
                      }}</span>
                      <button
                        type="button"
                        class="btn-remove"
                        (click)="removeItem(item.producto.id)"
                        title="Eliminar producto"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          width="18"
                          height="18"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path
                            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                }
              </div>

              <div class="continue-shopping">
                <a routerLink="/menu" class="link-continue">
                  &larr; Continuar comprando
                </a>
              </div>
            </div>
          </div>

          <!-- Checkout Summary Column -->
          <div class="cart-summary-column">
            <div class="summary-card">
              <h3 class="summary-title">Resumen del Pedido</h3>

              <div class="summary-rows">
                <div class="summary-row">
                  <span>Subtotal</span>
                  <span>{{ cartService.totalPrice() | clp }}</span>
                </div>
                <div class="summary-row">
                  <span>Envío a domicilio</span>
                  <span class="text-success">Gratis</span>
                </div>
                <div class="summary-divider"></div>
                <div class="summary-row total-row">
                  <span>Total</span>
                  <span class="total-amount">{{
                    cartService.totalPrice() | clp
                  }}</span>
                </div>
              </div>

              <!-- Customer Info Form -->
              <form
                (ngSubmit)="confirmOrder()"
                #orderForm="ngForm"
                class="checkout-form"
              >
                <h4 class="form-section-title">Datos para la Entrega</h4>

                <div class="form-group">
                  <label for="clienteNombre">Nombre y Apellido *</label>
                  <input
                    type="text"
                    id="clienteNombre"
                    name="clienteNombre"
                    [(ngModel)]="clienteNombre"
                    required
                    placeholder="Ej: Nicolás García"
                    class="form-input"
                  />
                </div>

                <div class="form-group">
                  <label for="clienteEmail">Correo Electrónico *</label>
                  <input
                    type="email"
                    id="clienteEmail"
                    name="clienteEmail"
                    [(ngModel)]="clienteEmail"
                    required
                    email
                    placeholder="ejemplo@duocuc.cl"
                    class="form-input"
                  />
                  <small class="hint"
                    >Recibirás la confirmación y el número de
                    seguimiento.</small
                  >
                </div>

                <button
                  type="submit"
                  class="btn btn-checkout"
                  [disabled]="
                    isSubmitting() || !orderForm.valid || cartService.isEmpty()
                  "
                >
                  @if (isSubmitting()) {
                    <span class="spinner"></span>
                    <span>Procesando Pedido...</span>
                  } @else {
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.2"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span
                      >Confirmar Pedido ({{
                        cartService.totalPrice() | clp
                      }})</span
                    >
                  }
                </button>
              </form>
            </div>
          </div>
        </div>
      }

      <!-- Modal Confirmación Vaciar Carrito -->
      <app-confirm-modal
        [isOpen]="isClearModalOpen()"
        title="¿Vaciar Carrito?"
        message="¿Seguro que deseas eliminar todos los productos del carrito de compras?"
        confirmText="Sí, vaciar"
        variant="danger"
        (confirm)="confirmClearCart()"
        (cancel)="isClearModalOpen.set(false)"
      />
    </div>
  `,
  styles: [
    `
      .cart-page {
        max-width: 1280px;
        margin: 0 auto;
        padding: 32px 24px 64px;
      }
      .cart-header {
        margin-bottom: 32px;
      }
      .page-title {
        font-size: 2rem;
        font-weight: 800;
        color: #0f172a;
        margin: 0 0 6px 0;
        letter-spacing: -0.02em;
      }
      .page-subtitle {
        font-size: 0.95rem;
        color: #64748b;
        margin: 0;
      }
      .empty-cart-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 20px;
        padding: 64px 24px;
        text-align: center;
        max-width: 520px;
        margin: 40px auto;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
      }
      .empty-icon-wrapper {
        width: 84px;
        height: 84px;
        border-radius: 50%;
        background: #fff7ed;
        color: #f97316;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
      }
      .empty-cart-card h2 {
        font-size: 1.5rem;
        color: #0f172a;
        margin: 0 0 8px 0;
      }
      .empty-cart-card p {
        color: #64748b;
        margin: 0 0 24px 0;
      }
      .cart-layout {
        display: grid;
        grid-template-columns: 1fr 420px;
        gap: 32px;
        align-items: flex-start;
      }
      .items-card,
      .summary-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      }
      .items-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 16px;
        border-bottom: 1px solid #f1f5f9;
      }
      .items-count {
        font-weight: 700;
        color: #1e293b;
        font-size: 0.95rem;
      }
      .btn-clear-cart {
        background: none;
        border: none;
        color: #ef4444;
        font-size: 0.8125rem;
        font-weight: 600;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 6px;
        transition: background 0.15s;
      }
      .btn-clear-cart:hover {
        background: #fef2f2;
      }
      .items-list {
        display: flex;
        flex-direction: column;
      }
      .cart-item-row {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 20px 0;
        border-bottom: 1px solid #f1f5f9;
      }
      .item-thumb {
        width: 72px;
        height: 72px;
        border-radius: 12px;
        object-fit: cover;
        flex-shrink: 0;
        background: #f1f5f9;
      }
      .item-details {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .item-name {
        font-size: 1rem;
        font-weight: 700;
        color: #0f172a;
        margin: 0;
      }
      .item-category {
        font-size: 0.75rem;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .item-unit-price {
        font-size: 0.85rem;
        color: #94a3b8;
      }
      .qty-control {
        display: flex;
        align-items: center;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 2px;
        background: #f8fafc;
      }
      .qty-btn {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        background: #ffffff;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 700;
        color: #1e293b;
        transition: all 0.15s;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      }
      .qty-btn:hover:not(:disabled) {
        background: #f1f5f9;
        color: #f97316;
      }
      .qty-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
      .qty-value {
        width: 34px;
        text-align: center;
        font-weight: 700;
        font-size: 0.9rem;
        color: #0f172a;
      }
      .item-subtotal-group {
        display: flex;
        align-items: center;
        gap: 16px;
        min-width: 120px;
        justify-content: flex-end;
      }
      .item-subtotal {
        font-size: 1.1rem;
        font-weight: 800;
        color: #0f172a;
      }
      .btn-remove {
        background: none;
        border: none;
        color: #94a3b8;
        cursor: pointer;
        padding: 6px;
        border-radius: 8px;
        transition: all 0.15s;
      }
      .btn-remove:hover {
        color: #ef4444;
        background: #fef2f2;
      }
      .continue-shopping {
        padding-top: 20px;
      }
      .link-continue {
        color: #f97316;
        text-decoration: none;
        font-weight: 600;
        font-size: 0.9rem;
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .link-continue:hover {
        text-decoration: underline;
      }
      .summary-title {
        font-size: 1.25rem;
        font-weight: 800;
        color: #0f172a;
        margin: 0 0 20px 0;
      }
      .summary-rows {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 24px;
      }
      .summary-row {
        display: flex;
        justify-content: space-between;
        color: #64748b;
        font-size: 0.925rem;
      }
      .text-success {
        color: #10b981;
        font-weight: 700;
      }
      .summary-divider {
        height: 1px;
        background: #e2e8f0;
        margin: 6px 0;
      }
      .total-row {
        color: #0f172a;
        font-size: 1.1rem;
        font-weight: 700;
        align-items: baseline;
      }
      .total-amount {
        font-size: 1.6rem;
        font-weight: 900;
        color: #f97316;
      }
      .checkout-form {
        border-top: 1px solid #f1f5f9;
        padding-top: 20px;
      }
      .form-section-title {
        font-size: 0.95rem;
        font-weight: 700;
        color: #1e293b;
        margin: 0 0 16px 0;
      }
      .form-group {
        margin-bottom: 16px;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .form-group label {
        font-size: 0.8125rem;
        font-weight: 600;
        color: #334155;
      }
      .form-input {
        padding: 10px 14px;
        border: 1px solid #cbd5e1;
        border-radius: 10px;
        font-size: 0.875rem;
        transition: all 0.2s;
      }
      .form-input:focus {
        outline: none;
        border-color: #f97316;
        box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.15);
      }
      .hint {
        font-size: 0.725rem;
        color: #94a3b8;
      }
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 12px 24px;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
        transition: all 0.2s;
        border: none;
      }
      .btn-primary {
        background: #f97316;
        color: #ffffff;
      }
      .btn-primary:hover {
        background: #ea580c;
      }
      .btn-checkout {
        width: 100%;
        background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
        color: #ffffff;
        font-size: 1rem;
        font-weight: 700;
        padding: 14px;
        border-radius: 12px;
        box-shadow: 0 10px 20px -5px rgba(249, 115, 22, 0.4);
        margin-top: 12px;
      }
      .btn-checkout:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 14px 24px -5px rgba(249, 115, 22, 0.5);
      }
      .btn-checkout:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        box-shadow: none;
        transform: none;
      }
      .spinner {
        width: 18px;
        height: 18px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: #ffffff;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      @media (max-width: 900px) {
        .cart-layout {
          grid-template-columns: 1fr;
        }
      }
      @media (max-width: 600px) {
        .cart-item-row {
          flex-wrap: wrap;
        }
        .item-subtotal-group {
          width: 100%;
          justify-content: space-between;
        }
      }
    `,
  ],
})
export class CartComponent {
  readonly cartService = inject(CartService);
  private readonly orderService = inject(OrderService);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  clienteNombre: string = '';
  clienteEmail: string = '';
  readonly isSubmitting = signal<boolean>(false);
  readonly isClearModalOpen = signal<boolean>(false);

  constructor() {
    // Si hay un usuario logueado, pre-llenar los campos de entrega
    const user = this.authService.currentUser();
    if (user) {
      this.clienteNombre = user.name || '';
      this.clienteEmail = user.email || '';
    }
  }

  incrementQuantity(item: CartItem): void {
    this.cartService.updateQuantity(item.producto.id, item.cantidad + 1);
  }

  decrementQuantity(item: CartItem): void {
    this.cartService.updateQuantity(item.producto.id, item.cantidad - 1);
  }

  removeItem(productId: number): void {
    this.cartService.removeItem(productId);
  }

  openClearModal(): void {
    this.isClearModalOpen.set(true);
  }

  confirmClearCart(): void {
    this.cartService.clearCart();
    this.isClearModalOpen.set(false);
  }

  confirmOrder(): void {
    if (!this.clienteNombre.trim() || !this.clienteEmail.trim()) {
      this.toastService.warning(
        'Por favor ingresa nombre y correo electrónico',
        'Campos Requeridos',
      );
      return;
    }

    if (this.cartService.isEmpty()) {
      this.toastService.warning(
        'No puedes crear un pedido con el carrito vacío',
        'Carrito Vacío',
      );
      return;
    }

    this.isSubmitting.set(true);

    const payload = this.cartService.buildCheckoutPayload(
      this.clienteNombre,
      this.clienteEmail,
    );

    this.orderService.crearPedido(payload).subscribe({
      next: (nuevoPedido) => {
        this.isSubmitting.set(false);
        this.cartService.clearCart();
        this.router.navigate(['/pedidos', nuevoPedido.id]);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        console.error('Error al crear pedido:', err);
      },
    });
  }
}
