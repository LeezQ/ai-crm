const apiOrigin =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_SERVER_ORIGIN ||
  "http://localhost:3001";

export const maxDuration = 30;

export async function POST(req: Request) {
  const body = await req.text();
  const authorization = req.headers.get("authorization") ?? "";
  const teamId = req.headers.get("teamid") ?? req.headers.get("TeamId") ?? "";

  const response = await fetch(`${apiOrigin.replace(/\/$/, "")}/api/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization,
      teamId,
    },
    body,
  });

  const headers = new Headers(response.headers);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
