CREATE TABLE "order_items" (
  "id" bigserial PRIMARY KEY,
  "quantity" integer NOT NULL,
  "pack_size_id" integer NOT NULL,
  "order_id" integer NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

ALTER TABLE "order_items" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id");
ALTER TABLE "order_items" ADD FOREIGN KEY ("pack_size_id") REFERENCES "pack_sizes" ("id");