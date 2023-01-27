import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getProgressivelyData } from "@progressively/server-side";
import { get } from "@vercel/edge-config";

type Config = {
  apiUrl: string;
  env: string;
};

export const createProgressivelyMiddleware =
  (config: Config) => async (request: NextRequest) => {
    const PROGRESSIVELY_URL = config.apiUrl;
    const PROGRESSIVELY_ENV = config.env;

    const id = request.cookies.get("progressively-id");
    const routes = await get("flags-config");

    const {
      data: { initialFlags },
      response,
    } = await getProgressivelyData(PROGRESSIVELY_ENV, {
      apiUrl: PROGRESSIVELY_URL,
      fields: {
        id: id?.value || "",
      },
    });

    const progressivelyId = response.headers.get("x-progressively-id");
    if (!progressivelyId) return;

    const nextRawUrl = routes[initialFlags.deploySection as any] || "/";
    const nextUrl = NextResponse.rewrite(new URL(nextRawUrl, request.url));
    nextUrl.cookies.set("progressively-id", progressivelyId);

    return nextUrl;
  };
