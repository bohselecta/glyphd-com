type KV={incr:(key:string,ttlSec:number)=>Promise<number>}
const memory=new Map<string,{count:number,exp:number}>()
const memoryKV:KV={async incr(key,ttlSec){const now=Date.now();const it=memory.get(key);if(!it||it.exp<now){memory.set(key,{count:1,exp:now+ttlSec*1000});return 1}else{it.count+=1;return it.count}}}
export async function limit(key:string,windowSec:number,max:number,kv:KV=memoryKV){const count=await kv.incr(key,windowSec);return count<=max}
