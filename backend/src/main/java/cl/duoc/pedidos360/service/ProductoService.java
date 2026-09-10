package cl.duoc.pedidos360.service;

import cl.duoc.pedidos360.model.Producto;
import cl.duoc.pedidos360.repository.ProductoRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * =========================================================================
 * SERVICIO: ProductoService
 * =========================================================================
 * FUNCION: Contiene la logica de negocio para consultar productos del menu.
 * CONECTA CON: ProductoRepository (datos) y PublicController (endpoints publicos).
 */
@Service
@Transactional(readOnly = true) // Optimiza consultas de solo lectura en la base de datos
public class ProductoService {

    private final ProductoRepository productoRepository;

    // Inyeccin de dependencias por constructor (buena practica recomendada)
    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    // Retorna todo el catalogo de platos y bebidas
    public List<Producto> listarTodos() {
        return productoRepository.findAll();
    }

    // Busca un producto especifico por su ID
    public Optional<Producto> buscarPorId(Long id) {
        return productoRepository.findById(id);
    }

    // Filtra productos por categora (ej: "Pizzas")
    public List<Producto> listarPorCategoria(String categoria) {
        return productoRepository.findByCategoriaIgnoreCase(categoria);
    }
}
