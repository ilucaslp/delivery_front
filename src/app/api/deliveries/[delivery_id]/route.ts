import { getServerSession } from "next-auth";
import { authOptions } from "@/app/options";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ delivery_id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  const accessToken = session.access_token;
  const searchParams = await params;
  const data: {
    name: string;
    phone: string;
    diary_value: number;
  } = await req.json();

  const dataFetch = await fetch(
    `${process.env.API_URL}/deliveries/${searchParams.delivery_id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(data),
    }
  );

  return Response.json(
    {
      data: await dataFetch.json(),
    },
    {
      status: dataFetch.status,
    }
  );
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ delivery_id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  const accessToken = session.access_token;
  const searchParams = await params;

  const dataFetch = await fetch(
    `${process.env.API_URL}/deliveries/${searchParams.delivery_id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return Response.json(
    {
      data: "Removido com sucesso!",
    },
    {
      status: dataFetch.status,
    }
  );
}
