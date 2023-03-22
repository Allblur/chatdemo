import type { APIRoute } from "astro"

export const post: APIRoute = async context => {
  const body = await context.request.json()
  console.log("request body === ", body)
  return new Response("test")
}
