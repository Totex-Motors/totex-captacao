import { NextRequest, NextResponse } from "next/server";
import { getVersions } from "@/app/lib/fipe-cache";

export async function GET(request: NextRequest) {
  try {
    const brandId = request.nextUrl.searchParams.get("brandId");
    const modelId = request.nextUrl.searchParams.get("modelId");

    if (!brandId || !modelId) {
      return NextResponse.json(
        { error: "brandId e modelId são obrigatórios" },
        { status: 400 }
      );
    }

    const versions = await getVersions(brandId, modelId);
    return NextResponse.json(versions);
  } catch (error) {
    console.error("Erro ao obter versões:", error);
    return NextResponse.json(
      { error: "Erro ao obter versões da FIPE" },
      { status: 500 }
    );
  }
}
