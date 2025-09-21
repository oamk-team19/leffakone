BEGIN;

CREATE TYPE grouprequeststatus AS ENUM ('approved', 'pending', 'rejected');

ALTER TABLE user_group ADD grouprequest grouprequeststatus DEFAULT 'pending';

COMMIT;