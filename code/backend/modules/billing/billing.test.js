const{test}=require("node:test"),assert=require("node:assert/strict");test("billing validates debit and credit",()=>assert.deepEqual(require("./dto").adjust.type.oneOf,["credit","debit"]));
