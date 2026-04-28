// Configuração de unidades

export interface Unidade {
  id: string;
  nome: string;
  endereco: string;
}

type InspectionLocationApi = {
  id?: string | number;
  nome?: string;
  name?: string;
  endereco?: string;
  address?: string;
};

function normalizeLocation(location: InspectionLocationApi): Unidade | null {
  const id = location.id;
  const nome = location.nome ?? location.name;
  const endereco = location.endereco ?? location.address;

  if (id === undefined || !nome || !endereco) {
    return null;
  }

  return {
    id: String(id),
    nome,
    endereco,
  };
}

export async function getUnidades(): Promise<Unidade[]> {
  const response = await fetch("/api/inspection/locations", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar unidades de atendimento");
  }

  const data = (await response.json()) as InspectionLocationApi[];

  if (!Array.isArray(data)) {
    return [];
  }

  return data.map(normalizeLocation).filter((u): u is Unidade => u !== null);
}

export async function getUnidadeById(id: string): Promise<Unidade | undefined> {
  const unidades = await getUnidades();
  return unidades.find((u) => u.id === id);
}
