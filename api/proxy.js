const ALLOWED = new Set([
"/api/ai/kyzzneko","/api/ai/chatgpt","/api/ai/gptanon","/api/ai/copilot-think","/api/ai/microsoft","/api/ai/glm","/api/ai/unlimited","/api/ai/google","/api/ai/qwen","/api/ai/deepseek","/api/ai/cici","/api/ai/gemini","/api/ai/gemini-lite","/api/ai/vanice","/api/ai/gpt5",
"/api/anime/quotes","/api/anime/otakudesu","/api/anime/animekita/anime-list","/api/anime/animekita/movie","/api/anime/animekita/schedule","/api/anime/animekita/new","/api/anime/animekita/genre","/api/anime/animekita/search","/api/anime/animekita/detail","/api/anime/animekita/episode","/api/anime/v2/anichin/search","/api/anime/v2/anichin/popular","/api/anime/v2/anichin/latest","/api/anime/v2/anichin/detail","/api/anime/v2/anichin/episode","/api/anime/v2/anichin/download","/api/anime/v2/otakudesu/ongoing","/api/anime/v2/otakudesu/search","/api/anime/v2/otakudesu/detail","/api/anime/v2/otakudesu/download","/api/anime/v2/oploverz/ongoing","/api/anime/v2/oploverz/search","/api/anime/v2/oploverz/episode","/api/anime/v2/oploverz/download","/api/anime/v2/komikindo/ongoing","/api/anime/v2/komikindo/search","/api/anime/v2/komikindo/detail","/api/anime/v2/komikindo/download","/api/anime/v2/samehadaku/latest","/api/anime/v2/samehadaku/release","/api/anime/v2/samehadaku/search","/api/anime/v2/samehadaku/detail","/api/anime/v2/samehadaku/episode","/api/anime/v2/samehadaku/download",
"/api/image/uhd","/api/image/brat","/api/maker/balogo","/api/image/codesnap","/api/image/bratv","/api/image/iqc","/api/image/story-ig","/api/image/sertifikat","/api/image/quoteimg","/api/canvas/fakewa","/api/canvas/fakecall","/api/canvas/fake-ovo",
"/api/about","/api/cdn/crcdn","/api/cdn/logsadm","/api/admin/listapi","/api/assets/key",
"/api/tools/getpp","/api/tools/ip","/api/tools/osint","/api/tools/sc_ml","/api/tools/tmail/inbox","/api/tools/tmail/v2/create","/api/tools/tmail/v2/inbox","/api/tools/rbg","/api/tools/snapotp","/api/tools/removevokal","/api/tools/v2/ssweb","/api/tools/ssweb","/api/tools/tempmailv2","/api/tools/obfuscate","/api/tools/v2/qr",
"/api/alightmotion/download","/api/alightmotion/v4/init","/api/alightmotion/v3/magic-link","/api/alightmotion/v1/magic-link","/api/alightmotion/v2/magic-link"
]);

export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"POST only"});
  const {endpoint,method="GET",params={}}=req.body||{};
  if(!ALLOWED.has(endpoint)) return res.status(403).json({error:"Endpoint tidak diizinkan"});
  if(method!=="GET") return res.status(405).json({error:"Method tidak diizinkan"});
  const base=process.env.KYZZ_API_BASE||"https://api.kyzznekoo.my.id";
  const key=process.env.KYZZ_API_KEY;
  const url=new URL(endpoint,base);
  for(const [k,v] of Object.entries(params)){
    if(v!==undefined && v!==null) url.searchParams.set(k,typeof v==="string"?v:JSON.stringify(v));
  }
  const headers={Accept:"application/json"};
  if(key){headers.Authorization=`Bearer ${key}`;headers["x-api-key"]=key;}
  try{
    const upstream=await fetch(url,{method:"GET",headers});
    const contentType=upstream.headers.get("content-type")||"";
    const body=await upstream.text();
    res.status(upstream.status);
    res.setHeader("content-type",contentType.includes("json")?"application/json; charset=utf-8":"text/plain; charset=utf-8");
    return res.send(body);
  }catch(e){return res.status(502).json({error:"Upstream gagal",detail:String(e.message||e)})}
}
