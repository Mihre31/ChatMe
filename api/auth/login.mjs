export function GET() {
  return new Response("Login endpoint", {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
