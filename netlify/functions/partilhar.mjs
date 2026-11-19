import {getPost} from './comum.mjs';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export default async (req)=>{
 const url=new URL(req.url),id=url.searchParams.get('id')||'';
 let post;try{post=await getPost(id)}catch(e){return new Response('Não foi possível consultar o texto.',{status:503})}
 if(!post)return new Response('Texto não encontrado.',{status:404});
 const origin='https://palavrasemfim.netlify.app';
 const canonical=origin+'/partilhar/'+encodeURIComponent(id);
 const dest=origin+'/#texto-'+encodeURIComponent(id);
 const title=String(post.titulo||'Palavras Sem Fim');
 const desc=String(post.conteudo||'').replace(/\s+/g,' ').slice(0,190);
 const photo=typeof post.fotografia==='string' && (post.fotografia.startsWith('data:image/')||post.fotografia.startsWith('https://'));
 const image=photo?(post.fotografia.startsWith('https://')?post.fotografia:origin+'/imagem-partilha/'+encodeURIComponent(id)):null;
 const tags=image?`<meta property="og:image" content="${esc(image)}"><meta name="twitter:card" content="summary_large_image">`:'<meta name="twitter:card" content="summary">';
 const html=`<!doctype html><html lang="pt-PT"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} — Palavras Sem Fim</title><meta name="description" content="${esc(desc)}"><meta property="og:type" content="article"><meta property="og:site_name" content="Palavras Sem Fim"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${esc(canonical)}">${tags}<meta http-equiv="refresh" content="0;url=${esc(dest)}"><link rel="canonical" href="${esc(canonical)}"></head><body><p>A abrir o texto «${esc(title)}»… <a href="${esc(dest)}">Ler o texto no blogue</a>.</p><script>location.replace(${JSON.stringify(dest)})</script></body></html>`;
 return new Response(html,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'public, max-age=300'}});
};
