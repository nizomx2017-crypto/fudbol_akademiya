const{test}=require("node:test"),assert=require("node:assert/strict");test("user DTO requires credentials",()=>assert.equal(require("./dto").login.password.required,true));
