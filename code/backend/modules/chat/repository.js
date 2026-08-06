const db=require("../../config/db"),{Conversation,Message,Participant}=require("./model");const{pagination}=require("../../shared/validate");
const participantInclude=userId=>({model:Participant,as:"participants",where:{userId},attributes:[]});
module.exports={
  list:async(userId,q)=>{const{limit,offset}=pagination(q);return Conversation.findAndCountAll({limit,offset,distinct:true,include:[participantInclude(userId),{model:Message,as:"messages"}],order:[["createdAt","DESC"]]})},
  get:(id,userId)=>Conversation.findOne({where:{id},include:[participantInclude(userId),{model:Message,as:"messages"}]}),
  isParticipant:async(conversationId,userId)=>Boolean(await Participant.findOne({where:{conversationId,userId}})),
  create:(data,creatorId,selectedUserId)=>db.transaction(async transaction=>{const conversation=await Conversation.create(data,{transaction});await Participant.bulkCreate([{conversationId:conversation.id,userId:creatorId},{conversationId:conversation.id,userId:selectedUserId}],{transaction,ignoreDuplicates:true});return Conversation.findByPk(conversation.id,{transaction,include:[{model:Participant,as:"participants"}]})}),
  send:(conversationId,data)=>Message.create({...data,conversationId}),
  message:id=>Message.findByPk(id),
  read:async id=>{const m=await Message.findByPk(id);return m&&m.update({readAt:new Date()})}
};
