"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { Calendar as CalendarIcon, MapPin, ArrowRight, ArrowLeft, Clock } from "lucide-react";
import { Calendar } from "@/app/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { isDataValida, getNomeDia } from "@/app/lib/scheduling-utils";
import { getUnidades, Unidade } from "@/app/config/unidades";
import { getAvailableSlots } from "@/app/lib/inspection-slots";

export default function Scheduling() {
  const router = useRouter();
  const [date, setDate] = useState<Date>();
  const [unidade, setUnidade] = useState("");
  const [horario, setHorario] = useState("");
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [horariosError, setHorariosError] = useState<string | null>(null);
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [loadingUnidades, setLoadingUnidades] = useState(true);
  const [unidadesError, setUnidadesError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadUnidades = async () => {
      try {
        setLoadingUnidades(true);
        setUnidadesError(null);
        const data = await getUnidades();

        if (isMounted) {
          setUnidades(data);
        }
      } catch (_error) {
        if (isMounted) {
          setUnidadesError("Nao foi possivel carregar as unidades. Tente novamente.");
          setUnidades([]);
        }
      } finally {
        if (isMounted) {
          setLoadingUnidades(false);
        }
      }
    };

    loadUnidades();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadAvailableSlots = async () => {
      if (!unidade || !date) {
        if (isMounted) {
          setHorariosDisponiveis([]);
          setHorariosError(null);
          setHorario("");
        }
        return;
      }

      try {
        setLoadingHorarios(true);
        setHorariosError(null);
        const selectedDate = format(date, "yyyy-MM-dd");
        const slots = await getAvailableSlots(unidade, selectedDate);

        if (isMounted) {
          setHorariosDisponiveis(slots);
          setHorario((prevHorario) =>
            prevHorario && slots.includes(prevHorario) ? prevHorario : ""
          );
        }
      } catch (error) {
        if (isMounted) {
          setHorariosError(
            error instanceof Error
              ? error.message
              : "Nao foi possivel carregar os horarios. Tente novamente."
          );
          setHorariosDisponiveis([]);
          setHorario("");
        }
      } finally {
        if (isMounted) {
          setLoadingHorarios(false);
        }
      }
    };

    loadAvailableSlots();

    return () => {
      isMounted = false;
    };
  }, [date, unidade]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações finais
    if (!date || !isDataValida(date)) {
      alert("Data inválida. Não é permitido agendar em domingo ou no passado.");
      return;
    }

    if (!horariosDisponiveis.includes(horario)) {
      alert("Horário inválido para a data selecionada.");
      return;
    }

    const schedulingData = {
      data: format(date, "yyyy-MM-dd"),
      dataBr: format(date, "PPP", { locale: ptBR }),
      diaSemana: getNomeDia(date),
      horario,
      unidade: unidades.find((u) => u.id === unidade),
    };
    
    localStorage.setItem("schedulingData", JSON.stringify(schedulingData));
    router.push("/confirmacao");
  };

  const isFormValid =
    date &&
    unidade &&
    horario &&
    unidades.length > 0 &&
    !loadingUnidades &&
    !loadingHorarios &&
    horariosDisponiveis.includes(horario);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => router.push("/dados-pessoais")}
            className="flex items-center gap-2 text-[#0d9488] hover:text-[#0f766e] mb-8 transition-colors font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>

          <div className="mb-8 bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0d9488] to-[#0f766e] text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                3
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                Agende sua visita
              </h1>
            </div>
            <p className="text-gray-600 ml-13">
              Escolha o melhor dia e horário para avaliar seu veículo
            </p>
          </div>

          {/* Progress */}
          <div className="flex gap-2">
            <div className="flex-1 h-2 bg-gradient-to-r from-[#0d9488] to-[#0f766e] rounded-full shadow-md"></div>
            <div className="flex-1 h-2 bg-gradient-to-r from-[#0d9488] to-[#0f766e] rounded-full shadow-md"></div>
            <div className="flex-1 h-2 bg-gradient-to-r from-[#0d9488] to-[#0f766e] rounded-full shadow-md"></div>
          </div>
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white border-2 border-gray-100 rounded-2xl p-8 shadow-lg space-y-8"
        >
          {/* Unidade */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#0d9488]" />
              Escolha a unidade
            </label>
            {loadingUnidades ? (
              <p className="text-gray-500 text-center py-4">Carregando unidades...</p>
            ) : unidadesError ? (
              <p className="text-red-600 text-center py-4">{unidadesError}</p>
            ) : unidades.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Nenhuma unidade disponivel no momento.
              </p>
            ) : (
              <div className="grid gap-3">
                {unidades.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setUnidade(u.id)}
                    className={`text-left p-4 rounded-lg border-2 transition-all ${
                      unidade === u.id
                        ? "border-[#0d9488] bg-[#0d9488]/10"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <p className="font-semibold text-gray-900 mb-1">{u.nome}</p>
                    <p className="text-sm text-gray-600">{u.endereco}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Data */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#0d9488]" />
              Escolha a data
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={`w-full text-left px-4 py-3 border-2 rounded-lg transition-all ${
                    date
                      ? "border-cyan-500 bg-cyan-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="w-5 h-5 text-gray-400" />
                    <span className={date ? "text-gray-900 font-semibold" : "text-gray-400"}>
                      {date ? format(date, "PPP", { locale: ptBR }) : "Selecione uma data"}
                    </span>
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(dateToCheck) => !isDataValida(dateToCheck)}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Horário */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#0d9488]" />
              Escolha o horário
            </label>
            {!unidade || !date ? (
              <p className="text-gray-500 text-center py-4">
                Selecione unidade e data para ver os horários disponíveis.
              </p>
            ) : loadingHorarios ? (
              <p className="text-gray-500 text-center py-4">Carregando horários...</p>
            ) : horariosError ? (
              <p className="text-red-600 text-center py-4">{horariosError}</p>
            ) : horariosDisponiveis.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Não há horários disponíveis para esta unidade e data.
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {horariosDisponiveis.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setHorario(h)}
                    className={`px-4 py-3 rounded-lg border-2 font-semibold transition-all ${
                      horario === h
                        ? "border-[#0d9488] bg-[#0d9488] text-white"
                        : "border-gray-200 hover:border-gray-300 bg-white text-gray-700"
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={!isFormValid}
              className="w-full bg-gradient-to-r from-[#0d9488] to-[#0f766e] hover:from-[#0f766e] hover:to-[#115e59] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-lg"
            >
              Confirmar agendamento
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
