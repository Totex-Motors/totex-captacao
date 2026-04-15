import { NextRequest, NextResponse } from "next/server";
import { getModels } from "@/app/lib/fipe-cache";

export async function GET(request: NextRequest) {
  try {
    const brandId = request.nextUrl.searchParams.get("brandId");

    if (!brandId) {
      return NextResponse.json(
        { error: "brandId é obrigatório" },
        { status: 400 }
      );
    }

    const models = await getModels(brandId);
    return NextResponse.json(models);
  } catch (error) {
    console.error("Erro ao obter modelos:", error);
    return NextResponse.json(
      { error: "Erro ao obter modelos da FIPE" },
      { status: 500 }
    );
  }
}
