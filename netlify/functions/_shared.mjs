import { getStore } from '@netlify/blobs';
import seed from './seed.json' with { type: 'json' };
export const store = () => getStore({ name: 'nextlayer-isro-data', consistency: 'strong' });
export async function getData(){const s=store();let data=await s.get('app-data',{type:'json'});if(!data){data=structuredClone(seed);await s.setJSON('app-data',data)}return data}
export async function saveData(data){await store().setJSON('app-data',data)}
export function json(body,status=200,headers={}){return new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store',...headers}})}
export function corsHeaders(event){const origin=event.headers.origin||'';const allowed=(process.env.CORS_ORIGINS||process.env.URL||process.env.DEPLOY_PRIME_URL||'').split(',').map(x=>x.trim()).filter(Boolean);return {'access-control-allow-origin':allowed.includes(origin)?origin:(allowed[0]||origin||'*'),'access-control-allow-headers':'Content-Type, Authorization','access-control-allow-methods':'GET, POST, PUT, OPTIONS','vary':'Origin'}}
export async function body(event){try{return JSON.parse(event.body||'{}')}catch{return null}}
export function errorMessage(e){return e instanceof Error?e.message:'Unexpected server error'}
export async function requireAdmin(event){const auth=event.headers.authorization||'';const token=auth.startsWith('Bearer ')?auth.slice(7):'';if(!token||!process.env.JWT_SECRET)throw new Error('Admin session missing or JWT_SECRET is not configured.');const jwt=await import('jsonwebtoken');let payload;try{payload=jwt.default.verify(token,process.env.JWT_SECRET)}catch{throw new Error('Admin session is invalid or expired. Please sign in again.')}return {email:payload.email,role:payload.role||'admin'};}
export function requireMethod(event,method){if(event.httpMethod==='OPTIONS')return true;if(event.httpMethod!==method)throw new Error(`Method ${event.httpMethod} not allowed`);return false}
