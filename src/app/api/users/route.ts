import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const resp = await fetch(`${process.env.API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const respData = await resp.json()
  return Response.json(respData, {
    status: resp.status
  })
}
