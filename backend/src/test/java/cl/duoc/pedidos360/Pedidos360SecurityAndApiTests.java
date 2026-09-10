package cl.duoc.pedidos360;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.web.servlet.MockMvc;

/**
 * =========================================================================
 * SUITE DE PRUEBAS DE SEGURIDAD Y API REST
 * =========================================================================
 * FUNCION: Valida automaticamente que todos los endpoints respondan con los
 *          codigos HTTP exactos exigidos por la rbrica (200, 201, 401, 403, 204)
 *          tanto en escenarios annimos, autenticados, con scope y con rol ADMIN.
 */
@SpringBootTest(properties = "spring.main.allow-bean-definition-overriding=true")
@AutoConfigureMockMvc
class Pedidos360SecurityAndApiTests {

    @Autowired
    private MockMvc mockMvc;

    // Configuracion de prueba para no requerir conexion real a internet con Azure AD durante los tests
    @TestConfiguration
    static class TestSecurityConfig {
        @Bean
        @Primary
        JwtDecoder testJwtDecoder() {
            return token -> new Jwt(
                    token,
                    Instant.now(),
                    Instant.now().plusSeconds(3600),
                    Map.of("alg", "none"),
                    Map.of(
                            "sub", "test-user",
                            "scp", "recurso.read recurso.write",
                            "aud", List.of("api://pedidos360-api")
                    )
            );
        }
    }

    @Test
    @DisplayName("1. Endpoint publico /public/health responde 200 OK sin credenciales")
    void publicHealth_shouldReturn200() throws Exception {
        mockMvc.perform(get("/public/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.access").value("public"));
    }

    @Test
    @DisplayName("2. Endpoint publico /public/productos responde 200 OK y entrega el catalogo")
    void publicProductos_shouldReturn200() throws Exception {
        mockMvc.perform(get("/public/productos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @DisplayName("3. Endpoint protegido /api/pedidos sin token responde 401 Unauthorized")
    void protectedPedidos_withoutToken_shouldReturn401() throws Exception {
        mockMvc.perform(get("/api/pedidos"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.error").value("Unauthorized"));
    }

    @Test
    @DisplayName("4. Endpoint protegido /api/pedidos con token valido responde 200 OK")
    void protectedPedidos_withToken_shouldReturn200() throws Exception {
        mockMvc.perform(get("/api/pedidos")
                .with(jwt().jwt(jwt -> jwt.subject("test-user"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @DisplayName("5. Endpoint protegido /api/profile con token valido responde 200 OK y datos del usuario")
    void protectedProfile_withToken_shouldReturn200() throws Exception {
        mockMvc.perform(get("/api/profile")
                .with(jwt().jwt(jwt -> jwt.subject("cliente@pedidos360.cl"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ok"))
                .andExpect(jsonPath("$.user").value("cliente@pedidos360.cl"));
    }

    @Test
    @DisplayName("6. POST /api/pedidos con token SIN scope recurso.write responde 403 Forbidden")
    void postPedido_withoutWriteScope_shouldReturn403() throws Exception {
        String payload = """
                {
                    "clienteNombre": "Juan Perez",
                    "clienteEmail": "juan@duocuc.cl",
                    "items": [
                        { "productoId": 1, "cantidad": 2 }
                    ]
                }
                """;

        mockMvc.perform(post("/api/pedidos")
                .with(jwt().authorities(new SimpleGrantedAuthority("SCOPE_recurso.read")))
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403))
                .andExpect(jsonPath("$.error").value("Forbidden"));
    }

    @Test
    @DisplayName("7. POST /api/pedidos con token CON scope recurso.write responde 201 Created")
    void postPedido_withWriteScope_shouldReturn201() throws Exception {
        String payload = """
                {
                    "clienteNombre": "Carlos Duoc",
                    "clienteEmail": "carlos@duocuc.cl",
                    "items": [
                        { "productoId": 1, "cantidad": 1 }
                    ]
                }
                """;

        mockMvc.perform(post("/api/pedidos")
                .with(jwt().authorities(new SimpleGrantedAuthority("SCOPE_recurso.write")))
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.numeroPedido").isNotEmpty())
                .andExpect(jsonPath("$.total").isNumber());
    }

    @Test
    @DisplayName("8. GET /api/admin/pedidos sin rol ROLE_ADMIN responde 403 Forbidden")
    void adminEndpoint_withoutAdminRole_shouldReturn403() throws Exception {
        mockMvc.perform(get("/api/admin/pedidos")
                .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_USER"))))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403));
    }

    @Test
    @DisplayName("9. GET /api/admin/pedidos con rol ROLE_ADMIN responde 200 OK con metricas")
    void adminEndpoint_withAdminRole_shouldReturn200() throws Exception {
        mockMvc.perform(get("/api/admin/pedidos")
                .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_ADMIN"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalPedidos").isNumber())
                .andExpect(jsonPath("$.totalRecaudado").isNumber())
                .andExpect(jsonPath("$.pedidos").isArray());
    }

    @Test
    @DisplayName("10. DELETE /api/admin/pedidos/{id} con rol ROLE_ADMIN responde 204 No Content")
    void deletePedido_withAdminRole_shouldReturn204() throws Exception {
        mockMvc.perform(delete("/api/admin/pedidos/1")
                .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_ADMIN"))))
                .andExpect(status().isNoContent());
    }
}
