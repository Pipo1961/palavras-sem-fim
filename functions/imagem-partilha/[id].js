const SUPABASE_URL = 'https://dvvopyrhfvwisolzuatz.supabase.co';

export async function onRequestGet({ params, env }) {
  const id = params.id;

  if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
    return new Response('ID inválido', { status: 400 });
  }

  const key = env.SUPABASE_PUBLISHABLE_KEY;

  if (!key) {
    return new Response('Chave não configurada', { status: 500 });
  }

  try {
    const url = SUPABASE_URL +
      '/rest/v1/textos?id=eq.' +
      encodeURIComponent(id) +
      '&select=fotografia&limit=1';

    const resposta = await fetch(url, {
      headers: { apikey: key }
    });

    if (!resposta.ok) {
      return new Response('Erro ao obter fotografia', { status: 502 });
    }

    const dados = await resposta.json();
    const fotografia = dados[0]?.fotografia;

    if (!fotografia) {
      return new Response('Fotografia não encontrada', { status: 404 });
    }

    if (fotografia.startsWith('https://')) {
      return Response.redirect(fotografia, 302);
    }

    const resultado = fotografia.match(
      /^data:(image\/(?:jpeg|png|webp|gif));base64,([\s\S]+)$/
    );

    if (!resultado) {
      return new Response('Formato de fotografia inválido', { status: 415 });
    }

    const tipo = resultado[1];
    const binario = atob(resultado[2].replace(/\s/g, ''));
    const bytes = new Uint8Array(binario.length);

    for (let i = 0; i < binario.length; i++) {
      bytes[i] = binario.charCodeAt(i);
    }

    return new Response(bytes, {
      headers: {
        'Content-Type': tipo,
        'Cache-Control': 'public, max-age=3600'
      }
    });

  } catch {
    return new Response('Erro ao carregar fotografia', { status: 500 });
  }
}
