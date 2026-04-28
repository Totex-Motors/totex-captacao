import { NextRequest, NextResponse } from "next/server";

const INSPECTION_LOCATIONS_URL = "https://totexmotors.com/api/inspection/locations";

export async function GET(_request: NextRequest) {
  try {
    const response = await fetch(INSPECTION_LOCATIONS_URL, {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Erro ao obter unidades de vistoria" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Erro ao obter unidades de vistoria:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar unidades" },
      { status: 500 }
    );
  }
} 