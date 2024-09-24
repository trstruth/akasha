// https://nextjs.org/docs/app/building-your-application/routing/route-handlers

export async function GET() {
    return Response.json({ "version": "0.1.0" });
}