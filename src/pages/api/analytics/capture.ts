import type { APIRoute } from "astro";
import { sql } from "@vercel/postgres";
import { geolocation } from "@vercel/edge";

export const prerender = false;
export const runtime = "edge";

export const POST: APIRoute = async ({ request }) => {
  const date = new Date();
  const { slug } = await new Response(request.body).json();
  const { flag, country, city, latitude, longitude } = geolocation(request);

  if (!(flag && country && city && latitude && longitude && slug))
    return Response.json({ message: "Missing required parameters" });

  await sql`INSERT INTO analytics(date, slug, flag, country, city, latitude, longitude) VALUES(${date.toISOString()}, ${slug}, ${flag}, ${country}, ${city.replace(
    /[^a-zA-Z ]/g,
    " ",
  )}, ${latitude}, ${longitude})`;

  return Response.json({ message: "OK" });
};
