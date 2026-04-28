import { NextRequest, NextResponse } from "next/server";

const INSPECTION_AVAILABLE_SLOTS_URL = "https://totexmotors.com/api/inspection/available-slots";

export async function GET(request: NextRequest) {
  try {
    const locationId = request.nextUrl.searchParams.get("locationId");
    const date = request.nextUrl.searchParams.get("date");

    if (!locationId || !date) {
      return NextResponse.json(
        { error: "Parâmetros obrigatórios: locationId e date" },
        { status: 400 }
      );
    }

    const externalUrl = `${INSPECTION_AVAILABLE_SLOTS_URL}?locationId=${encodeURIComponent(locationId)}&date=${encodeURIComponent(date)}`;

    const response = await fetch(externalUrl, {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Erro ao obter horários disponíveis:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar horários disponíveis" },
      { status: 500 }
    );
  }
}
