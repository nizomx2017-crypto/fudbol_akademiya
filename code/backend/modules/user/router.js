const r=require("express").Router(),c=require("./controller"),{requireFullAccess}=require("../../middleware/access");r.get("/me",c.me);r.get("/",requireFullAccess,c.list);module.exports=r;
