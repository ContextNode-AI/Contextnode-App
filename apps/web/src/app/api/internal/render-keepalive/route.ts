import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  // Step 1: Security verification with CRON_SECRET if configured
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
  }

  // Step 2: Target Backend URL configuration with /health endpoint
  const baseUrl = (process.env.RENDER_BACKEND_URL || "https://your-backend.onrender.com").replace(/\/+$/, "");
  const targetUrl = baseUrl.endsWith("/health") ? baseUrl : `${baseUrl}/health`;

  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(10000), // 10-second timeout to avoid hung serverless functions
    });

    const durationMs = Date.now() - startTime;

    return NextResponse.json({
      status: response.ok ? "ok" : "error",
      timestamp,
      backendStatus: response.status,
      durationMs,
      targetUrl,
    });
  } catch (error: unknown) {
    const durationMs = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : "Request failed";

    return NextResponse.json(
      {
        status: "error",
        timestamp,
        backendStatus: 0,
        durationMs,
        targetUrl,
        error: errorMessage,
      },
      { status: 502 }
    );
  }
}

