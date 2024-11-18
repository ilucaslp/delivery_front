import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/options";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  const accessToken = session.access_token;

  const dataFetch = await fetch(`${process.env.API_URL}/office`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const resp = await dataFetch.json();
  return Response.json({ data: resp });
}

export async function PUT(req: Request) {
  const data: {
    opened?: number;
    price_tax_default?: number
    office_id: number;
  } = await req.json();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  const accessToken = session.access_token;

  const dataFetch = await fetch(
    `${process.env.API_URL}/office/${data.office_id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    }
  );

  const resp = await dataFetch.json();
  if (dataFetch.ok) {
    return Response.json({
      data: resp,
    });
  } else {
    return Response.json(resp, {
      status: resp.statusCode,
    });
  }
}
