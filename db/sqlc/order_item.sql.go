// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.20.0
// source: order_item.sql

package db

import (
	"context"
	"time"
)

const createOrderItem = `-- name: CreateOrderItem :one
INSERT INTO order_items (
    quantity,
    pack_size_id,
    order_id
) VALUES (
    $1, $2, $3
) RETURNING id, quantity, pack_size_id, order_id, created_at
`

type CreateOrderItemParams struct {
	Quantity   int32 `json:"quantity"`
	PackSizeID int32 `json:"pack_size_id"`
	OrderID    int32 `json:"order_id"`
}

func (q *Queries) CreateOrderItem(ctx context.Context, arg CreateOrderItemParams) (OrderItem, error) {
	row := q.db.QueryRowContext(ctx, createOrderItem, arg.Quantity, arg.PackSizeID, arg.OrderID)
	var i OrderItem
	err := row.Scan(
		&i.ID,
		&i.Quantity,
		&i.PackSizeID,
		&i.OrderID,
		&i.CreatedAt,
	)
	return i, err
}

const getOrderItemsByOrderId = `-- name: GetOrderItemsByOrderId :many
SELECT oi.id, oi.quantity, oi.pack_size_id, oi.order_id, oi.created_at, ps.name as pack_size_name, ps.quantity as pack_size_quantity
FROM order_items oi
INNER JOIN pack_sizes ps on oi.pack_size_id = ps.id
WHERE oi.order_id = $1
ORDER BY oi.id DESC
LIMIT $2
OFFSET $3
`

type GetOrderItemsByOrderIdParams struct {
	OrderID int32 `json:"order_id"`
	Limit   int32 `json:"limit"`
	Offset  int32 `json:"offset"`
}

type GetOrderItemsByOrderIdRow struct {
	ID               int64     `json:"id"`
	Quantity         int32     `json:"quantity"`
	PackSizeID       int32     `json:"pack_size_id"`
	OrderID          int32     `json:"order_id"`
	CreatedAt        time.Time `json:"created_at"`
	PackSizeName     string    `json:"pack_size_name"`
	PackSizeQuantity int32     `json:"pack_size_quantity"`
}

func (q *Queries) GetOrderItemsByOrderId(ctx context.Context, arg GetOrderItemsByOrderIdParams) ([]GetOrderItemsByOrderIdRow, error) {
	rows, err := q.db.QueryContext(ctx, getOrderItemsByOrderId, arg.OrderID, arg.Limit, arg.Offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []GetOrderItemsByOrderIdRow{}
	for rows.Next() {
		var i GetOrderItemsByOrderIdRow
		if err := rows.Scan(
			&i.ID,
			&i.Quantity,
			&i.PackSizeID,
			&i.OrderID,
			&i.CreatedAt,
			&i.PackSizeName,
			&i.PackSizeQuantity,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getOrderItemsByPackSizeId = `-- name: GetOrderItemsByPackSizeId :many
SELECT oi.id, oi.quantity, oi.pack_size_id, oi.order_id, oi.created_at, ps.name as pack_size_name, ps.quantity as pack_size_quantity
FROM order_items oi
INNER JOIN pack_sizes ps on oi.pack_size_id = ps.id
WHERE oi.pack_size_id = $1
ORDER BY oi.id DESC
LIMIT $2
OFFSET $3
`

type GetOrderItemsByPackSizeIdParams struct {
	PackSizeID int32 `json:"pack_size_id"`
	Limit      int32 `json:"limit"`
	Offset     int32 `json:"offset"`
}

type GetOrderItemsByPackSizeIdRow struct {
	ID               int64     `json:"id"`
	Quantity         int32     `json:"quantity"`
	PackSizeID       int32     `json:"pack_size_id"`
	OrderID          int32     `json:"order_id"`
	CreatedAt        time.Time `json:"created_at"`
	PackSizeName     string    `json:"pack_size_name"`
	PackSizeQuantity int32     `json:"pack_size_quantity"`
}

func (q *Queries) GetOrderItemsByPackSizeId(ctx context.Context, arg GetOrderItemsByPackSizeIdParams) ([]GetOrderItemsByPackSizeIdRow, error) {
	rows, err := q.db.QueryContext(ctx, getOrderItemsByPackSizeId, arg.PackSizeID, arg.Limit, arg.Offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []GetOrderItemsByPackSizeIdRow{}
	for rows.Next() {
		var i GetOrderItemsByPackSizeIdRow
		if err := rows.Scan(
			&i.ID,
			&i.Quantity,
			&i.PackSizeID,
			&i.OrderID,
			&i.CreatedAt,
			&i.PackSizeName,
			&i.PackSizeQuantity,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}
