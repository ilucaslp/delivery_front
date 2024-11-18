import { authOptions } from "@/app/options";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ office_id: string; attendance_id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  const accessToken = session.access_token;
  const data: {
    status: number;
  } = await request.json();
  const searchParams = await params;
  const dataFetch = await fetch(
    `${process.env.API_URL}/attendances/${searchParams.office_id}/${searchParams.attendance_id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        status: data.status,
      }),
    }
  );
  const resp = await dataFetch.json();
  return Response.json(dataFetch.ok ? { data: resp } : resp, {
    status: resp.statusCode,
  });
}
