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
 * FUNCION: Contiene la l�gica de negocio para consultar productos del men�.
 * CONECTA CON: ProductoRepository (datos) y PublicController (endpoints p�blicos).
 */
@Service
@Transactional(readOnly = true) // Optimiza consultas de solo lectura en la base de datos
public class ProductoService {

    private final ProductoRepository productoRepository;

    // Inyecci�n de dependencias por constructor (buena pr�ctica recomendada)
    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    // Retorna todo el cat�logo de platos y bebidas
    public List<Producto> listarTodos() {
        return productoRepository.findAll();
    }

    // Busca un producto espec�fico por su ID
    public Optional<Producto> buscarPorId(Long id) {
        return productoRepository.findById(id);
    }

    // Filtra productos por categor�a (ej: "Pizzas")
    public List<Producto> listarPorCategoria(String categoria) {
        return productoRepository.findByCategoriaIgnoreCase(categoria);
    }
}
