const{test}=require("node:test"),assert=require("node:assert/strict");test("chat message body is required",()=>assert.equal(require("./dto").message.body.required,true));
