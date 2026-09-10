package cl.duoc.pedidos360.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * =========================================================================
 * ENTIDAD JPA: Producto
 * =========================================================================
 * FUNCION: Representa cada plato o bebida disponible en el catalogo de Pedidos360.
 * CONECTA CON: Tabla 'productos' en la base de datos (H2 local o AWS RDS Cloud).
 */
@Entity
@Table(name = "productos")
public class Producto {

    // Clave primaria autoincremental en la base de datos
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nombre del plato o bebida (ej: "Pizza Margherita")
    @Column(nullable = false)
    private String nombre;

    // Descripcin con los ingredientes y detalles del plato
    @Column(length = 500)
    private String descripcion;

    // Precio unitario en pesos chilenos (CLP)
    @Column(nullable = false)
    private Double precio;

    // Categora para organizar el menu (ej: "Pizzas", "Hamburguesas", "Bebidas")
    @Column(nullable = false)
    private String categoria;

    // Cantidad disponible en cocina para venta
    @Column(nullable = false)
    private Integer stock;

    // Constructor vacioo obligatorio requerido por Hibernate/JPA
    public Producto() {}

    // Constructor completo para crear productos manualmente si se requiere
    public Producto(Long id, String nombre, String descripcion, Double precio, String categoria, Integer stock) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.categoria = categoria;
        this.stock = stock;
    }

    // Mtodos Getters y Setters para lectura y escritura de atributos
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public Double getPrecio() { return precio; }
    public void setPrecio(Double precio) { this.precio = precio; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
}
