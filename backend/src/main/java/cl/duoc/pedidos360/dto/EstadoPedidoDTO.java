package cl.duoc.pedidos360.dto;

import cl.duoc.pedidos360.model.EstadoPedido;
import jakarta.validation.constraints.NotNull;

/**
 * =========================================================================
 * DTO: EstadoPedidoDTO (Actualizaci�n de Estado)
 * =========================================================================
 * FUNCION: Transporta el nuevo estado cuando un administrador actualiza la orden (ej: a EN_CAMINO).
 * CONECTA CON: El endpoint protegido PATCH /api/admin/pedidos/{id}/estado (exige ROLE_ADMIN).
 */
public class EstadoPedidoDTO {

    @NotNull(message = "El nuevo estado es obligatorio")
    private EstadoPedido estado;

    public EstadoPedidoDTO() {}

    public EstadoPedidoDTO(EstadoPedido estado) {
        this.estado = estado;
    }

    public EstadoPedido getEstado() { return estado; }
    public void setEstado(EstadoPedido estado) { this.estado = estado; }
}
