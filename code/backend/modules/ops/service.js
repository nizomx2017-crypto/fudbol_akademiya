const r=require("./repository");module.exports={health:()=>({status:"ok",uptime:process.uptime()}),readiness:async()=>{await r.db();return{status:"ready",database:"up"}},audit:r.audit};
