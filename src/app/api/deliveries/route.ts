import { getServerSession } from "next-auth";
import { authOptions } from "@/app/options";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  const accessToken = session.access_token;
  const dataFetch = await fetch(`${process.env.API_URL}/deliveries`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return Response.json({ data: await dataFetch.json() });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  const accessToken = session.access_token;

  const data: {
    name: string;
    phone: string;
    diary_value: number;
  } = await req.json();

  const dataFetch = await fetch(`${process.env.API_URL}/deliveries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  return Response.json({
    data: await dataFetch.json(),
  });
}
