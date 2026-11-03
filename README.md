# Christmas list

Static page (`public/index.html`) plus one Netlify Function (`netlify/functions/purchased.mjs`)
that stores "purchased" ticks in Netlify Blobs.

## Deploy
1. Push this folder to a GitHub repo and import it in Netlify (or use `netlify deploy --prod` with the Netlify CLI).
   Functions need a Git or CLI deploy; Netlify Drop (drag and drop) won't install the function's dependency.
2. In Netlify: Site configuration > Environment variables > add `GIFT_CODE` with a secret word, e.g. `holly-berry-42`.
3. Trigger a redeploy so the function picks the variable up.

## Using it
- Share the plain link with the family and your daughter. They see the normal list.
- You (and anyone buying) open the link once as `https://YOUR-SITE.netlify.app/?code=holly-berry-42`.
  That browser remembers the code, and each card gets a "Mark as purchased" button.
  Ticks are saved on Netlify, so they show on every device you use the code on.
- Without the code the page never shows what has been bought, so there are no spoilers.

## Changing the list
Edit the `sections` array near the bottom of `public/index.html`. Ticks are tied to each item's link,
so changing the wording of an item keeps its tick, but changing its URL resets it.
