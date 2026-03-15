export function GET() {
  return new Response("Signup endpoint", {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
