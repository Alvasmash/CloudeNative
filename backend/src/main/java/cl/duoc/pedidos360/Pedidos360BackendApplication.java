package cl.duoc.pedidos360;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * =========================================================================
 * CLASE PRINCIPAL: Pedidos360BackendApplication
 * =========================================================================
 * FUNCION: Punto de entrada principal para iniciar el backend Spring Boot.
 *          La anotaci�n @SpringBootApplication activa:
 *          1. @Configuration: Permite registrar componentes y beans.
 *          2. @EnableAutoConfiguration: Configura Tomcat, Spring Security y JPA autom�ticamente.
 *          3. @ComponentScan: Escanea todos los paquetes hijos para registrar Controllers, Services y Repositories.
 */
@SpringBootApplication
public class Pedidos360BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(Pedidos360BackendApplication.class, args);
    }
}
