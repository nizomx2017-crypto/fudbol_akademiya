BEGIN;
CREATE TABLE IF NOT EXISTS conversation_participants (
  id SERIAL PRIMARY KEY,
  "conversationId" INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  "userId" INTEGER NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE ("conversationId", "userId")
);
CREATE INDEX IF NOT EXISTS conversation_participants_user_id ON conversation_participants("userId");
INSERT INTO conversation_participants ("conversationId", "userId", "createdAt", "updatedAt")
SELECT DISTINCT "conversationId", "senderId", NOW(), NOW() FROM messages
ON CONFLICT ("conversationId", "userId") DO NOTHING;
COMMIT;
