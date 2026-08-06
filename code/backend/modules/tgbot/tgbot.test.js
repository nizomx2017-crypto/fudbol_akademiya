const{test}=require("node:test"),assert=require("node:assert/strict");test("Telegram service exposes webhook handler",()=>assert.equal(typeof require("./service").handle,"function"));
