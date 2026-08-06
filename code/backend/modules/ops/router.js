const r=require("express").Router(),c=require("./controller");r.get("/health",c.health);r.get("/ready",c.ready);module.exports=r;
