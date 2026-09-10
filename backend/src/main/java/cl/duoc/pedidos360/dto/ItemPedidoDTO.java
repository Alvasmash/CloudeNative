package cl.duoc.pedidos360.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/**
 * =========================================================================
 * DTO: ItemPedidoDTO (Data Transfer Object)
 * =========================================================================
 * FUNCION: Transporta los datos de cada producto que el cliente quiere ordenar desde el frontend.
 * CONECTA CON: PedidoCreateDTO y el endpoint POST /api/pedidos.
 */
public class ItemPedidoDTO {

    // ID del producto a ordenar (debe existir en el catalogo de productos)
    @NotNull(message = "El ID del producto es obligatorio")
    private Long productoId;

    // Cantidad de unidades a pedir (al menos 1)
    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "La cantidad debe ser al menos 1")
    private Integer cantidad;

    public ItemPedidoDTO() {}

    public ItemPedidoDTO(Long productoId, Integer cantidad) {
        this.productoId = productoId;
        this.cantidad = cantidad;
    }

    public Long getProductoId() { return productoId; }
    public void setProductoId(Long productoId) { this.productoId = productoId; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
}
