import {describe,it,expect} from 'vitest';
import {contactSchema,detailsSchema,leadSchema} from '@/lib/lead-schema';
const base={profile:'investidor',name:'Test',email:'test@example.com',whatsapp:'+5511999999999',company:'',fields:{countries:['Argentina'],capital:'< US$ 500.000',purpose:'Produção'},language:'pt',utm:{},consent:true,website:''};
describe('Sueloss profile rules',()=>{
 it('requires LGPD consent for every submission',()=>{expect(leadSchema.safeParse({...base,consent:false}).success).toBe(false)});
 it('requires investor country, capital and purpose',()=>{for(const key of ['countries','capital','purpose']){expect(detailsSchema.safeParse({profile:'investidor',fields:{...base.fields,[key]:''}}).success).toBe(false)}});
 it('accepts the six priority countries and Outro',()=>{expect(leadSchema.safeParse({...base,fields:{...base.fields,countries:['Argentina','Uruguai','Paraguai','Bolívia','Guiana','Suriname','Outro']}}).success).toBe(true);expect(leadSchema.safeParse({...base,fields:{...base.fields,countries:['France']}}).success).toBe(false)});
 it('requires owner location documentation production and positive area',()=>{const fields={country:'Uruguay',region:'Colonia',municipality:'Carmelo',documentation:'Sim',production:'Ativa',area:'100'};expect(detailsSchema.safeParse({profile:'proprietario',fields}).success).toBe(true);for(const key of Object.keys(fields))expect(detailsSchema.safeParse({profile:'proprietario',fields:{...fields,[key]:''}}).success).toBe(false);expect(detailsSchema.safeParse({profile:'proprietario',fields:{...fields,area:'-1'}}).success).toBe(false)});
 it('requires partner commission-model consent',()=>{expect(detailsSchema.safeParse({profile:'parceiro',fields:{region:'Uruguay',partnerType:'Agrimensor',portfolio:'Active',commission:false}}).success).toBe(false)});
 it('requires institutional mandate ticket and history',()=>{for(const key of ['mandate','ticket','history'])expect(detailsSchema.safeParse({profile:'institucional',fields:{mandate:'LATAM',ticket:'1000000',history:'Agro',[key]:''}}).success).toBe(false)});
 it('requires country calling code for WhatsApp',()=>{expect(contactSchema.safeParse({...base,whatsapp:'11999999999'}).success).toBe(false);expect(contactSchema.safeParse(base).success).toBe(true)});
 it('rejects invalid email and filled honeypot',()=>{expect(leadSchema.safeParse({...base,email:'bad'}).success).toBe(false);expect(leadSchema.safeParse({...base,website:'spam'}).success).toBe(false)});
});
