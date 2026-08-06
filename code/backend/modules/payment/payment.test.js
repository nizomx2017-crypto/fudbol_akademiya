const{test}=require("node:test"),assert=require("node:assert/strict");test("payment accepts terminal statuses",()=>assert.ok(require("./dto").webhook.status.oneOf.includes("paid")));
