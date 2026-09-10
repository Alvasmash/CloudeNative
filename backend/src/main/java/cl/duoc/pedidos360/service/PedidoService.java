package cl.duoc.pedidos360.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cl.duoc.pedidos360.dto.ItemPedidoDTO;
import cl.duoc.pedidos360.dto.PedidoCreateDTO;
import cl.duoc.pedidos360.model.EstadoPedido;
import cl.duoc.pedidos360.model.ItemPedido;
import cl.duoc.pedidos360.model.Pedido;
import cl.duoc.pedidos360.model.Producto;
import cl.duoc.pedidos360.repository.PedidoRepository;
import cl.duoc.pedidos360.repository.ProductoRepository;

/**
 * =========================================================================
 * SERVICIO: PedidoService
 * =========================================================================
 * FUNCION: Controla el flujo transaccional de rdenes de compra en Pedidos360:
 *          - Validacion de existencia de productos en el catalogo.
 *          - Verificacin y descuento automatico de stock en cocina.
 *          - Clculo matemtico de subtotales por item y total del pedido.
 *          - Asignacin de codigo unico y estado inicial PENDIENTE.
 * CONECTA CON: PedidoRepository, ProductoRepository, PedidoController y AdminController.
 */
@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ProductoRepository productoRepository;

    public PedidoService(PedidoRepository pedidoRepository, ProductoRepository productoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.productoRepository = productoRepository;
    }

    // Listar todos los pedidos (usado por administracion)
    @Transactional(readOnly = true)
    public List<Pedido> listarTodos() {
        return pedidoRepository.findAll();
    }

    // Buscar una orden por su ID
    @Transactional(readOnly = true)
    public Optional<Pedido> buscarPorId(Long id) {
        return pedidoRepository.findById(id);
    }

    // Historial de compras filtrado por correo del cliente
    @Transactional(readOnly = true)
    public List<Pedido> listarPorCliente(String clienteEmail) {
        return pedidoRepository.findByClienteEmailOrderByFechaCreacionDesc(clienteEmail);
    }

    /**
     * Crea un pedido de forma atmica: Si algun producto no tiene stock,
     * la transaccion se cancela (rollback) y no se modifica la base de datos.
     */
    @Transactional
    public Pedido crearPedido(PedidoCreateDTO dto, String usuarioAutenticado) {
        Pedido pedido = new Pedido();
        // Genera un codigo de orden unico y legible (ej: PED-C83E92B1)
        pedido.setNumeroPedido("PED-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        pedido.setClienteNombre(dto.getClienteNombre());
        pedido.setClienteEmail(dto.getClienteEmail() != null && !dto.getClienteEmail().isBlank()
                ? dto.getClienteEmail()
                : usuarioAutenticado);
        pedido.setFechaCreacion(LocalDateTime.now());
        pedido.setEstado(EstadoPedido.PENDIENTE);

        double total = 0.0;

        // Itera cada producto solicitado para validar stock y calcular montos
        for (ItemPedidoDTO itemDto : dto.getItems()) {
            Producto producto = productoRepository.findById(itemDto.getProductoId())
                    .orElseThrow(() -> new IllegalArgumentException("Producto con ID " + itemDto.getProductoId() + " no encontrado en el menu"));

            if (producto.getStock() < itemDto.getCantidad()) {
                throw new IllegalStateException("Stock insuficiente para: " + producto.getNombre() + ". Disponibles: " + producto.getStock());
            }

            // Descontar las unidades compradas del stock
            producto.setStock(producto.getStock() - itemDto.getCantidad());
            productoRepository.save(producto);

            // Calcular subtotal de esta linea
            double subtotal = producto.getPrecio() * itemDto.getCantidad();
            ItemPedido item = new ItemPedido(null, pedido, producto.getId(), producto.getNombre(), itemDto.getCantidad(), producto.getPrecio(), subtotal);
            pedido.agregarItem(item);
            total += subtotal;
        }

        pedido.setTotal(total);
        // Guarda el pedido y automaticamente sus items por cascada JPA
        return pedidoRepository.save(pedido);
    }

    // Actualiza el estado del pedido (ej: PENDIENTE -> EN_PREPARACION -> EN_CAMINO -> ENTREGADO)
    @Transactional
    public Pedido actualizarEstado(Long id, EstadoPedido nuevoEstado) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pedido no encontrado con ID: " + id));
        pedido.setEstado(nuevoEstado);
        return pedidoRepository.save(pedido);
    }

    // Elimina una orden (operacion reservada para el rol de administracion)
    @Transactional
    public void eliminarPedido(Long id) {
        if (!pedidoRepository.existsById(id)) {
            throw new IllegalArgumentException("Pedido no encontrado con ID: " + id);
        }
        pedidoRepository.deleteById(id);
    }
}
