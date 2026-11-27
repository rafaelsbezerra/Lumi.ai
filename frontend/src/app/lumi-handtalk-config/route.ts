export const dynamic = "force-dynamic";

export function GET() {
  const token = process.env.HANDTALK_TOKEN ?? "";
  const script = `window.LUMI_HANDTALK_TOKEN = ${JSON.stringify(token)};`;

  return new Response(script, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
