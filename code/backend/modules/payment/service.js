const r=require("./repository"),{AppError}=require("../../shared/errors");

async function create(data,userId,key){
  if(!key)throw new AppError(400,"Idempotency-Key kerak","IDEMPOTENCY_KEY_REQUIRED");
  const existing=await r.findByIdempotencyKey(key);
  if(existing)return{payment:existing,created:false};
  try{return{payment:await r.create({...data,userId},key),created:true};}
  catch(error){
    if(error.name!=="SequelizeUniqueConstraintError")throw error;
    const concurrent=await r.findByIdempotencyKey(key);
    if(!concurrent)throw error;
    return{payment:concurrent,created:false};
  }
}

module.exports={create,get:r.get,list:r.list,cancel:r.cancel,webhook:r.webhook};
