import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { Producto } from '../models/producto.model';

describe('CartService', () => {
  let service: CartService;

  const mockProductA: Producto = {
    id: 1,
    nombre: 'Pizza Margherita',
    descripcion: 'Deliciosa pizza tradicional',
    precio: 8990,
    categoria: 'Pizzas',
    stock: 5
  };

  const mockProductB: Producto = {
    id: 2,
    nombre: 'Bebida Coca-Cola Zero',
    descripcion: 'Lata 350ml',
    precio: 1500,
    categoria: 'Bebidas',
    stock: 20
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
    service.clearCart();
  });

  it('debe inicializarse con el carrito vacío', () => {
    expect(service.items().length).toBe(0);
    expect(service.totalCount()).toBe(0);
    expect(service.totalPrice()).toBe(0);
    expect(service.isEmpty()).toBeTrue();
  });

  it('debe agregar un producto correctamente al carrito', () => {
    const added = service.addItem(mockProductA, 1);
    expect(added).toBeTrue();
    expect(service.items().length).toBe(1);
    expect(service.totalCount()).toBe(1);
    expect(service.totalPrice()).toBe(8990);
    expect(service.isEmpty()).toBeFalse();
  });

  it('debe acumular la cantidad si se agrega el mismo producto', () => {
    service.addItem(mockProductA, 2);
    service.addItem(mockProductA, 1);
    expect(service.items().length).toBe(1);
    expect(service.totalCount()).toBe(3);
    expect(service.totalPrice()).toBe(8990 * 3);
  });

  it('no debe permitir agregar más unidades que el stock disponible', () => {
    // mockProductA tiene stock de 5
    const added = service.addItem(mockProductA, 6);
    expect(added).toBeFalse();
    expect(service.items().length).toBe(0);
  });

  it('debe calcular subtotales y total general con múltiples productos', () => {
    service.addItem(mockProductA, 2); // 2 * 8990 = 17980
    service.addItem(mockProductB, 3); // 3 * 1500 = 4500
    expect(service.totalCount()).toBe(5);
    expect(service.totalPrice()).toBe(17980 + 4500);
  });

  it('debe modificar la cantidad de un ítem existente', () => {
    service.addItem(mockProductA, 1);
    const updated = service.updateQuantity(mockProductA.id, 4);
    expect(updated).toBeTrue();
    expect(service.items()[0].cantidad).toBe(4);
    expect(service.totalPrice()).toBe(8990 * 4);
  });

  it('debe eliminar el producto si la cantidad actualizada es 0', () => {
    service.addItem(mockProductA, 2);
    service.updateQuantity(mockProductA.id, 0);
    expect(service.items().length).toBe(0);
    expect(service.isEmpty()).toBeTrue();
  });

  it('debe quitar un producto del carrito por su ID', () => {
    service.addItem(mockProductA, 1);
    service.addItem(mockProductB, 2);
    service.removeItem(mockProductA.id);
    expect(service.items().length).toBe(1);
    expect(service.items()[0].producto.id).toBe(mockProductB.id);
  });

  it('debe vaciar el carrito completamente con clearCart', () => {
    service.addItem(mockProductA, 2);
    service.addItem(mockProductB, 1);
    service.clearCart();
    expect(service.items().length).toBe(0);
    expect(service.totalPrice()).toBe(0);
    expect(service.isEmpty()).toBeTrue();
  });

  it('debe construir el payload exacto PedidoCreateDTO para el backend', () => {
    service.addItem(mockProductA, 2);
    service.addItem(mockProductB, 1);

    const payload = service.buildCheckoutPayload('Nicolás García', 'nicolas@duocuc.cl');

    expect(payload.clienteNombre).toBe('Nicolás García');
    expect(payload.clienteEmail).toBe('nicolas@duocuc.cl');
    expect(payload.items.length).toBe(2);
    expect(payload.items[0]).toEqual({ productoId: 1, cantidad: 2 });
    expect(payload.items[1]).toEqual({ productoId: 2, cantidad: 1 });
  });
});
