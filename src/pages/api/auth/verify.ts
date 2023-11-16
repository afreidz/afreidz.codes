import jwt from "jsonwebtoken";
import type { APIRoute } from "astro";

export const prerender = false;
export const runtime = "edge";

export const GET: APIRoute = async ({ request }) => {
  let token =
    request.headers.get("x-access-token") ||
    request.headers.get("authorization");

  if (token?.startsWith("Bearer ")) token = token.replace("Bearer ", "");

  if (!token) return new Response("Authentication failed", { status: 400 });

  try {
    jwt.verify(token, import.meta.env.JWT_SECRET);
  } catch (e) {
    return new Response("Authentication failed", { status: 400 });
  }

  return new Response("Token is valid", { status: 200 });
};
