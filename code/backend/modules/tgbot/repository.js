const M=require("./model");module.exports={link:(userId,chatId)=>M.upsert({userId,chatId}),find:userId=>M.findOne({where:{userId}})};
