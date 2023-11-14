import jwt from "jsonwebtoken";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const password = formData.get("password")?.toString();

  if (!password || password !== import.meta.env.ADMIN_PASSWORD) {
    return new Response("Authentication failed", { status: 400 });
  }

  const token = jwt.sign({ username: "afreidz" }, import.meta.env.JWT_SECRET, {
    expiresIn: "48h",
  });

  if (!token) {
    return new Response("Authentication failed", { status: 400 });
  }

  cookies.set("access-token", token, {
    path: "/",
  });

  return redirect("/admin/create");
};
