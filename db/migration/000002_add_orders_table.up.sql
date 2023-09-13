CREATE TABLE "orders" (
 "id" bigserial PRIMARY KEY,
 "purchased_item_count" integer NOT NULL,
 "requested_item_count" integer NOT NULL,
 "user_id" integer NOT NULL,
 "created_at" timestamptz NOT NULL DEFAULT (now())
);

ALTER TABLE "orders" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");