// Este arquivo tem exemplos de como adaptar para o site externo quando estiver pronto
// Descomente e adapte conforme necessário

/* ============================================
   EXEMPLO 1: Integrar Unidades com API
   ============================================ */

/*
import { Unidade } from "./unidades";

// Quando seu site externo estiver pronto com a API
const API_EXTERNO = "https://seu-marketplace.com/api"; // Configure no .env.local

export async function getUnidadesDoSiteExterno(): Promise<Unidade[]> {
  try {
    const response = await fetch(`${API_EXTERNO}/unidades`, {
      headers: {
        "Authorization": `Bearer ${process.env.API_TOKEN}`, // Se precisar autenticação
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar unidades");
    }

    const data = await response.json();
    return data; // Espera resposta com array de unidades
  } catch (error) {
    console.error("Erro ao buscar unidades do 
    site externo:", error);
    // Fallback para hardcoded
    import { UNIDADES } from "./unidades";
    return UNIDADES;
  }
}
*/

/* ============================================
   EXEMPLO 2: Integrar Agendamentos com API
   ============================================ */

/*
import { NextRequest, NextResponse } from "next/server";

const API_EXTERNO = process.env.NEXT_PUBLIC_API_EXTERNO || "https://seu-marketplace.com/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar localmente (igual ao código atual)
    // ... (validações)

    // Enviar para site externo
    const response = await fetch(`${API_EXTERNO}/agendamentos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.API_SECRET_KEY}`, // Se precisar
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const resultado = await response.json();

    return NextResponse.json(
      {
        sucesso: true,
        mensagem: "Agendamento enviado com sucesso",
        agendamentoId: resultado.id,
        dados: resultado,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao processar agendamento:", error);
    return NextResponse.json(
      { erro: "Erro ao processar agendamento" },
      { status: 500 }
    );
  }
}
*/

/* ============================================
   EXEMPLO 3: Variáveis de Ambiente
   ============================================ */

/*
// .env.local (adicione quando tiver o site externo)
NEXT_PUBLIC_API_EXTERNO=https://seu-marketplace.com/api
API_SECRET_KEY=sua-chave-de-autorizacao-secreta
API_TIMEOUT=5000
*/

/* ============================================
   EXEMPLO 4: Cliente Reutilizável
   ============================================ */

/*
// lib/api-client.ts - Para facilitar requisições ao site externo

class APIExternoClient {
  baseUrl: string;
  token?: string;

  constructor(baseUrl: string, token?: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  async request(endpoint: string, options?: RequestInit) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options?.headers,
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  }

  async getUnidades() {
    return this.request("/unidades");
  }

  async criarAgendamento(dados: any) {
    return this.request("/agendamentos", {
      method: "POST",
      body: JSON.stringify(dados),
    });
  }
}

// Uso:
const client = new APIExternoClient(
  process.env.NEXT_PUBLIC_API_EXTERNO!,
  process.env.API_SECRET_KEY
);

export default client;
*/

export {};
