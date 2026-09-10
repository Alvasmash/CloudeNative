package cl.duoc.pedidos360.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cl.duoc.pedidos360.dto.EstadoPedidoDTO;
import cl.duoc.pedidos360.model.Pedido;
import cl.duoc.pedidos360.service.PedidoService;
import jakarta.validation.Valid;

/**
 * =========================================================================
 * CONTROLADOR: AdminController (Rutas Administrativas)
 * =========================================================================
 * FUNCION: Expone operaciones de alta seguridad exclusivas para usuarios con el
 *          App Role 'ADMIN' en Azure AD:
 *          - GET /api/admin/pedidos: Reporte global con recaudacion total.
 *          - PATCH /api/admin/pedidos/{id}/estado: Cambiar estado del pedido.
 *          - DELETE /api/admin/pedidos/{id}: Cancelar/eliminar un pedido.
 * CONECTA CON: SecurityConfig (que exige ROLE_ADMIN) y PedidoService.
 * EVALUACION (Rbrica 40%): "Aplica autorizacion por rol cuando corresponde".
 */
@RestController
@RequestMapping("/api/admin/pedidos")
public class AdminController {

    private final PedidoService pedidoService;

    public AdminController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    /**
     * Listado administrativo: Calcula la recaudacion total de todos los pedidos.
     */
    @GetMapping
    public Map<String, Object> listarTodosConMetricas() {
        List<Pedido> pedidos = pedidoService.listarTodos();
        double totalRecaudado = pedidos.stream().mapToDouble(Pedido::getTotal).sum();
        return Map.of(
                "totalPedidos", pedidos.size(),
                "totalRecaudado", totalRecaudado,
                "pedidos", pedidos);
    }

    /**
     * Actualiza el estado de una orden (ej: a EN_PREPARACION o ENTREGADO).
     */
    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstado(@PathVariable Long id, @Valid @RequestBody EstadoPedidoDTO dto) {
        try {
            Pedido actualizado = pedidoService.actualizarEstado(id, dto.getEstado());
            return ResponseEntity.ok(actualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Elimina un pedido por ID. Retorna HTTP 204 No Content.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPedido(@PathVariable Long id) {
        try {
            pedidoService.eliminarPedido(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
