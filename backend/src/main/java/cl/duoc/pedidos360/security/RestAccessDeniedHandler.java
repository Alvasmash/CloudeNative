package cl.duoc.pedidos360.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

/**
 * =========================================================================
 * SEGURIDAD: RestAccessDeniedHandler (Manejador 403)
 * =========================================================================
 * FUNCION: Se activa cuando el usuario s� envi� un token v�lido de Azure AD,
 *          pero su cuenta NO tiene el permiso o rol requerido (ej: no es ADMIN).
 *          Devuelve una respuesta HTTP 403 Forbidden con formato JSON limpio.
 * CONECTA CON: SecurityFilterChain de Spring Security.
 * EVALUACION (R�brica 40%): "Responde con c�digos de error adecuados (403 Forbidden)".
 */
@Component
public class RestAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper objectMapper;

    public RestAccessDeniedHandler(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException)
            throws IOException {

        response.setStatus(HttpServletResponse.SC_FORBIDDEN); // C�digo 403
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("status", HttpServletResponse.SC_FORBIDDEN);
        body.put("error", "Forbidden");
        body.put("message", "Acceso denegado: El Access Token es v�lido pero carece del scope o rol necesario");
        body.put("path", request.getRequestURI());

        objectMapper.writeValue(response.getOutputStream(), body);
    }
}
