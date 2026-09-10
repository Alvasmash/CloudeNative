package cl.duoc.pedidos360.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import cl.duoc.pedidos360.model.Pedido;

/**
 * =========================================================================
 * REPOSITORIO JPA: PedidoRepository
 * =========================================================================
 * FUNCION: Provee operaciones de base de datos para la tabla 'pedidos' y consultas personalizadas.
 * CONECTA CON: Spring Data JPA y la tabla de rdenes de compra.
 */
@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    // Busca un pedido por su numero de orden unico (ej: "PED-A1B2C3D4")
    Optional<Pedido> findByNumeroPedido(String numeroPedido);

    // Consulta el historial de pedidos de un cliente ordenados de mas reciente a mas antiguo
    List<Pedido> findByClienteEmailOrderByFechaCreacionDesc(String clienteEmail);
}
