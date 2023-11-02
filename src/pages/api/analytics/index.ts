import type { APIRoute } from "astro";
import { sql } from "@vercel/postgres";

export const prerender = false;
export const runtime = "edge";

export const GET: APIRoute = async () => {
  const { rows } = await sql`SELECT * FROM analytics;`;
  const visits = rows;

  return Response.json({ visits });
};
