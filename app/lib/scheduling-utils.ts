import { isToday, addMinutes, isAfter, isBefore, startOfDay } from "date-fns";

// Configuração de horários por dia da semana
const HORARIOS_POR_DIA = {
  0: null, // Domingo - não abre
  1: { inicio: 10, fim: 19 }, // Segunda
  2: { inicio: 10, fim: 19 }, // Terça
  3: { inicio: 10, fim: 19 }, // Quarta
  4: { inicio: 10, fim: 19 }, // Quinta
  5: { inicio: 10, fim: 19 }, // Sexta
  6: { inicio: 10, fim: 18 }, // Sábado
};

type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// Função para obter horários disponíveis para uma data
export function getHorariosDisponiveis(data: Date): string[] {
  const diaSemana = data.getDay() as DiaSemana;
  const horarioConfig = HORARIOS_POR_DIA[diaSemana];

  // Domingo não abre
  if (!horarioConfig) {
    return [];
  }

  const horarios: string[] = [];

  // Gera horários de 30 em 30 minutos
  for (let hora = horarioConfig.inicio; hora < horarioConfig.fim; hora++) {
    horarios.push(`${String(hora).padStart(2, "0")}:00`);
    horarios.push(`${String(hora).padStart(2, "0")}:30`);
  }

  // Se for hoje, filtra horários já passados
  if (isToday(data)) {
    const agora = new Date();
    const minTempo = addMinutes(agora, 30); // Próximas 30 minutos

    return horarios.filter((horario) => {
      const [horas, minutos] = horario.split(":").map(Number);
      const horarioTime = new Date(data);
      horarioTime.setHours(horas, minutos, 0);

      return isAfter(horarioTime, minTempo);
    });
  }

  return horarios;
}

// Função para validar se uma data é permitida
export function isDataValida(data: Date): boolean {
  const diaSemana = data.getDay() as DiaSemana;

  // Não pode ser domingo
  if (diaSemana === 0) {
    return false;
  }

  // Não pode ser no passado
  const hoje = startOfDay(new Date());
  if (isBefore(startOfDay(data), hoje)) {
    return false;
  }

  // Não pode ser mais de 30 dias no futuro (opcional - ajuste conforme necessário)
  const dataMax = new Date();
  dataMax.setDate(dataMax.getDate() + 30);
  if (isAfter(startOfDay(data), startOfDay(dataMax))) {
    return false;
  }

  return true;
}

// Função para validar se um horário é permitido para uma data
export function isHorarioValido(data: Date, horario: string): boolean {
  const diaSemana = data.getDay() as DiaSemana;
  const horarioConfig = HORARIOS_POR_DIA[diaSemana];

  if (!horarioConfig) {
    return false; // Domingo ou dia não permitido
  }

  const [horas, minutos] = horario.split(":").map(Number);

  // Verifica se está dentro do horário permitido
  const inicioEmMinutos = horarioConfig.inicio * 60;
  const fimEmMinutos = horarioConfig.fim * 60;
  const horarioEmMinutos = horas * 60 + minutos;

  if (horarioEmMinutos < inicioEmMinutos || horarioEmMinutos >= fimEmMinutos) {
    return false;
  }

  // Se for hoje, verifica se é futuro
  if (isToday(data)) {
    const agora = new Date();
    const minTempo = addMinutes(agora, 30);

    const [horasMin, minutosMin] = [minTempo.getHours(), minTempo.getMinutes()];
    const tempoMinimoEmMinutos = horasMin * 60 + minutosMin;

    return horarioEmMinutos >= tempoMinimoEmMinutos;
  }

  return true;
}

// Função para obter nome do dia da semana
export function getNomeDia(data: Date): string {
  const dias = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  return dias[data.getDay()];
}

// Função para formatar horário de funcionamento
export function getHorarioFuncionamento(diaSemana: DiaSemana): string {
  const config = HORARIOS_POR_DIA[diaSemana];
  if (!config) return "Fechado";
  return `${String(config.inicio).padStart(2, "0")}:00 - ${String(config.fim).padStart(2, "0")}:00`;
}
