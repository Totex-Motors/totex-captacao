import { NextRequest, NextResponse } from "next/server";
import { getVersions } from "@/app/lib/fipe-cache";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ modelId: string }> }
) {
  try {
    const brandId = request.nextUrl.searchParams.get("brandId");
    const { modelId } = await params;

    if (!brandId || !modelId) {
      return NextResponse.json(
        { error: "brandId e modelId são obrigatórios" },
        { status: 400 }
      );
    }

    const versions = await getVersions(brandId, modelId);
    
    // Retorna as versões no formato esperado
    return NextResponse.json(versions);
  } catch (error) {
    console.error("Erro ao obter versões:", error);
    return NextResponse.json(
      { error: "Erro ao obter versões da FIPE" },
      { status: 500 }
    );
  }
}
