export function GET() {
  return new Response("Send message endpoint", {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
