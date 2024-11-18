import { authOptions } from "@/app/options";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ office_id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  const accessToken = session.access_token;
  const searchParams = await params;
  const dataFetch = await fetch(
    `${process.env.API_URL}/attendances/${searchParams.office_id}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  return Response.json({
    data: await dataFetch.json(),
  });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ office_id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  const accessToken = session.access_token;
  const searchParams = await params;
  const data: {
    code_order: string;
    delivery_id: number;
    payment_method: string;
    tax_order: number;
  } = await req.json();

  const dataFetch = await fetch(
    `${process.env.API_URL}/attendances/${searchParams.office_id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        code_order: data.code_order,
        status: 1,
        payment_method: data.payment_method,
        tax_delivery: data.tax_order,
        deliveryId: data.delivery_id,
        officeId: Number(searchParams.office_id),
      }),
    }
  );

  const resp = await dataFetch.json();
  if (dataFetch.ok) {
    return Response.json({
      data: resp,
    });
  } else {
    return Response.json(resp, { status: resp.statusCode });
  }
}
