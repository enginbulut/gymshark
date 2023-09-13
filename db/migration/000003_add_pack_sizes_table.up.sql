CREATE TABLE "pack_sizes" (
  "id" bigserial PRIMARY KEY,
  "name" varchar NOT NULL,
  "quantity" integer NOT NULL,
  "deleted_at" timestamptz NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE UNIQUE INDEX unq_pack_size_quantity ON "pack_sizes" ("quantity");