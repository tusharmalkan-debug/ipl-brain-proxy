export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
 
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
 
  const { target, endpoint, apikey, key } = req.query;
 
  try {
    let url, opts = {};
 
    if (target === 'cricket') {
      url = `https://api.cricapi.com/v1/${endpoint}?apikey=${apikey}&offset=0`;
      opts = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      };
 
    } else if (target === 'gemini') {
      url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-04-17:generateContent?key=${key}`;
 
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
      }
      const rawBody = Buffer.concat(chunks).toString('utf-8');
 
      opts = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: rawBody,
      };
 
    } else {
      res.status(400).json({ error: 'Unknown target: ' + target });
      return;
    }
 
    const r = await fetch(url, opts);
    const d = await r.json();
    res.status(200).json(d);
 
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
