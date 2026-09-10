package cl.duoc.pedidos360.controller;

import cl.duoc.pedidos360.model.Producto;
import cl.duoc.pedidos360.service.ProductoService;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * =========================================================================
 * CONTROLADOR: PublicController (Rutas Pblicas)
 * =========================================================================
 * FUNCION: Expone operaciones que NO requieren autenticacion (acceso libre).
 * CONECTA CON: El frontend Angular para que cualquier visitante pueda ver el menu
 *              y verificar la salud del backend sin necesidad de login.
 * EVALUACION (Rbrica): "Una operacion publica que pueda ejecutarse sin autenticacion".
 */
@RestController
@RequestMapping("/public")
public class PublicController {

    private final ProductoService productoService;

    public PublicController(ProductoService productoService) {
        this.productoService = productoService;
    }

    /**
     * Endpoint de Healthcheck: Devuelve el estado operativo del servicio.
     * Retorna HTTP 200 OK.
     */
    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of(
                "status", "UP",
                "system", "Pedidos360 Backend - Seccion 002D",
                "access", "public",
                "timestamp", Instant.now().toString());
    }

    /**
     * Catalogo publico de productos: Lista pizzas, hamburguesas y bebidas.
     * Retorna HTTP 200 OK con el array de productos.
     */
    @GetMapping("/productos")
    public List<Producto> listarProductos() {
        return productoService.listarTodos();
    }

    /**
     * Detalle de un producto por su ID.
     * Retorna HTTP 200 OK si existe, o 404 Not Found si no existe.
     */
    @GetMapping("/productos/{id}")
    public ResponseEntity<Producto> buscarProductoPorId(@PathVariable Long id) {
        return productoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
