import jwt from "jsonwebtoken";
import type { APIRoute } from "astro";

export const prerender = false;
export const runtime = "edge";

export const POST: APIRoute = async ({ request, cookies }) => {
  let token = cookies.get("access-token")?.value;
  if (!token) return new Response("Authentication failed", { status: 400 });

  try {
    jwt.verify(token, import.meta.env.JWT_SECRET);
  } catch (e) {
    return new Response("Authentication failed", { status: 400 });
  }

  const { slug, content } = await request.json();

  console.log(slug, content);

  return new Response("Post created", { status: 200 });
};
