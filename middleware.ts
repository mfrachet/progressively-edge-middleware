import { createProgressivelyMiddleware } from "./createProgressivelyMiddleware";

export default createProgressivelyMiddleware({
  apiUrl: String(process.env.PROGRESSIVELY_API_URL),
  env: String(process.env.PROGRESSIVELY_ENV),
});

export const config = {
  matcher: ["/"],
};
