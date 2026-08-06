const r=require("./repository"),{AppError}=require("../../shared/errors");
async function requireParticipant(conversationId,userId){if(!await r.isParticipant(conversationId,userId))throw new AppError(403,"Conversation participant emas","FORBIDDEN")}
module.exports={
  list:(userId,q)=>r.list(userId,q),
  get:async(id,userId)=>{const row=await r.get(id,userId);if(!row)throw new AppError(403,"Conversation participant emas","FORBIDDEN");return row},
  create:(data,creatorId)=>{if(Number(data.participantId)===Number(creatorId))throw new AppError(400,"Boshqa participant tanlang","VALIDATION_ERROR");return r.create({title:data.title},creatorId,data.participantId)},
  send:async(conversationId,data,userId)=>{await requireParticipant(conversationId,userId);return r.send(conversationId,{...data,senderId:userId})},
  read:async(messageId,userId)=>{const message=await r.message(messageId);if(!message)throw new AppError(404,"Xabar topilmadi","NOT_FOUND");await requireParticipant(message.conversationId,userId);return r.read(messageId)}
};
