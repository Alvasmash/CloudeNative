import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Producto } from '../../core/models/producto.model';
import { ClpCurrencyPipe } from '../../shared/pipes/clp-currency.pipe';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, ClpCurrencyPipe],
  template: `
    <div class="menu-page">
      <!-- Hero Banner -->
      <section class="menu-hero">
        <div class="hero-content">
          <span class="hero-badge">🍽️ Menú Fresco &bull; Preparado al Momento</span>
          <h1 class="hero-title">Deliciosa Comida a un Clic</h1>
          <p class="hero-subtitle">
            Selecciona tus pizzas artesanales, hamburguesas gourmet o bebidas y ordénalas directamente a tu mesa o domicilio.
          </p>
        </div>
      </section>

      <!-- Filter, Search & Sort Bar -->
      <section class="controls-bar">
        <!-- Categories Tabs -->
        <div class="category-tabs">
          @for (cat of categories(); track cat) {
            <button
              type="button"
              class="tab-btn"
              [class.active]="selectedCategory() === cat"
              (click)="selectCategory(cat)"
            >
              {{ cat }}
            </button>
          }
        </div>

        <!-- Search and Sort -->
        <div class="search-sort-group">
          <!-- Search input -->
          <div class="search-box">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" class="search-icon">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Buscar por plato o ingrediente..."
              [ngModel]="searchQuery()"
              (ngModelChange)="searchQuery.set($event)"
              class="search-input"
            />
            @if (searchQuery()) {
              <button class="clear-search" (click)="searchQuery.set('')">&times;</button>
            }
          </div>

          <!-- Sort Select -->
          <select
            [ngModel]="sortBy()"
            (ngModelChange)="sortBy.set($event)"
            class="sort-select"
          >
            <option value="featured">Destacados</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="name">Nombre: A &rarr; Z</option>
          </select>
        </div>
      </section>

      <!-- Products Grid -->
      <section class="products-section">
        @if (isLoading()) {
          <!-- Skeleton Loading -->
          <div class="products-grid">
            @for (i of [1,2,3,4,5,6]; track i) {
              <div class="skeleton-card">
                <div class="skeleton-img"></div>
                <div class="skeleton-body">
                  <div class="skeleton-line title"></div>
                  <div class="skeleton-line desc"></div>
                  <div class="skeleton-line desc short"></div>
                  <div class="skeleton-line footer"></div>
                </div>
              </div>
            }
          </div>
        } @else if (filteredProducts().length === 0) {
          <!-- Empty State -->
          <div class="empty-state">
            <div class="empty-icon">🔍</div>
            <h3>No se encontraron productos</h3>
            <p>Prueba con otros términos de búsqueda o selecciona otra categoría.</p>
            <button class="btn btn-outline" (click)="resetFilters()">Restablecer Filtros</button>
          </div>
        } @else {
          <div class="products-grid">
            @for (product of filteredProducts(); track product.id) {
              <article class="product-card">
                <!-- Image Wrapper with Badges -->
                <div class="card-img-wrapper">
                  <img
                    [src]="product.imagenUrl"
                    [alt]="product.nombre"
                    loading="lazy"
                    class="card-img"
                  />
                  <span class="category-pill">{{ product.categoria }}</span>
                  @if (product.stock <= 0) {
                    <span class="stock-pill out-of-stock">Agotado</span>
                  } @else if (product.stock <= 10) {
                    <span class="stock-pill low-stock">¡Solo {{ product.stock }} disponibles!</span>
                  }
                </div>

                <!-- Product Details -->
                <div class="card-body">
                  <h3 class="product-title">{{ product.nombre }}</h3>
                  <p class="product-desc">{{ product.descripcion }}</p>

                  <div class="card-footer">
                    <div class="price-container">
                      <span class="price-label">Precio</span>
                      <span class="price-value">{{ product.precio | clp }}</span>
                    </div>

                    <button
                      type="button"
                      class="btn-add-cart"
                      [disabled]="product.stock <= 0"
                      (click)="addToCart(product)"
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 5v14M5 12h14"/>
                      </svg>
                      Agregar
                    </button>
                  </div>
                </div>
              </article>
            }
          </div>
        }
      </section>
    </div>
  `,
  styles: [`
    .menu-page {
      max-width: 1280px;
      margin: 0 auto;
      padding: 32px 24px 64px;
    }
    .menu-hero {
      background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
      border-radius: 20px;
      padding: 48px 36px;
      color: #FFFFFF;
      margin-bottom: 36px;
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
    }
    .hero-content {
      max-width: 620px;
      position: relative;
      z-index: 2;
    }
    .hero-badge {
      display: inline-block;
      background: rgba(249, 115, 22, 0.2);
      color: #FB923C;
      border: 1px solid rgba(249, 115, 22, 0.3);
      font-size: 0.8125rem;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 9999px;
      margin-bottom: 12px;
    }
    .hero-title {
      font-size: 2.35rem;
      font-weight: 800;
      letter-spacing: -0.025em;
      margin: 0 0 12px 0;
      line-height: 1.15;
    }
    .hero-subtitle {
      font-size: 1.05rem;
      color: #94A3B8;
      line-height: 1.5;
      margin: 0;
    }
    .controls-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 32px;
    }
    .category-tabs {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 4px;
    }
    .tab-btn {
      padding: 8px 18px;
      border-radius: 9999px;
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      color: #475569;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.18s ease;
    }
    .tab-btn:hover {
      border-color: #CBD5E1;
      background: #F8FAFC;
    }
    .tab-btn.active {
      background: #F97316;
      border-color: #F97316;
      color: #FFFFFF;
      box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
    }
    .search-sort-group {
      display: flex;
      gap: 12px;
      align-items: center;
      flex: 1;
      max-width: 520px;
      justify-content: flex-end;
    }
    .search-box {
      position: relative;
      flex: 1;
    }
    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #94A3B8;
      pointer-events: none;
    }
    .search-input {
      width: 100%;
      padding: 9px 36px 9px 36px;
      border-radius: 10px;
      border: 1px solid #E2E8F0;
      font-size: 0.875rem;
      background: #FFFFFF;
      transition: all 0.2s;
    }
    .search-input:focus {
      outline: none;
      border-color: #F97316;
      box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.15);
    }
    .clear-search {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      font-size: 1.1rem;
      color: #94A3B8;
      cursor: pointer;
    }
    .sort-select {
      padding: 9px 14px;
      border-radius: 10px;
      border: 1px solid #E2E8F0;
      font-size: 0.875rem;
      background: #FFFFFF;
      color: #334155;
      cursor: pointer;
      font-weight: 500;
    }
    .sort-select:focus {
      outline: none;
      border-color: #F97316;
    }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 28px;
    }
    .product-card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 16px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 16px 24px -6px rgba(15, 23, 42, 0.12);
      border-color: #CBD5E1;
    }
    .card-img-wrapper {
      position: relative;
      height: 210px;
      overflow: hidden;
      background: #F1F5F9;
    }
    .card-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }
    .product-card:hover .card-img {
      transform: scale(1.05);
    }
    .category-pill {
      position: absolute;
      top: 12px;
      left: 12px;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(4px);
      color: #FFFFFF;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 9999px;
    }
    .stock-pill {
      position: absolute;
      top: 12px;
      right: 12px;
      font-size: 0.725rem;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 9999px;
    }
    .low-stock {
      background: #FEF3C7;
      color: #D97706;
      border: 1px solid #FDE68A;
    }
    .out-of-stock {
      background: #FEE2E2;
      color: #DC2626;
      border: 1px solid #FCA5A5;
    }
    .card-body {
      padding: 20px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .product-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: #0F172A;
      margin: 0 0 6px 0;
    }
    .product-desc {
      font-size: 0.875rem;
      color: #64748B;
      line-height: 1.45;
      margin: 0 0 20px 0;
      flex: 1;
    }
    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid #F1F5F9;
      padding-top: 14px;
    }
    .price-container {
      display: flex;
      flex-direction: column;
    }
    .price-label {
      font-size: 0.7rem;
      font-weight: 600;
      color: #94A3B8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .price-value {
      font-size: 1.3rem;
      font-weight: 800;
      color: #0F172A;
    }
    .btn-add-cart {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 9px 16px;
      border-radius: 10px;
      background: #F97316;
      color: #FFFFFF;
      font-weight: 600;
      font-size: 0.875rem;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-add-cart:hover:not(:disabled) {
      background: #EA580C;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(249, 115, 22, 0.35);
    }
    .btn-add-cart:disabled {
      background: #E2E8F0;
      color: #94A3B8;
      cursor: not-allowed;
    }
    .empty-state {
      text-align: center;
      padding: 64px 20px;
      background: #FFFFFF;
      border-radius: 16px;
      border: 1px solid #E2E8F0;
    }
    .empty-icon {
      font-size: 3rem;
      margin-bottom: 12px;
    }
    .empty-state h3 {
      font-size: 1.25rem;
      color: #0F172A;
      margin: 0 0 6px 0;
    }
    .empty-state p {
      color: #64748B;
      margin: 0 0 20px 0;
    }
    .btn-outline {
      padding: 8px 18px;
      border-radius: 8px;
      border: 1px solid #CBD5E1;
      background: #FFFFFF;
      color: #334155;
      font-weight: 600;
      cursor: pointer;
    }
    .skeleton-card {
      background: #FFFFFF;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #E2E8F0;
      height: 380px;
    }
    .skeleton-img {
      height: 210px;
      background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
    .skeleton-body {
      padding: 20px;
    }
    .skeleton-line {
      height: 14px;
      background: #E2E8F0;
      border-radius: 4px;
      margin-bottom: 10px;
    }
    .skeleton-line.title { width: 70%; height: 20px; }
    .skeleton-line.desc { width: 90%; }
    .skeleton-line.desc.short { width: 50%; }
    .skeleton-line.footer { width: 100%; height: 36px; margin-top: 24px; }
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `]
})
export class MenuComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);

  readonly products = signal<Producto[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly selectedCategory = signal<string>('Todos');
  readonly searchQuery = signal<string>('');
  readonly sortBy = signal<string>('featured');

  readonly categories = computed(() => {
    const list = this.products().map(p => p.categoria);
    const unique = Array.from(new Set(list));
    return ['Todos', ...unique];
  });

  readonly filteredProducts = computed(() => {
    let list = this.products();

    // Filtro por categoría
    if (this.selectedCategory() !== 'Todos') {
      list = list.filter(p => p.categoria.toLowerCase() === this.selectedCategory().toLowerCase());
    }

    // Filtro por búsqueda
    const q = this.searchQuery().trim().toLowerCase();
    if (q) {
      list = list.filter(p =>
        p.nombre.toLowerCase().includes(q) ||
        p.descripcion.toLowerCase().includes(q)
      );
    }

    // Ordenamiento
    const sort = this.sortBy();
    const sorted = [...list];
    if (sort === 'price-asc') {
      sorted.sort((a, b) => a.precio - b.precio);
    } else if (sort === 'price-desc') {
      sorted.sort((a, b) => b.precio - a.precio);
    } else if (sort === 'name') {
      sorted.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }

    return sorted;
  });

  ngOnInit(): void {
    this.productService.getProductos().subscribe({
      next: (items) => {
        this.products.set(items);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  resetFilters(): void {
    this.selectedCategory.set('Todos');
    this.searchQuery.set('');
    this.sortBy.set('featured');
  }

  addToCart(product: Producto): void {
    this.cartService.addItem(product, 1);
  }
}
