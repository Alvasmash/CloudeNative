package cl.duoc.pedidos360.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

/**
 * =========================================================================
 * DTO: PedidoCreateDTO (Formulario de Creacion de Pedido)
 * =========================================================================
 * FUNCION: Estructura y valida el JSON que el frontend Angular enviaa al crear un pedido.
 * CONECTA CON: El endpoint protegido POST /api/pedidos (que exige SCOPE_recurso.write).
 */
public class PedidoCreateDTO {

    // Nombre del cliente receptor
    @NotBlank(message = "El nombre del cliente es obligatorio")
    private String clienteNombre;

    // Correo electrunico del cliente para confirmacin de la orden
    @NotBlank(message = "El email del cliente es obligatorio")
    @Email(message = "El formato de email no es valido")
    private String clienteEmail;

    // Lista de productos solicitados (no puede ir vacioa)
    @NotEmpty(message = "El pedido debe contener al menos un producto")
    @Valid // Valida cada ItemPedidoDTO de la lista
    private List<ItemPedidoDTO> items;

    public PedidoCreateDTO() {}

    public PedidoCreateDTO(String clienteNombre, String clienteEmail, List<ItemPedidoDTO> items) {
        this.clienteNombre = clienteNombre;
        this.clienteEmail = clienteEmail;
        this.items = items;
    }

    public String getClienteNombre() { return clienteNombre; }
    public void setClienteNombre(String clienteNombre) { this.clienteNombre = clienteNombre; }

    public String getClienteEmail() { return clienteEmail; }
    public void setClienteEmail(String clienteEmail) { this.clienteEmail = clienteEmail; }

    public List<ItemPedidoDTO> getItems() { return items; }
    public void setItems(List<ItemPedidoDTO> items) { this.items = items; }
}
