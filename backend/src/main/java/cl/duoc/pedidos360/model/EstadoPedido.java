package cl.duoc.pedidos360.model;

/**
 * =========================================================================
 * ENUM: EstadoPedido
 * =========================================================================
 * FUNCION: Define los unicos estados permitidos para una orden de comida.
 * CONECTA CON: El atributo 'estado' de la entidad Pedido en la base de datos.
 */
public enum EstadoPedido {
    PENDIENTE,       // El cliente acaba de realizar el pedido
    EN_PREPARACION,  // La cocina esta preparando los productos
    EN_CAMINO,       // El repartidor va hacia la direccion del cliente
    ENTREGADO,       // El pedido fue recibido exitosamente
    CANCELADO        // El pedido fue anulado por el cliente o administracion
}
