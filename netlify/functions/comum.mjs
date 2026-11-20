const SUPABASE_URL='https://dvvopyrhfvwisolzuatz.supabase.co';
const SUPABASE_KEY='sb_publishable_AFDHqlSdScinDB0UwGnS_Q_OlV4kh-Z";
export async function getPost(id){
 if(!/^[0-9a-fA-F-]{8,64}$/.test(id))return null;
 const url=SUPABASE_URL+'/rest/v1/textos?id=eq.'+encodeURIComponent(id)+'&select=id,titulo,conteudo,fotografia&limit=1';
 const r=await fetch(url,{headers:{apikey:SUPABASE_KEY,Authorization:'Bearer '+SUPABASE_KEY}});
 if(!r.ok)throw Error('Supabase HTTP '+r.status);
 const rows=await r.json();return rows[0]||null;
}
