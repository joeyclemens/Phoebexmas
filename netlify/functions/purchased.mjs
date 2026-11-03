import { getStore } from "@netlify/blobs";

// One blob per purchased item: key = item id. Presence of the key = "purchased".
// Per-item keys mean two people ticking things at the same time can't overwrite each other.

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

function codeOk(supplied) {
  const expected = Netlify.env.get("GIFT_CODE");
  if (!expected || typeof supplied !== "string") return false;
  if (supplied.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= supplied.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

export default async (req) => {
  const store = getStore({ name: "christmas-purchased", consistency: "strong" });

  if (req.method === "GET") {
    const code = new URL(req.url).searchParams.get("code");
    if (!codeOk(code)) return json({ error: "unauthorised" }, 401);
    const { blobs } = await store.list();
    return json({ purchased: blobs.map((b) => b.key) });
  }

  if (req.method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch {
      return json({ error: "bad request" }, 400);
    }
    if (!codeOk(body.code)) return json({ error: "unauthorised" }, 401);

    const id = body.id;
    if (typeof id !== "string" || !/^[a-z0-9]{1,16}$/.test(id)) {
      return json({ error: "bad id" }, 400);
    }

    if (body.purchased) {
      await store.set(id, new Date().toISOString());
    } else {
      await store.delete(id);
    }
    return json({ ok: true });
  }

  return json({ error: "method not allowed" }, 405);
};

export const config = { path: "/api/purchased" };
