BEGIN;

ALTER TABLE "user" rename TO users;
ALTER TABLE users ADD COLUMN email_new VARCHAR(255);
UPDATE users
SET email_new = COALESCE(email[1], ''); 
ALTER TABLE users DROP COLUMN email;
ALTER TABLE users RENAME COLUMN email_new TO email;
ALTER TABLE users ALTER COLUMN email SET NOT NULL;
ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);

COMMIT;