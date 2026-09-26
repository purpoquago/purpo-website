export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Backend test endpoint
    if (url.pathname === "/api/health") {
      return Response.json({
        ok: true,
        service: "PURPO CMS API",
        version: "2.0A"
      });
    }

    // Everything else continues to use the existing website
    return env.ASSETS.fetch(request);
  }
};