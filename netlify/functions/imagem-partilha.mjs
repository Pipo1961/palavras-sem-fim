import {getPost} from './comum.mjs';
export default async req=>{
 const id=new URL(req.url).searchParams.get('id')||'';
 let post;try{post=await getPost(id)}catch(e){return new Response('Erro ao consultar imagem',{status:503})}
 if(!post?.fotografia)return new Response('Imagem não encontrada',{status:404});
 const data=post.fotografia;
 if(/^https:\/\//.test(data))return Response.redirect(data,302);
 const match=/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(data);
 if(!match)return new Response('Formato de imagem não suportado',{status:415});
 const bytes=Uint8Array.from(atob(match[2]),c=>c.charCodeAt(0));
 return new Response(bytes,{headers:{'content-type':match[1],'cache-control':'public, max-age=3600'}});
};
