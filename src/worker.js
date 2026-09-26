const MEDIA_ORIGIN="https://media.purpo.ph";
export default{async fetch(request,env){
 const url=new URL(request.url);
 if(url.pathname==="/api/health")return Response.json({ok:true,service:"PURPO CMS API",version:"2.0B",r2Bound:!!env.PURPO_MEDIA},{headers:{"cache-control":"no-store"}});
 if(url.pathname==="/api/upload-test"){
  if(request.method!=="POST")return Response.json({ok:false,error:"Method not allowed"},{status:405});
  if(!env.PURPO_MEDIA)return Response.json({ok:false,error:"PURPO_MEDIA binding is missing"},{status:503});
  try{
   const form=await request.formData(),file=form.get("file");
   if(!file||typeof file==="string")return Response.json({ok:false,error:"No file received"},{status:400});
   const original=(file.name||"upload").replace(/[^a-zA-Z0-9._-]+/g,"-");
   const ext=original.includes(".")?"."+original.split(".").pop().toLowerCase():"";
   const key=`cms-upload-test/${Date.now()}-${crypto.randomUUID()}${ext}`;
   await env.PURPO_MEDIA.put(key,file.stream(),{httpMetadata:{contentType:file.type||"application/octet-stream",cacheControl:"public, max-age=31536000, immutable"},customMetadata:{originalName:original}});
   return Response.json({ok:true,key,url:`${MEDIA_ORIGIN}/${key}`,type:file.type||"application/octet-stream",size:file.size},{headers:{"cache-control":"no-store"}});
  }catch(error){return Response.json({ok:false,error:String(error?.message||error)},{status:500})}
 }
 return env.ASSETS.fetch(request);
}};