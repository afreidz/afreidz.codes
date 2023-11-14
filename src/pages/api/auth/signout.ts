import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete("access-token", { path: "/" });
  return redirect("/admin/signin");
};
