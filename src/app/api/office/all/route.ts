import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/options";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  const accessToken = session.access_token;

  const dataFetch = await fetch(`${process.env.API_URL}/office/all`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const resp = await dataFetch.json();
  return Response.json({ data: resp });
}
