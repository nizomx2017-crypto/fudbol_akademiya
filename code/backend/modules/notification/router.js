const express=require("express"); module.exports=require("../../shared/crud").routes(express,require("./controller"),require("./dto"));
