const{test}=require("node:test"),assert=require("node:assert/strict");test("health reports ok",()=>assert.equal(require("./service").health().status,"ok"));
