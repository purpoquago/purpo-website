const MEDIA_ORIGIN = "https://media.purpo.ph";
const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;
const MIME_TYPES = new Map([
  ["image/jpeg", "jpg"], ["image/png", "png"], ["image/webp", "webp"],
  ["image/gif", "gif"], ["image/avif", "avif"],
  ["video/mp4", "mp4"], ["video/webm", "webm"],
]);

function json(body, status = 200) {
  return Response.json(body, { status, headers: { "cache-control": "no-store" } });
}

function validToken(request, secret) {
  if (!secret || typeof secret !== "string") return false;
  const supplied = request.headers.get("authorization") || "";
  const expected = `Bearer ${secret}`;
  if (supplied.length !== expected.length) return false;
  let difference = 0;
  for (let i = 0; i < expected.length; i++) difference |= supplied.charCodeAt(i) ^ expected.charCodeAt(i);
  return difference === 0;
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/health") return json({ ok: true, service: "PURPO CMS API", version: "2.1", r2Bound: !!env.PURPO_MEDIA });
    if (pathname === "/api/upload-test") return json({ ok: false, error: "Test endpoint retired" }, 404);
    if (pathname !== "/api/upload") return env.ASSETS.fetch(request);
    if (request.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405);
    if (!validToken(request, env.CMS_UPLOAD_TOKEN)) return json({ ok: false, error: "Upload authorization required" }, 401);
    if (!env.PURPO_MEDIA) return json({ ok: false, error: "PURPO_MEDIA binding is missing" }, 503);
    const length = Number(request.headers.get("content-length"));
    if (length > MAX_UPLOAD_BYTES + 1024 * 1024) return json({ ok: false, error: "File exceeds 50 MB" }, 413);
    try {
      const form = await request.formData();
      const file = form.get("file");
      if (!file || typeof file === "string") return json({ ok: false, error: "No file received" }, 400);
      if (file.size > MAX_UPLOAD_BYTES) return json({ ok: false, error: "File exceeds 50 MB" }, 413);
      const extension = MIME_TYPES.get(file.type);
      if (!extension) return json({ ok: false, error: "Unsupported image or video format" }, 415);
      const key = `cms/${crypto.randomUUID()}.${extension}`;
      await env.PURPO_MEDIA.put(key, file.stream(), {
        httpMetadata: { contentType: file.type, cacheControl: "public, max-age=31536000, immutable" },
      });
      return json({ ok: true, key, url: `${MEDIA_ORIGIN}/${key}`, type: file.type, size: file.size });
    } catch (error) {
      console.error("CMS upload failed", error);
      return json({ ok: false, error: "Upload failed" }, 500);
    }
  },
};
