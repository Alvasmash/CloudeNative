package cl.duoc.pedidos360.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import cl.duoc.pedidos360.model.Producto;

/**
 * =========================================================================
 * REPOSITORIO JPA: ProductoRepository
 * =========================================================================
 * FUNCION: Provee operaciones de base de datos listas para la tabla 'productos' (buscar, guardar, borrar).
 * CONECTA CON: Spring Data JPA y la base de datos SQL.
 */
@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    // Mtodo generado automaticamente por Spring Data JPA para filtrar platos por categora
    List<Producto> findByCategoriaIgnoreCase(String categoria);
}
