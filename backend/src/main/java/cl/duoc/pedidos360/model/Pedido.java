package cl.duoc.pedidos360.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * =========================================================================
 * ENTIDAD JPA: Pedido (Cabecera de la Orden)
 * =========================================================================
 * FUNCION: Representa la orden de compra realizada por el cliente con su total y estado.
 * CONECTA CON: Tabla 'pedidos' y maneja una lista de 'ItemPedido' mediante cascada completa.
 */
@Entity
@Table(name = "pedidos")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Codigo legible unico para identificar la orden (ej: "PED-A1B2C3D4")
    @Column(name = "numero_pedido", nullable = false, unique = true)
    private String numeroPedido;

    // Nombre del cliente que orden
    @Column(name = "cliente_nombre", nullable = false)
    private String clienteNombre;

    // Email del cliente (obtenido del formulario o del token de Azure AD)
    @Column(name = "cliente_email", nullable = false)
    private String clienteEmail;

    // Fecha y hora exacta de creacion
    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;

    // Estado actual del pedido guardado como texto en la BD (PENDIENTE, ENTREGADO, etc.)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoPedido estado;

    // Monto final a pagar
    @Column(nullable = false)
    private Double total;

    // Relacion OneToMany: Un pedido contiene muchos items.
    // CascadeType.ALL: Si guardamos o borramos el pedido, sus items se guardan o borran automaticamente.
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ItemPedido> items = new ArrayList<>();

    public Pedido() {}

    public Pedido(Long id, String numeroPedido, String clienteNombre, String clienteEmail, LocalDateTime fechaCreacion, EstadoPedido estado, Double total) {
        this.id = id;
        this.numeroPedido = numeroPedido;
        this.clienteNombre = clienteNombre;
        this.clienteEmail = clienteEmail;
        this.fechaCreacion = fechaCreacion;
        this.estado = estado;
        this.total = total;
    }

    // Mtodo helper para agregar un item asociando la relacion bidireccional
    public void agregarItem(ItemPedido item) {
        items.add(item);
        item.setPedido(this);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNumeroPedido() { return numeroPedido; }
    public void setNumeroPedido(String numeroPedido) { this.numeroPedido = numeroPedido; }

    public String getClienteNombre() { return clienteNombre; }
    public void setClienteNombre(String clienteNombre) { this.clienteNombre = clienteNombre; }

    public String getClienteEmail() { return clienteEmail; }
    public void setClienteEmail(String clienteEmail) { this.clienteEmail = clienteEmail; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public EstadoPedido getEstado() { return estado; }
    public void setEstado(EstadoPedido estado) { this.estado = estado; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }

    public List<ItemPedido> getItems() { return items; }
    public void setItems(List<ItemPedido> items) { this.items = items; }
}
