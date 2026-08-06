const r=require("express").Router();r.get("/",require("./controller").list);module.exports=r;
