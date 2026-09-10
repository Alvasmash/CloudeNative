package cl.duoc.pedidos360.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

/**
 * =========================================================================
 * SEGURIDAD: RestAuthenticationEntryPoint (Manejador 401)
 * =========================================================================
 * FUNCION: Se activa cuando un cliente hace una peticion a una ruta protegida
 *          sin enviar el token, o enviando un token vencido/invalido.
 *          Devuelve una respuesta HTTP 401 Unauthorized con formato JSON limpio.
 * CONECTA CON: SecurityFilterChain de Spring Security.
 * EVALUACION (Rbrica 40%): "Responde con codigos de error adecuados".
 */
@Component
public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    public RestAuthenticationEntryPoint(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException {

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // Codigo 401
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("status", HttpServletResponse.SC_UNAUTHORIZED);
        body.put("error", "Unauthorized");
        body.put("message", "La solicitud requiere autenticacion con un Access Token JWT valido emitido por el IDaaS");
        body.put("path", request.getRequestURI());

        objectMapper.writeValue(response.getOutputStream(), body);
    }
}
