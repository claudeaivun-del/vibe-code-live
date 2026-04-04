import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GEMINI_URL = "https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate";

const HEADERS: Record<string, string> = {
  "accept": "*/*",
  "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
  "x-same-domain": "1",
  "cookie": "",
};

function buildPayload(prompt: string): string {
  const inner = [
    [prompt, 0, null, null, null, null, 0],
    ["en-US"],
    ["", "", "", null, null, null, null, null, null, ""],
    "", "", null, [0], 1, null, null, 1, 0,
    null, null, null, null, null, [[0]], 0,
  ];
  const outer = [null, JSON.stringify(inner)];
  const params = new URLSearchParams();
  params.set("f.req", JSON.stringify(outer));
  return params.toString() + "&";
}

function parseResponse(text: string): string {
  text = text.replace(")]}'", "");
  let best = "";

  for (const line of text.split("\n")) {
    if (!line.includes("wrb.fr")) continue;
    let data: unknown;
    try {
      data = JSON.parse(line);
    } catch {
      continue;
    }

    let entries: unknown[][] = [];
    if (Array.isArray(data)) {
      if (data[0] === "wrb.fr") {
        entries = [data];
      } else {
        entries = data.filter((i: unknown) => Array.isArray(i) && (i as unknown[])[0] === "wrb.fr");
      }
    }

    for (const entry of entries) {
      try {
        const inner = JSON.parse(entry[2] as string);
        if (Array.isArray(inner) && Array.isArray(inner[4])) {
          for (const c of inner[4]) {
            if (Array.isArray(c) && Array.isArray(c[1])) {
              const txt = c[1].filter((t: unknown) => typeof t === "string").join("");
              if (txt.length > best.length) {
                best = txt;
              }
            }
          }
        }
      } catch {
        continue;
      }
    }
  }

  return best.trim();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "Missing message" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = buildPayload(message);
    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: HEADERS,
      body: payload,
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ error: `Gemini error: ${res.status}` }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const text = await res.text();
    const reply = parseResponse(text) || "لم أتمكن من الحصول على رد. حاول مرة أخرى.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("gemini-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
