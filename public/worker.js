export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return json({
        ok: true,
        service: "purpo-homepage-cms",
        version: "2.0",
        r2Bound: !!env.PURPO_MEDIA
      });
    }

    // V2.0 foundation only. Upload activates after PURPO_MEDIA is bound.
    if (url.pathname === "/api/upload") {
      if (request.method !== "POST") {
        return json({ ok:false, error:"Method not allowed" }, 405);
      }
      if (!env.PURPO_MEDIA) {
        return json({
          ok:false,
          error:"PURPO_MEDIA R2 binding is not configured yet."
        }, 503);
      }

      const form = await request.formData();
      const file = form.get("file");
      if (!file || typeof file === "string") {
        return json({ ok:false, error:"Missing file" }, 400);
      }

      const safe = (file.name || "upload")
        .replace(/[^a-zA-Z0-9._-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      const key = `homepage/${stamp}-${crypto.randomUUID()}-${safe}`;

      await env.PURPO_MEDIA.put(key, file.stream(), {
        httpMetadata: { contentType: file.type || "application/octet-stream" }
      });

      return json({
        ok:true,
        key,
        url:`https://media.purpo.ph/${key}`
      });
    }

    return env.ASSETS.fetch(request);
  }
};

function json(data, status=200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type":"application/json; charset=utf-8",
      "cache-control":"no-store"
    }
  });
}
