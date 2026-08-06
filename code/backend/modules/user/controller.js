const a=require("../../shared/async-handler"),s=require("./service");module.exports={me:a(async(req,res)=>res.json(await s.findById(req.user.id))),list:a(async(req,res)=>res.json(await s.list()))};
