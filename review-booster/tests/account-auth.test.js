import test from 'node:test'
import assert from 'node:assert/strict'
import {authenticate} from '../api/_lib/auth.js'
const res=()=>({code:200,setHeader(){},status(n){this.code=n;return this},json(body){this.body=body}})
function database({user=true,admin=false,members=['one','two']}={}) {
 return {auth:{getUser:async token=>token==='valid' && user?{data:{user:{id:'user'}}}:{error:{message:'invalid'}}},from(table){const q={select(){return q},eq(){return q},maybeSingle:async()=>({data:admin?{user_id:'user'}:null}),then(resolve){resolve({data:members.map(client_id=>({client_id}))})}};return q}}
}
test('named users are scoped to their memberships and cannot select another tenant',async()=>{
 const response=res()
 const auth=await authenticate({headers:{authorization:'Bearer valid'},query:{client_id:'two'}},response,database())
 assert.equal(auth.clientId,'two');assert.equal(auth.userId,'user')
 assert.equal(await authenticate({headers:{authorization:'Bearer valid'},query:{client_id:'other'}},response,database()),null)
 assert.equal(response.code,403)
})
test('invalid bearer cannot fall back to a shared master key',async()=>{
 const response=res()
 assert.equal(await authenticate({headers:{authorization:'Bearer invalid','x-admin-key':'anything'},query:{}},response,database()),null)
 assert.equal(response.code,401)
})
test('administrator permissions come from server-controlled membership, not request claims',async()=>{
 const response=res()
 assert.equal((await authenticate({headers:{authorization:'Bearer valid'},query:{}},response,database({admin:true}))).role,'master')
 assert.equal((await authenticate({headers:{authorization:'Bearer valid'},query:{role:'master'}},response,database())).role,'client')
})
