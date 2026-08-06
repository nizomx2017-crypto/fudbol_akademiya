const a=require("../../shared/async-handler"),s=require("./service");module.exports={health:(req,res)=>res.json(s.health()),ready:a(async(req,res)=>res.json(await s.readiness()))};
