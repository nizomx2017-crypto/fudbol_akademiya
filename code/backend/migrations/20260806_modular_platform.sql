-- Production migration reference. Use a transaction via the deployment migration runner.
BEGIN;
ALTER TABLE IF EXISTS payments ALTER COLUMN amount TYPE NUMERIC(18,2) USING amount::numeric;
ALTER TABLE IF EXISTS students ALTER COLUMN balance TYPE NUMERIC(18,2) USING balance::numeric;
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_students_phone ON students(phone);
COMMIT;
