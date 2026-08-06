const{test}=require("node:test"),assert=require("node:assert/strict");test("test payment provider is available",()=>assert.equal(require("./service").providers()[0].status,"available"));
