import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Producto } from '../models/producto.model';

// Catalogo de respaldo sincronizado 1:1 con data.sql del backend
const SEED_PRODUCTOS: Producto[] = [
  {
    id: 1,
    nombre: 'Pizza Margherita',
    descripcion: 'Salsa de tomate casera, mozzarella fior di latte y albahaca fresca',
    precio: 8990.0,
    categoria: 'Pizzas',
    stock: 25,
    imagenUrl: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    nombre: 'Pizza Pepperoni Supreme',
    descripcion: 'Mozzarella, salsa de tomate y abundante pepperoni americano',
    precio: 9990.0,
    categoria: 'Pizzas',
    stock: 20,
    imagenUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    nombre: 'Hamburguesa Doble Smash',
    descripcion: 'Doble carne angus, doble cheddar, cebolla crispy y salsa especial',
    precio: 7490.0,
    categoria: 'Hamburguesas',
    stock: 15,
    imagenUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 4,
    nombre: 'Hamburguesa Veggie Burger',
    descripcion: 'Medallón de garbanzos y lentejas, palta fresca, tomate y lechuga',
    precio: 6990.0,
    categoria: 'Hamburguesas',
    stock: 10,
    imagenUrl: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 5,
    nombre: 'Bebida Coca-Cola Zero 350ml',
    descripcion: 'Lata helada 350ml sin azúcar',
    precio: 1500.0,
    categoria: 'Bebidas',
    stock: 50,
    imagenUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 6,
    nombre: 'Jugo Natural Frutilla 500ml',
    descripcion: 'Jugo natural de frutilla endulzado con estevia',
    precio: 2200.0,
    categoria: 'Bebidas',
    stock: 30,
    imagenUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&auto=format&fit=crop&q=80'
  }
];

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);
  // Endpoint real del backend en PublicController.java
  private readonly apiUrl = `${environment.apiUrl}/public/productos`;

  /**
   * Obtiene todos los productos del menu.
   * Si el backend esta desconectado, recurre al catalogo seed.
   */
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl).pipe(
      map(productos => this.enrichWithImages(productos)),
      catchError(err => {
        console.warn('Backend desconectado o no accesible, usando catalogo seed local:', err);
        return of(SEED_PRODUCTOS);
      })
    );
  }

  /**
   * Obtiene un producto por su ID
   */
  getProductoById(id: number): Observable<Producto | null> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`).pipe(
      map(p => this.enrichSingleWithImage(p)),
      catchError(() => {
        const found = SEED_PRODUCTOS.find(p => p.id === id) || null;
        return of(found);
      })
    );
  }

  /**
   * Asigna imagenes atractivas si el backend solo retorna datos planos
   */
  private enrichWithImages(productos: Producto[]): Producto[] {
    return productos.map(p => this.enrichSingleWithImage(p));
  }

  private enrichSingleWithImage(p: Producto): Producto {
    if (p.imagenUrl) return p;
    const seed = SEED_PRODUCTOS.find(s => s.id === p.id || s.nombre.toLowerCase() === p.nombre.toLowerCase());
    return {
      ...p,
      imagenUrl: seed?.imagenUrl || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80'
    };
  }
}
