
const SUPABASE_URL = 'https://dvvopyrhfvwisolzuatz.supabase.co';

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;',
    '"': '&quot;', "'": '&#39;'
  })[c]);
}

export async function onRequestGet({ params, env }) {
  const id = params.id;
  if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
    return new Response('ID inválido', { status: 400 });
  }

  const key = env.SUPABASE_PUBLISHABLE_KEY;
  if (!key) {
    return new Response('Chave não configurada', { status: 500 });
  }

  const api = SUPABASE_URL + '/rest/v1/textos?id=eq.' +
    encodeURIComponent(id) +
    '&select=id,titulo,conteudo,fotografia&limit=1';

  let post;
  try {
    const r = await fetch(api, {
      headers: { apikey: key }
    });
    if (!r.ok) throw new Error('Supabase HTTP ' + r.status);
    post = (await r.json())[0];
  } catch {
    return new Response('Erro ao consultar o texto', { status: 502 });
  }

  if (!post) {
    return new Response('Texto não encontrado', { status: 404 });
  }

  const origin = 'https://palavras-sem-fim.pages.dev';
  const canonical = origin + '/partilhar/' + encodeURIComponent(id);
  const destination = origin + '/#texto-' + encodeURIComponent(id);
  const title = String(post.titulo || 'Palavras Sem Fim');
  const description = String(post.conteudo || '')
    .replace(/\s+/g, ' ').slice(0, 190);

const photo = post.fotografia || '';
const image = photo ? origin + '/imagem-partilha/' + encodeURIComponent(id) : '';
  

  const html = `<!doctype html>
<html lang="pt-PT">
<head>
<meta charset="utf-8">
<title>${esc(title)} — Palavras Sem Fim</title>
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
${image ? `<meta property="og:image" content="${esc(image)}">` : ''}
<meta name="twitter:card" content="summary_large_image">

<link rel="canonical" href="${esc(canonical)}">
</head>
<body>
<p>A abrir a publicação...</p>
<a href="${esc(destination)}">Ler publicação</a>
<script>
  window.location.replace(${JSON.stringify(destination)});
</script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'content-type': 'text/html; charset=utf-8' }
  });
}

