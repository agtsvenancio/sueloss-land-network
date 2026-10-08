import { createServerFn } from '@tanstack/react-start';
import { getRequestHeader } from '@tanstack/react-start/server';
import { leadSchema } from './lead-schema';
export const submitLead=createServerFn({method:'POST'}).inputValidator((input:unknown)=>leadSchema.parse(input)).handler(async({data})=>{
 const ip=getRequestHeader('cf-connecting-ip')??getRequestHeader('x-forwarded-for')??'unknown';
 const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(ip));
 const fingerprint=Array.from(new Uint8Array(bytes)).map(v=>v.toString(16).padStart(2,'0')).join('');
 const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
 const {data:id,error}=await supabaseAdmin.rpc('submit_sueloss_lead',{payload:data,fingerprint});
 if(error) return {ok:false,id:null,error:error.message.includes('RATE_LIMIT')?'rate':'unavailable'};
 return {ok:true,id,error:null};
});
