# PURPO Homepage CMS V2.0 — Backend Foundation

This build preserves the V1.8 editor and adds a Cloudflare Worker entry point.

## Files added
- `worker.js` — serves the existing static site and provides `/api/health` + `/api/upload`
- `wrangler.toml` — Worker/static-assets configuration

## First deployment
Commit the files to the same GitHub repo and let Cloudflare deploy.

After the deployment succeeds:
1. Open the PURPO Worker in Cloudflare.
2. Go to Settings → Bindings.
3. Add an R2 bucket binding.
4. Variable name: `PURPO_MEDIA`
5. Select the R2 bucket behind `media.purpo.ph`.
6. Save/deploy the binding.

`/api/health` should then report `"r2Bound": true`.

The upload endpoint is already implemented, but the V2.0 CMS intentionally continues
using the proven V1.8 local media workflow until the binding is confirmed. The next
patch can switch Choose/Replace to `/api/upload`.
