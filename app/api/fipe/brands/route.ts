import { NextRequest, NextResponse } from "next/server";
import { getBrands } from "@/app/lib/fipe-cache";

export async function GET(_request: NextRequest) {
  try {
    const brands = await getBrands();
    return NextResponse.json(brands);
  } catch (error) {
    console.error("Erro ao obter marcas:", error);
    return NextResponse.json(
      { error: "Erro ao obter marcas da FIPE" },
      { status: 500 }
    );
  }
}
