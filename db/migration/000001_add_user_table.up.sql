CREATE TABLE "users" (
 "id" bigserial PRIMARY KEY,
 "full_name" varchar NOT NULL,
 "email" varchar UNIQUE NOT NULL,
 "role" integer NOT NULL DEFAULT(0),
 "hashed_password" varchar NOT NULL,
 "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE UNIQUE INDEX unq_user_email ON "users" ("email");

INSERT INTO users (full_name, email, role, hashed_password)
VALUES ('Admin User', 'admin@test.com', 1, '$2a$10$czyE8ApP2BhvbcYyP0ns3OnfDZWe1/pbeXyURUiKuYv3a2N1AKk3a');
-- password is administrator

