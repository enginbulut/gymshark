-- name: CreatePackSize :one
INSERT INTO pack_sizes (
    name,
    quantity
) VALUES (
    $1, $2
) RETURNING *;

-- name: GetPackSize :one
SELECT * FROM pack_sizes
WHERE deleted_at IS NULL and id = $1
LIMIT 1;

-- name: GetClosestPackSizeByQuantity :one
SELECT * FROM pack_sizes
WHERE deleted_at IS NULL and quantity <= $1
ORDER BY quantity DESC
LIMIT 1;

-- name: GetPackSizesWithPagination :many
SELECT * FROM pack_sizes
WHERE deleted_at IS NULL
ORDER BY id
LIMIT $1
OFFSET $2;

-- name: GetPackSizesWithoutPagination :many
SELECT * FROM pack_sizes
WHERE deleted_at IS NULL
ORDER BY id;

-- name: GetPackSizeCount :one
SELECT COUNT(id) FROM pack_sizes
WHERE deleted_at IS NULL;

-- name: UpdatePackSize :one
UPDATE pack_sizes
SET name = sqlc.arg(name), quantity = sqlc.arg(quantity)
WHERE id = sqlc.arg(id)
RETURNING *;

-- name: DeletePackSize :exec
UPDATE pack_sizes
SET deleted_at = NOW()
WHERE id = sqlc.arg(id);

