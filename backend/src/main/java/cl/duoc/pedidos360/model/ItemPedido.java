package cl.duoc.pedidos360.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * =========================================================================
 * ENTIDAD JPA: ItemPedido (Detalle de la Orden)
 * =========================================================================
 * FUNCION: Representa cada linea individual dentro de un pedido (ej: 2 Pizzas a $8.990 c/u = $17.980).
 * CONECTA CON: Tabla 'items_pedido' y establece la relacion N:1 con la orden 'Pedido'.
 */
@Entity
@Table(name = "items_pedido")
public class ItemPedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relacion ManyToOne: Muchos items pertenecen a un unico pedido.
    // @JsonBackReference: Evita bucles infinitos de serializacion JSON entre Pedido e Item.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", nullable = false)
    @JsonBackReference
    private Pedido pedido;

    @Column(name = "producto_id", nullable = false)
    private Long productoId;

    @Column(name = "producto_nombre", nullable = false)
    private String productoNombre;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(name = "precio_unitario", nullable = false)
    private Double precioUnitario;

    // subtotal = cantidad * precioUnitario
    @Column(nullable = false)
    private Double subtotal;

    public ItemPedido() {}

    public ItemPedido(Long id, Pedido pedido, Long productoId, String productoNombre, Integer cantidad, Double precioUnitario, Double subtotal) {
        this.id = id;
        this.pedido = pedido;
        this.productoId = productoId;
        this.productoNombre = productoNombre;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.subtotal = subtotal;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Pedido getPedido() { return pedido; }
    public void setPedido(Pedido pedido) { this.pedido = pedido; }

    public Long getProductoId() { return productoId; }
    public void setProductoId(Long productoId) { this.productoId = productoId; }

    public String getProductoNombre() { return productoNombre; }
    public void setProductoNombre(String productoNombre) { this.productoNombre = productoNombre; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public Double getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(Double precioUnitario) { this.precioUnitario = precioUnitario; }

    public Double getSubtotal() { return subtotal; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }
}
