package cl.duoc.pedidos360.security;

import static org.springframework.security.config.Customizer.withDefaults;

import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * =========================================================================
 * CONFIGURACION CENTRAL DE SEGURIDAD: SecurityConfig
 * =========================================================================
 * FUNCION: Define la poltica de seguridad global de la aplicacion:
 *          - Deshabilita CSRF (porque las APIs REST con JWT son STATELESS).
 *          - Habilita y configura CORS para permitir llamadas desde Angular (puerto 4200).
 *          - Define reglas de autorizacion por ruta (publico, autenticado, scopes, roles).
 *          - Configura el Resource Server para validar la firma digital con Azure AD.
 * CONECTA CON: Todos los controladores REST de la aplicacion.
 */
@Configuration
public class SecurityConfig {

    /**
     * Define la cadena de filtros de seguridad HTTP (SecurityFilterChain)
     */
    @Bean
    SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthenticationConverter jwtAuthenticationConverter,
            RestAuthenticationEntryPoint authenticationEntryPoint,
            RestAccessDeniedHandler accessDeniedHandler) throws Exception {

        http
            // 1. Desactivar CSRF y configurar sesiones STATELESS (sin cookies de sesion)
            .csrf(csrf -> csrf.disable())
            .cors(withDefaults())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // 2. Reglas de autorizacion de rutas
            .authorizeHttpRequests(auth -> auth
                // Rutas publicas accesibles por cualquiera sin iniciar sesion
                .requestMatchers("/public/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Pre-flight CORS

                // Crear pedidos requiere que el frontend enviae el scope delegado 'recurso.write'
                .requestMatchers(HttpMethod.POST, "/api/pedidos/**").hasAuthority("SCOPE_recurso.write")

                // Endpoints de administracion exigen que el usuario tenga asignado el App Role 'ADMIN' en Azure AD
                .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")

                // Cualquier otra ruta bajo /api/** exige estar autenticado con un token valido
                .requestMatchers("/api/**").authenticated()

                .anyRequest().permitAll())

            // 3. Configurar OAuth2 Resource Server con validacion de JWT y manejadores de error personalizados
            .oauth2ResourceServer(oauth2 -> oauth2
                .authenticationEntryPoint(authenticationEntryPoint)
                .accessDeniedHandler(accessDeniedHandler)
                .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter)))

            // 4. Registrar manejadores de error 401 y 403
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint(authenticationEntryPoint)
                .accessDeniedHandler(accessDeniedHandler))

            // 5. Permitir ver la consola H2 en el navegador en desarrollo
            .headers(headers -> headers.frameOptions(frame -> frame.disable()));

        return http.build();
    }

    /**
     * Configura el decodificador de JWT para validar la firma con las llaves publicas de Microsoft (JWKS)
     * y validar tanto el emisor (issuer) como la audiencia (audience).
     */
    @Bean
    @ConditionalOnMissingBean(JwtDecoder.class)
    JwtDecoder jwtDecoder(
            @Value("${app.security.issuer}") String issuer,
            @Value("${app.security.audience}") String audience) {

        NimbusJwtDecoder decoder;
        if (issuer.contains("{tenantid}") || issuer.contains("common")) {
            // Permite desarrollo local y resolucion flexible de JWKS
            decoder = NimbusJwtDecoder.withJwkSetUri("https://login.microsoftonline.com/common/discovery/v2.0/keys").build();
        } else {
            decoder = NimbusJwtDecoder.withIssuerLocation(issuer).build();
        }

        // Validador por defecto de firma, emisor y vigencia (fecha de expiracin)
        OAuth2TokenValidator<Jwt> defaultValidator = JwtValidators.createDefaultWithIssuer(issuer);
        // Validador estricto de Audience (aud)
        OAuth2TokenValidator<Jwt> audienceValidator = new AudienceValidator(audience);

        decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(defaultValidator, audienceValidator));
        return decoder;
    }

    /**
     * Vincula el convertidor de autoridades personalizadas (AuthoritiesConverter)
     */
    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(new AuthoritiesConverter());
        return converter;
    }

    /**
     * Configura las reglas de CORS para permitir que la SPA Angular (localhost:4200)
     * pueda hacer peticiones HTTP al backend sin ser bloqueada por el navegador.
     */
    @Bean
    CorsConfigurationSource corsConfigurationSource(
            @Value("${app.security.allowed-origins}") String allowedOrigins) {

        CorsConfiguration configuration = new CorsConfiguration();
        List<String> origins = Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(val -> !val.isBlank())
                .toList();

        configuration.setAllowedOrigins(origins);
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setExposedHeaders(List.of("WWW-Authenticate"));
        configuration.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
