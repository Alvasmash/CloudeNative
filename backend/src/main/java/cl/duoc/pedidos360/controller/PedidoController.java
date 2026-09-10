package cl.duoc.pedidos360.controller;

import java.net.URI;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cl.duoc.pedidos360.dto.PedidoCreateDTO;
import cl.duoc.pedidos360.model.Pedido;
import cl.duoc.pedidos360.service.PedidoService;
import jakarta.validation.Valid;

/**
 * =========================================================================
 * CONTROLADOR: PedidoController (Rutas Protegidas de Clientes)
 * =========================================================================
 * FUNCION: Expone operaciones para usuarios autenticados:
 *          - GET /api/profile: Consulta informacion y roles del usuario actual.
 *          - GET /api/pedidos: Lista pedidos (exige token valido).
 *          - POST /api/pedidos: Crea un nuevo pedido (exige scope 'recurso.write').
 * CONECTA CON: PedidoService y el frontend Angular con MSAL.
 * EVALUACION (Rbrica): "Operacion de lectura protegible y operacion de modificacion protegible".
 */
@RestController
@RequestMapping("/api")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    /**
     * Endpoint de perfil: Extrae del JWT el nombre de usuario y los roles/scopes otorgados.
     */
    @GetMapping("/profile")
    public Map<String, Object> profile(Authentication authentication) {
        return Map.of(
                "status", "ok",
                "user", authentication.getName(),
                "authorities", authentication.getAuthorities().stream().map(Object::toString).toList());
    }

    /**
     * Listado de pedidos: Solo accesible con Access Token valido.
     */
    @GetMapping("/pedidos")
    public List<Pedido> listarPedidos() {
        return pedidoService.listarTodos();
    }

    /**
     * Buscar un pedido por ID.
     */
    @GetMapping("/pedidos/{id}")
    public ResponseEntity<Pedido> buscarPedidoPorId(@PathVariable Long id) {
        return pedidoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Creacion de un pedido:
     * - Requiere que el token contenga el scope delegado 'recurso.write' (definido en SecurityConfig).
     * - Descuenta stock, genera el numero de orden y guarda en la base de datos.
     * - Retorna HTTP 201 Created con la orden creada y la cabecera Location.
     */
    @PostMapping("/pedidos")
    public ResponseEntity<?> crearPedido(@Valid @RequestBody PedidoCreateDTO dto, Authentication authentication) {
        try {
            Pedido nuevoPedido = pedidoService.crearPedido(dto, authentication.getName());
            return ResponseEntity.created(URI.create("/api/pedidos/" + nuevoPedido.getId())).body(nuevoPedido);
        } catch (IllegalArgumentException | IllegalStateException e) {
            // Retorna 400 Bad Request si no hay stock o los datos son invalidos
            return ResponseEntity.badRequest().body(Map.of("error", "Bad Request", "message", e.getMessage()));
        }
    }
}
