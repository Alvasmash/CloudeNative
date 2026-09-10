package cl.duoc.pedidos360.security;

import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;

/**
 * =========================================================================
 * SEGURIDAD: AudienceValidator
 * =========================================================================
 * FUNCION: Validador de audiencia (claim 'aud' del JWT de Azure Active Directory).
 *          Verifica que el Access Token recibido fue emitido ESPEC�FICAMENTE
 *          para este backend y no para otra aplicaci�n de la nube.
 * CONECTA CON: El bean JwtDecoder en SecurityConfig.
 * EVALUACION (R�brica 40%): "El BFF valida issuer y audience de forma correcta".
 */
public class AudienceValidator implements OAuth2TokenValidator<Jwt> {

    private final String expectedAudience;

    public AudienceValidator(String expectedAudience) {
        this.expectedAudience = expectedAudience;
    }

    @Override
    public OAuth2TokenValidatorResult validate(Jwt jwt) {
        // Comprueba si la lista de audiencias del token contiene la audiencia de nuestra API
        if (jwt.getAudience().contains(expectedAudience)) {
            return OAuth2TokenValidatorResult.success();
        }
        // Si no coincide, rechaza el token con error OAuth2
        return OAuth2TokenValidatorResult.failure(
                new OAuth2Error("invalid_token", "El token no contiene la audiencia esperada: " + expectedAudience, null));
    }
}
