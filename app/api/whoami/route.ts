import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  return Response.json({
    ok: true,
    host: req.headers.get("host"),
    url: req.nextUrl.toString(),
    commit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    env: process.env.VERCEL_ENV ?? null,
  });
}
