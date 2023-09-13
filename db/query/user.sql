-- name: CreateUser :one
INSERT INTO users (
    full_name,
    email,
    role,
    hashed_password
) VALUES (
     $1, $2, $3, $4
) RETURNING *;

-- name: GetUser :one
SELECT * FROM users
WHERE email = $1 LIMIT 1;