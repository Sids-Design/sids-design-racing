// Cloudflare Pages Function: /api/contact
// Required Pages secret: RESEND_API_KEY. Verify sidsdesign.de as a sending domain in Resend.
// Optional: CONTACT_FROM_EMAIL (defaults to an address on the verified domain).
const reply=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff"}});
const clean=(value,max)=>typeof value==="string"?value.trim().slice(0,max):"";
const safeHtml=(value)=>value.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const allowedTypes={"image/png":"png","image/jpeg":"jpg","image/webp":"webp","application/pdf":"pdf"};
const base64=(bytes)=>{let result="";for(let i=0;i<bytes.length;i+=8192)result+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(result);};
export async function onRequestPost({request,env}){
 if(!["sidsdesign.de","www.sidsdesign.de"].includes(new URL(request.url).hostname))return reply({error:"Ungültige Website."},403);
 const origin=request.headers.get("origin");
 if(origin && !["https://sidsdesign.de","https://www.sidsdesign.de"].includes(origin))return reply({error:"Ungültige Herkunft."},403);
 const length=Number(request.headers.get("content-length")||0);
 if(length>3*1024*1024)return reply({error:"Die Anfrage ist zu groß (maximal 2 MB Dateianhang)."},413);
 let form;try{form=await request.formData();}catch{return reply({error:"Ungültige Formulardaten."},400);}
 if(clean(form.get("website"),200))return reply({ok:true});
 if(form.get("privacy")!=="on")return reply({error:"Bitte bestätige die Datenschutzhinweise."},400);
 const fields={name:clean(form.get("name"),120),email:clean(form.get("email"),254),projectType:clean(form.get("projectType"),80),car:clean(form.get("car"),120),colors:clean(form.get("colors"),160),details:clean(form.get("details"),240),message:clean(form.get("message"),4000)};
 if(!fields.name||!/^\S+@\S+\.\S+$/.test(fields.email)||!["Neue GT3-Livery","Bestehende Livery überarbeiten","Teamdesign / Branding","Sonstiges Designprojekt"].includes(fields.projectType)||fields.message.length<15)return reply({error:"Bitte prüfe die Pflichtfelder und deine E-Mail-Adresse."},400);
 if(!env.RESEND_API_KEY)return reply({error:"Das Kontaktformular wird noch eingerichtet. Bitte schreibe vorerst an kontakt@sidsdesign.de."},503);
 const attachment=form.get("attachment");
 let attachments;
 if(attachment && typeof attachment==="object" && attachment.size){
  if(attachment.size>2*1024*1024||!allowedTypes[attachment.type])return reply({error:"Nur PNG, JPG, WebP oder PDF bis 2 MB sind erlaubt."},400);
  const filename=String(attachment.name||"vorlage").replace(/[^a-zA-Z0-9._-]/g,"_").slice(0,90);
  attachments=[{filename,content:base64(new Uint8Array(await attachment.arrayBuffer()))}];
 }
 const lines=[["Name",fields.name],["E-Mail",fields.email],["Projektart",fields.projectType],["Fahrzeug",fields.car],["Wunschfarben",fields.colors],["Startnummer / Sponsoren",fields.details],["Designidee",fields.message]];
 const payload={from:env.CONTACT_FROM_EMAIL||"Sids Design Garage <anfragen@sidsdesign.de>",to:["kontakt@sidsdesign.de"],reply_to:fields.email,subject:"Neue Designanfrage: "+fields.projectType,html:'<h2>Neue Projektanfrage – Sids Design Garage</h2>'+lines.map(([label,value])=>'<p><strong>'+safeHtml(label)+':</strong><br>'+safeHtml(value||"–").replace(/\n/g,"<br>")+'</p>').join(""),text:lines.map(([label,value])=>label+": "+(value||"–")).join("\n\n"),...(attachments?{attachments}:{})};
 try{
  const res=await fetch("https://api.resend.com/emails",{method:"POST",headers:{"Authorization":"Bearer "+env.RESEND_API_KEY,"Content-Type":"application/json"},body:JSON.stringify(payload)});
  if(!res.ok){console.error("Resend delivery failed",res.status);return reply({error:"Der Versand ist derzeit nicht möglich. Bitte schreibe direkt an kontakt@sidsdesign.de."},502);}
  return reply({ok:true});
 }catch(error){console.error("Contact send error",String(error));return reply({error:"Der Versand ist derzeit nicht möglich. Bitte schreibe direkt an kontakt@sidsdesign.de."},502);}
}
export function onRequestGet(){return reply({error:"Methode nicht erlaubt."},405);}
