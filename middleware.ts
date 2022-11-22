import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getProgressivelyData } from "@progressively/server-side";

const PROGRESSIVELY_URL = "https://backend-progressively.fly.dev";
const PROGRESSIVELY_ENV = "096d81d3-bdde-4a8f-8d0c-ef1d4b4b2672";
const ExperimentRoutes = {
  A: "/",
  B: "/b",
  C: "/c",
};

type ExperimentRoutesKeys = keyof typeof ExperimentRoutes;

export default async function middleware(request: NextRequest) {
  const id = request.cookies.get("progressively-id");

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

  let nextRawUrl =
    ExperimentRoutes[initialFlags.newHero as ExperimentRoutesKeys] ||
    ExperimentRoutes.A;

  const nextUrl = NextResponse.rewrite(new URL(nextRawUrl, request.url));
  nextUrl.cookies.set("progressively-id", progressivelyId);

  return nextUrl;
}

export const config = {
  matcher: ["/"],
};
