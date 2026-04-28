// Função para formatar quilometragem com apenas pontos de milhar
// 5000 → 5.000
// 500000 → 500.000
// 352000 → 352.000
export function formatKilometragem(km: number | string): string {
  const numKm = typeof km === "string" ? parseInt(km, 10) : km;

  if (isNaN(numKm) || numKm < 0) {
    return "0";
  }

  // Formata com separador de milhar (ponto)
  return numKm.toLocaleString("pt-BR");
}

// Função para limpar e validar quilometragem
export function parseKilometragem(value: string): string {
  // Remove tudo que não for dígito
  const numeroLimpo = value.replace(/\D/g, "");

  // Limita a 7 dígitos (9.999.999 km é mais que suficiente)
  const limitado = numeroLimpo.slice(0, 7);

  // Formata com separador de milhar
  if (limitado === "") return "";

  return formatKilometragem(parseInt(limitado, 10));
}
