-- name: CreateOrder :one
INSERT INTO orders (
    purchased_item_count,
    requested_item_count,
    user_id
) VALUES (
    $1, $2, $3
) RETURNING *;

-- name: GetOrder :one
SELECT o.*, u.email as user_email, u.full_name as user_full_name
FROM orders o
INNER JOIN users u on o.user_id = u.id
WHERE o.id = $1 LIMIT 1;

-- name: GetOrdersByUserId :many
SELECT o.*, u.email as user_email, u.full_name as user_full_name
FROM orders o
INNER JOIN users u on o.user_id = u.id
WHERE o.user_id = $1
ORDER BY o.id desc
LIMIT $2
OFFSET $3;

-- name: GetOrdersCountByUserId :one
SELECT COUNT(*)
FROM orders o
INNER JOIN users u on o.user_id = u.id
WHERE o.user_id = $1;

-- name: GetOrders :many
SELECT o.*, u.email as user_email, u.full_name as user_full_name
FROM orders o
INNER JOIN users u on o.user_id = u.id
ORDER BY o.id desc
LIMIT $1
OFFSET $2;

-- name: GetOrdersCount :one
SELECT COUNT(*)
FROM orders o
INNER JOIN users u on o.user_id = u.id;
