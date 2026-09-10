-- Insercion de catalogo de productos inicial para Pedidos360
INSERT INTO productos (nombre, descripcion, precio, categoria, stock) VALUES
('Pizza Margherita', 'Salsa de tomate casera, mozzarella fior di latte y albahaca fresca', 8990.0, 'Pizzas', 25),
('Pizza Pepperoni Supreme', 'Mozzarella, salsa de tomate y abundante pepperoni americano', 9990.0, 'Pizzas', 20),
('Hamburguesa Doble Smash', 'Doble carne angus, doble cheddar, cebolla crispy y salsa especial', 7490.0, 'Hamburguesas', 15),
('Hamburguesa Veggie Burger', 'Medallon de garbanzos y lentejas, palta fresca, tomate y lechuga', 6990.0, 'Hamburguesas', 10),
('Bebida Coca-Cola Zero 350ml', 'Lata helada 350ml sin azucar', 1500.0, 'Bebidas', 50),
('Jugo Natural Frutilla 500ml', 'Jugo natural de frutilla endulzado con estevia', 2200.0, 'Bebidas', 30);

-- Insercion de pedido de ejemplo inicial
INSERT INTO pedidos (numero_pedido, cliente_nombre, cliente_email, fecha_creacion, estado, total) VALUES
('ORD-2026-001', 'Juan Perez', 'juan.perez@duocuc.cl', CURRENT_TIMESTAMP(), 'ENTREGADO', 16480.0);

INSERT INTO items_pedido (pedido_id, producto_id, producto_nombre, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 'Pizza Margherita', 1, 8990.0, 8990.0),
(1, 3, 'Hamburguesa Doble Smash', 1, 7490.0, 7490.0);
