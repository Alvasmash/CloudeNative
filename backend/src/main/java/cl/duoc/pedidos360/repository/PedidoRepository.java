package cl.duoc.pedidos360.repository;

import cl.duoc.pedidos360.model.Pedido;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * =========================================================================
 * REPOSITORIO JPA: PedidoRepository
 * =========================================================================
 * FUNCION: Provee operaciones de base de datos para la tabla 'pedidos' y consultas personalizadas.
 * CONECTA CON: Spring Data JPA y la tabla de �rdenes de compra.
 */
@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    // Busca un pedido por su n�mero de orden �nico (ej: "PED-A1B2C3D4")
    Optional<Pedido> findByNumeroPedido(String numeroPedido);

    // Consulta el historial de pedidos de un cliente ordenados de m�s reciente a m�s antiguo
    List<Pedido> findByClienteEmailOrderByFechaCreacionDesc(String clienteEmail);
}
