import { z } from 'zod';
export const profiles=['investidor','proprietario','parceiro','institucional'] as const;
export type Profile=typeof profiles[number];
const value=z.union([z.string().trim().max(2000),z.boolean(),z.array(z.string().trim().max(100)).max(7)]);
export const detailsSchema=z.object({profile:z.enum(profiles),fields:z.record(z.string().max(40),value)}).superRefine(({profile,fields},ctx)=>{
 const required:Record<Profile,string[]>={investidor:['countries','capital','purpose'],proprietario:['country','region','municipality','documentation','production','area'],parceiro:['region','partnerType','portfolio','commission'],institucional:['mandate','ticket','history']};
 for(const key of required[profile]){const v=fields[key];if(v===undefined||v===false||v===''||(Array.isArray(v)&&v.length===0))ctx.addIssue({code:'custom',message:'required',path:['fields',key]});}
 if(profile==='proprietario'&&fields['area']&&(!Number.isFinite(Number(fields['area']))||Number(fields['area'])<=0))ctx.addIssue({code:'custom',message:'area',path:['fields','area']});
 if(profile==='investidor'&&Array.isArray(fields['countries'])&&fields['countries'].some(c=>!['Argentina','Uruguai','Paraguai','Bolívia','Guiana','Suriname','Outro'].includes(c)))ctx.addIssue({code:'custom',message:'country',path:['fields','countries']});
});
export const contactSchema=z.object({name:z.string().trim().min(1).max(100),email:z.string().trim().email().max(255),whatsapp:z.string().trim().regex(/^\+[1-9][0-9 ()-]{7,20}$/),company:z.string().trim().max(150),consent:z.literal(true)});
export const leadSchema=z.object({profile:z.enum([...profiles,'newsletter']),name:z.string().trim().min(1).max(100),email:z.string().trim().email().max(255),whatsapp:z.string().max(24),company:z.string().trim().max(150),fields:z.record(z.string().max(40),value),language:z.enum(['pt','en','es']),utm:z.record(z.string().max(30),z.string().max(200)).refine(v=>Object.keys(v).length<=8),consent:z.literal(true),website:z.string().max(0)}).superRefine((v,ctx)=>{if(v.profile==='newsletter')return;const a=detailsSchema.safeParse(v);const b=contactSchema.safeParse(v);for(const result of [a,b])if(!result.success)for(const issue of result.error.issues)ctx.addIssue(issue)});
export const newsletterSchema=z.object({email:z.string().trim().email().max(255),consent:z.literal(true)});
export type LeadInput=z.infer<typeof leadSchema>;
