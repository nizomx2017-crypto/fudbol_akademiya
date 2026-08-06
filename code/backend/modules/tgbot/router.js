const r=require("express").Router();r.post("/webhook",require("./controller").webhook);module.exports=r;
