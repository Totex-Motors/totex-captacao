// Configuração de unidades
// Quando tiver o site externo pronto, é só substituir isso por uma chamada à API
// Ex: const unidades = await fetch('https://seu-site.com/api/unidades')

export interface Unidade {
  id: string;
  nome: string;
  endereco: string;
}

// ⚠️ HARDCODED POR ENQUANTO - será substituído por API depois
export const UNIDADES: Unidade[] = [
  {
    id: "1",
    nome: "Totex Motors - Tamboré",
    endereco: "Av. Piracema, 669 - Tamboré, Barueri - SP, 06460-030 (G4)",
  },
  // Adicionar mais unidades aqui conforme ficar pronto no site externo
];

// Função utilitária para buscar unidades (pronto para ser adaptada a API depois)
export async function getUnidades(): Promise<Unidade[]> {
  // Por enquanto, apenas retorna a lista hardcoded
  // Quando tiver o site externo pronto, substitua por:
  // const response = await fetch('https://seu-site.com/api/unidades');
  // return await response.json();

  return UNIDADES;
}

// Função para buscar uma unidade específica por ID
export function getUnidadeById(id: string): Unidade | undefined {
  return UNIDADES.find((u) => u.id === id);
}
