# PURPO Homepage CMS V2.1 — R2 media uploads

The V1.8 editor layout and controls remain in place. Choosing an image or video now uploads it to R2 and stores its permanent `media.purpo.ph` URL in the local browser draft. The homepage still reads `public/content/home.json`; saving a browser draft does not publish it. To publish content, export `home.json` from the editor and update `public/content/home.json` in the repository.

## Configure before deployment

1. Keep the `PURPO_MEDIA` R2 binding in `wrangler.jsonc`, pointing to the bucket delivered at `media.purpo.ph`.
2. Set a strong, random Worker secret named `CMS_UPLOAD_TOKEN` in Cloudflare Worker settings (Variables and Secrets). Use the **Secret** type. Do not commit its value to GitHub or enter it in `wrangler.jsonc`.
3. Deploy the Worker. When first choosing a media file in `/admin/`, enter the token in the prompt. The editor keeps it in memory only until the tab closes. An invalid token prompts again on the next attempt.
4. Export a draft and inspect the JSON before publishing. Its new media URLs should begin with `https://media.purpo.ph/cms/`.

The legacy `/api/upload-test` endpoint is retired. `/api/upload` rejects requests if the secret is missing or the token is wrong. It accepts JPEG, PNG, WebP, GIF, AVIF, MP4, and WebM files up to 50 MB each. R2 media is publicly readable once uploaded; avoid uploading private content.

This is a temporary single-editor token for the upload phase. Authentication for the entire editor and persistent draft/published content are later CMS steps. The `/admin/` page itself is still publicly viewable.
