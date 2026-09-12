import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { OrderService } from './order.service';
import { PedidoCreateDTO } from '../models/pedido-create.model';
import { EstadoPedido } from '../models/estado-pedido.model';
import { Pedido } from '../models/pedido.model';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrderService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe enviar la petición POST /api/pedidos con el DTO correcto', () => {
    const payload: PedidoCreateDTO = {
      clienteNombre: 'Carlos Alumno',
      clienteEmail: 'carlos@duocuc.cl',
      items: [{ productoId: 1, cantidad: 2 }],
    };

    const mockResponse: Pedido = {
      id: 10,
      numeroPedido: 'PED-99A1B2C3',
      clienteNombre: 'Carlos Alumno',
      clienteEmail: 'carlos@duocuc.cl',
      fechaCreacion: '2026-09-11T12:00:00',
      estado: EstadoPedido.PENDIENTE,
      total: 17980,
      items: [
        {
          id: 1,
          productoId: 1,
          productoNombre: 'Pizza Margherita',
          cantidad: 2,
          precioUnitario: 8990,
          subtotal: 17980,
        },
      ],
    };

    service.crearPedido(payload).subscribe((pedido) => {
      expect(pedido.id).toBe(10);
      expect(pedido.numeroPedido).toBe('PED-99A1B2C3');
      expect(pedido.estado).toBe(EstadoPedido.PENDIENTE);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/pedidos');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockResponse);
  });

  it('debe listar los pedidos mediante GET /api/pedidos', () => {
    service.getMisPedidos().subscribe((pedidos) => {
      expect(pedidos.length).toBeGreaterThanOrEqual(1);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/pedidos');
    expect(req.request.method).toBe('GET');
    req.flush([
      {
        id: 1,
        numeroPedido: 'ORD-2026-001',
        clienteNombre: 'Juan Perez',
        clienteEmail: 'juan@duocuc.cl',
        fechaCreacion: '2026-09-11T10:00:00',
        estado: EstadoPedido.ENTREGADO,
        total: 16480,
        items: [],
      },
    ]);
  });
});
