import type { APIRoute } from "astro";
import { sql } from "@vercel/postgres";

export const prerender = false;
export const runtime = "edge";

export const GET: APIRoute = async () => {
  const { rows } = await sql`SELECT *
FROM analytics
WHERE date >= CURRENT_DATE - INTERVAL '30 days';`;
  const visits = rows;

  return Response.json({ visits });
};
