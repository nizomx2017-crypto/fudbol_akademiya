const db=require("../../config/db");
async function backfillLegacyParticipants(){
  await db.query(`
    INSERT INTO conversation_participants ("conversationId", "userId", "createdAt", "updatedAt")
    SELECT DISTINCT "conversationId", "senderId", NOW(), NOW()
    FROM messages
    ON CONFLICT ("conversationId", "userId") DO NOTHING
  `);
}
module.exports={backfillLegacyParticipants};
