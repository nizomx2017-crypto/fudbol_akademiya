const{test}=require("node:test"),assert=require("node:assert/strict");test("notification title is required",()=>assert.equal(require("./dto").title.required,true));
