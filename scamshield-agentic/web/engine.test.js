const test=require('node:test');
const assert=require('node:assert/strict');
const {validate,parseUrl,triage,checkUrl,investigate}=require('./engine');
test('validates supported input types and size',()=>{assert.equal(validate('sms','hello'),null);assert.ok(validate('fax','hello'));assert.ok(validate('sms','x'.repeat(5001)));});
test('parses URL without visiting it',()=>{assert.equal(parseUrl('https://example.com').hostname,'example.com');assert.equal(parseUrl('javascript:alert(1)'),null);});
test('detects OTP urgency patterns',()=>{const t=triage('sms','URGENT share your OTP immediately');assert.ok(t.findings.some(f=>f.id==='urgency'));assert.ok(t.findings.some(f=>f.id==='credential'));});
test('detects suspicious URL structure',()=>{const r=checkUrl('http://sbi-secure-login.xyz/kyc');assert.ok(r.flags.some(f=>f.id==='brand'));assert.ok(r.flags.some(f=>f.id==='tld'));});
test('investigation is explicit about unavailable LLM',async()=>{const old={key:process.env.LLM_API_KEY,allow:process.env.ALLOW_MESSAGE_TO_LLM};delete process.env.LLM_API_KEY;delete process.env.ALLOW_MESSAGE_TO_LLM;const r=await investigate({inputType:'sms',content:'Your account is blocked. Share your OTP now.'});assert.equal(r.agentStatus.llm,'unavailable');assert.ok(r.agentEvents.some(e=>e.tool==='planner-agent'));assert.ok(r.limitations.some(x=>x.includes('Low risk does not prove safety')));if(old.key!==undefined)process.env.LLM_API_KEY=old.key;if(old.allow!==undefined)process.env.ALLOW_MESSAGE_TO_LLM=old.allow;});
