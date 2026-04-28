import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

interface AgendamentoPayload {
  nome: string;
  email: string;
  telefone: string;
  marca: string;
  modelo: string;
  versao: string;
  anoFabricacao: number;
  localVistoria: string;
  dataVistoria: string;
  horarioVistoria: string;
}

interface AgendamentoSalvo extends AgendamentoPayload {
  id: string;
  dataCriacao: string;
  status: "pendente" | "confirmado" | "cancelado";
}

// Caminho do arquivo de dados
const AGENDAMENTOS_DIR = join(process.cwd(), "data");
const AGENDAMENTOS_FILE = join(AGENDAMENTOS_DIR, "agendamentos.json");

// Validação básica de email
function isEmailValido(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validação de telefone (formato brasileiro)
function isTelefoneValido(telefone: string): boolean {
  const telefonesemFormatacao = telefone.replace(/\D/g, "");
  return telefonesemFormatacao.length >= 10 && telefonesemFormatacao.length <= 11;
}

// Validação de data (formato ISO: YYYY-MM-DD)
function isDataValida(data: string): boolean {
  const dataRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dataRegex.test(data)) return false;

  const dateObj = new Date(data + "T00:00:00");
  return !isNaN(dateObj.getTime());
}

// Validação de horário (formato HH:MM)
function isHorarioValido(horario: string): boolean {
  const horarioRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
  return horarioRegex.test(horario);
}

// Gera um ID único
function gerarId(): string {
  return `AGD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Lê agendamentos do arquivo
async function lerAgendamentos(): Promise<AgendamentoSalvo[]> {
  try {
    // Garante que o diretório existe
    if (!existsSync(AGENDAMENTOS_DIR)) {
      await mkdir(AGENDAMENTOS_DIR, { recursive: true });
    }

    // Se arquivo não existe, retorna array vazio
    if (!existsSync(AGENDAMENTOS_FILE)) {
      return [];
    }

    const conteudo = await readFile(AGENDAMENTOS_FILE, "utf-8");
    return JSON.parse(conteudo);
  } catch (error) {
    console.error("Erro ao ler agendamentos:", error);
    return [];
  }
}

// Salva agendamentos no arquivo
async function salvarAgendamentos(agendamentos: AgendamentoSalvo[]): Promise<void> {
  try {
    // Garante que o diretório existe
    if (!existsSync(AGENDAMENTOS_DIR)) {
      await mkdir(AGENDAMENTOS_DIR, { recursive: true });
    }

    await writeFile(
      AGENDAMENTOS_FILE,
      JSON.stringify(agendamentos, null, 2),
      "utf-8"
    );
    console.log(`✅ Agendamento salvo em ${AGENDAMENTOS_FILE}`);
  } catch (error) {
    console.error("Erro ao salvar agendamentos:", error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: AgendamentoPayload = await request.json();

    // Validações
    const erros: string[] = [];

    if (!body.nome || body.nome.trim().length < 3) {
      erros.push("Nome inválido (mínimo 3 caracteres)");
    }

    if (!isEmailValido(body.email)) {
      erros.push("Email inválido");
    }

    if (!isTelefoneValido(body.telefone)) {
      erros.push("Telefone inválido");
    }

    if (!body.marca || body.marca.trim().length === 0) {
      erros.push("Marca do veículo não informada");
    }

    if (!body.modelo || body.modelo.trim().length === 0) {
      erros.push("Modelo do veículo não informado");
    }

    if (!body.versao || body.versao.trim().length === 0) {
      erros.push("Versão do veículo não informada");
    }

    if (!body.anoFabricacao || body.anoFabricacao < 1900 || body.anoFabricacao > 2100) {
      erros.push("Ano de fabricação inválido");
    }

    if (!isDataValida(body.dataVistoria)) {
      erros.push("Data de vistoria inválida");
    }

    if (!isHorarioValido(body.horarioVistoria)) {
      erros.push("Horário de vistoria inválido");
    }

    if (!body.localVistoria || body.localVistoria.trim().length === 0) {
      erros.push("Local de vistoria não informado");
    }

    // Se há erros, retorna 400
    if (erros.length > 0) {
      return NextResponse.json(
        { erro: "Dados inválidos", detalhes: erros },
        { status: 400 }
      );
    }

    // Lê agendamentos existentes
    const agendamentos = await lerAgendamentos();

    // Cria novo agendamento
    const novoAgendamento: AgendamentoSalvo = {
      ...body,
      id: gerarId(),
      dataCriacao: new Date().toISOString(),
      status: "confirmado",
    };

    // Adiciona à lista
    agendamentos.push(novoAgendamento);

    // Salva no arquivo
    await salvarAgendamentos(agendamentos);

    // Log
    console.log("✅ Novo agendamento recebido e salvo:");
    console.log(JSON.stringify(novoAgendamento, null, 2));

    return NextResponse.json(
      {
        sucesso: true,
        mensagem: "Agendamento realizado com sucesso",
        agendamentoId: novoAgendamento.id,
        dados: novoAgendamento,
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

// Endpoint GET para listar agendamentos (apenas para debug)
export async function GET(_request: NextRequest) {
  try {
    // Verifica se é requisição autorizada (adicione autenticação depois se necessário)
    const agendamentos = await lerAgendamentos();

    return NextResponse.json({
      total: agendamentos.length,
      agendamentos,
    });
  } catch (error) {
    console.error("Erro ao listar agendamentos:", error);
    return NextResponse.json(
      { erro: "Erro ao listar agendamentos" },
      { status: 500 }
    );
  }
}
