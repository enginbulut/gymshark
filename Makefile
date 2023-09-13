network:
	docker network create shark-network

pull_postgres:
	docker pull postgres:12-alpine

init_postgres:
	docker run --name postgres12 --network shark-network -p 5454:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=secret -d postgres:12-alpine

start_postgres:
	docker start postgres12

stop_postgres:
	docker stop postgres12

create_db:
	docker exec -it postgres12 createdb --username=root --owner=root gym_shark_db

drop_db:
	docker exec -it postgres12 dropdb gym_shark_db

add_migration:
	migrate create -ext sql -dir db/migration -seq $(migration_name)

migrate_up:
	migrate -path ./db/migration -database "postgresql://root:secret@localhost:5454/gym_shark_db?sslmode=disable" -verbose up

migrate_down:
	migrate -path ./db/migration -database "postgresql://root:secret@localhost:5454/gym_shark_db?sslmode=disable" -verbose down

sqlc:
	sqlc generate

test:
	go test -v -cover ./...

server:
	go run main.go

mockdb:
	sudo mockgen --package mockdb -destination db/mock/store.go github.com/enginbulut/gymshark/db/sqlc Store

print_go_path:
	/bin/bash -c "echo \$GOPATH"