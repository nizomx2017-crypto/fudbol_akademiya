const {DataTypes}=require("sequelize"); const db=require("../../config/db");
const Conversation=db.define("conversations",{id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},title:DataTypes.STRING});
const Message=db.define("messages",{id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},conversationId:{type:DataTypes.INTEGER,allowNull:false},senderId:{type:DataTypes.INTEGER,allowNull:false},body:{type:DataTypes.TEXT,allowNull:false},readAt:DataTypes.DATE},{indexes:[{fields:["conversationId","createdAt"]}]});
Conversation.hasMany(Message,{foreignKey:"conversationId",as:"messages",onDelete:"CASCADE"}); Message.belongsTo(Conversation,{foreignKey:"conversationId"}); module.exports={Conversation,Message};
