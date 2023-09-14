-- name: CreateOrderItem :one
INSERT INTO order_items (
    quantity,
    pack_size_id,
    order_id
) VALUES (
    $1, $2, $3
) RETURNING *;

-- name: GetOrderItemsByOrderId :many
SELECT oi.*, ps.name as pack_size_name, ps.quantity as pack_size_quantity
FROM order_items oi
INNER JOIN pack_sizes ps on oi.pack_size_id = ps.id
WHERE oi.order_id = $1
ORDER BY oi.id DESC;

-- name: GetOrderItemsByPackSizeId :many
SELECT oi.*, ps.name as pack_size_name, ps.quantity as pack_size_quantity
FROM order_items oi
INNER JOIN pack_sizes ps on oi.pack_size_id = ps.id
WHERE oi.pack_size_id = $1
ORDER BY oi.id DESC;