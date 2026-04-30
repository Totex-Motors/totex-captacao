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

  const labelStyle = {
    fontSize: "clamp(0.65rem, 2vh, 0.8rem)",
    marginBottom: "clamp(0.3rem, 1.2vh, 1rem)",
  };

  const iconSize = {
    width: "clamp(0.8rem, 2.5vh, 1.25rem)",
    height: "clamp(0.8rem, 2.5vh, 1.25rem)",
  };

  const statusTextStyle = {
    fontSize: "clamp(0.65rem, 2vh, 0.875rem)",
  };

  return (
    <div className="bg-white" style={{ height: "100dvh", overflowY: "auto" }}>
      <div
        className="max-w-2xl mx-auto"
        style={{ padding: "clamp(0.75rem, 3vh, 2rem) clamp(0.5rem, 4vw, 1.5rem)" }}
      >
        {/* Header */}
        <div style={{ marginBottom: "clamp(0.75rem, 3vh, 2.5rem)" }}>
          <button
            onClick={() => router.push("/dados-pessoais")}
            className="flex items-center gap-2 text-[#0d9488] hover:text-[#0f766e] transition-colors font-semibold"
            style={{ fontSize: "clamp(0.75rem, 2.5vh, 1rem)", marginBottom: "clamp(0.5rem, 2vh, 2rem)" }}
          >
            <ArrowLeft style={{ width: "clamp(0.9rem, 2.5vh, 1.25rem)", height: "clamp(0.9rem, 2.5vh, 1.25rem)" }} />
            <span>Voltar</span>
          </button>

          <div
            className="bg-white border-2 border-gray-100 rounded-2xl shadow-lg"
            style={{ padding: "clamp(0.5rem, 2vh, 1.5rem)", marginBottom: "clamp(0.5rem, 2vh, 1.5rem)" }}
          >
            <div className="flex items-center gap-3" style={{ marginBottom: "clamp(0.2rem, 1vh, 1rem)" }}>
              <div
                className="bg-gradient-to-br from-[#0d9488] to-[#0f766e] text-white rounded-full flex items-center justify-center font-bold shadow-lg shrink-0"
                style={{
                  width: "clamp(1.5rem, 5vh, 2.5rem)",
                  height: "clamp(1.5rem, 5vh, 2.5rem)",
                  fontSize: "clamp(0.7rem, 2.5vh, 1rem)",
                }}
              >
                3
              </div>
              <h1 className="font-bold text-gray-900" style={{ fontSize: "clamp(1.1rem, 4.5vh, 1.75rem)" }}>
                Agende sua visita
              </h1>
            </div>
            <p className="text-gray-600" style={{ fontSize: "clamp(0.65rem, 2vh, 0.875rem)" }}>
              Escolha o melhor dia e horário para avaliar seu veículo
            </p>
          </div>

          {/* Progress */}
          <div className="flex gap-2" style={{ height: "clamp(4px, 1vh, 8px)" }}>
            <div className="flex-1 bg-gradient-to-r from-[#0d9488] to-[#0f766e] rounded-full shadow-md"></div>
            <div className="flex-1 bg-gradient-to-r from-[#0d9488] to-[#0f766e] rounded-full shadow-md"></div>
            <div className="flex-1 bg-gradient-to-r from-[#0d9488] to-[#0f766e] rounded-full shadow-md"></div>
          </div>
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white border-2 border-gray-100 rounded-2xl shadow-lg"
          style={{ padding: "clamp(0.75rem, 2.5vh, 2rem)" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(0.75rem, 2.5vh, 2rem)" }}>
            {/* Unidade */}
            <div>
              <label className="flex items-center gap-2 font-semibold text-gray-700" style={labelStyle}>
                <MapPin className="text-[#0d9488]" style={iconSize} />
                Escolha a unidade
              </label>
              {loadingUnidades ? (
                <p className="text-gray-500 text-center" style={{ ...statusTextStyle, padding: "clamp(0.5rem, 2vh, 1rem) 0" }}>
                  Carregando unidades...
                </p>
              ) : unidadesError ? (
                <p className="text-red-600 text-center" style={{ ...statusTextStyle, padding: "clamp(0.5rem, 2vh, 1rem) 0" }}>
                  {unidadesError}
                </p>
              ) : unidades.length === 0 ? (
                <p className="text-gray-500 text-center" style={{ ...statusTextStyle, padding: "clamp(0.5rem, 2vh, 1rem) 0" }}>
                  Nenhuma unidade disponivel no momento.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "clamp(0.3rem, 1.2vh, 0.75rem)" }}>
                  {unidades.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setUnidade(u.id)}
                      className={`text-left rounded-lg border-2 transition-all ${
                        unidade === u.id
                          ? "border-[#0d9488] bg-[#0d9488]/10"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                      style={{ padding: "clamp(0.4rem, 1.5vh, 1rem)" }}
                    >
                      <p className="font-semibold text-gray-900" style={{ fontSize: "clamp(0.7rem, 2.2vh, 0.9rem)", marginBottom: "clamp(0.1rem, 0.5vh, 0.25rem)" }}>
                        {u.nome}
                      </p>
                      <p className="text-gray-600" style={{ fontSize: "clamp(0.65rem, 2vh, 0.8rem)" }}>
                        {u.endereco}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Data */}
            <div>
              <label className="flex items-center gap-2 font-semibold text-gray-700" style={labelStyle}>
                <CalendarIcon className="text-[#0d9488]" style={iconSize} />
                Escolha a data
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={`w-full text-left rounded-lg border-2 transition-all ${
                      date
                        ? "border-cyan-500 bg-cyan-50"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                    style={{ padding: "clamp(0.4rem, 1.5vh, 0.75rem) clamp(0.4rem, 2vw, 1rem)" }}
                  >
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="text-gray-400" style={iconSize} />
                      <span
                        className={date ? "text-gray-900 font-semibold" : "text-gray-400"}
                        style={{ fontSize: "clamp(0.7rem, 2.2vh, 0.9rem)" }}
                      >
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
              <label className="flex items-center gap-2 font-semibold text-gray-700" style={labelStyle}>
                <Clock className="text-[#0d9488]" style={iconSize} />
                Escolha o horário
              </label>
              {!unidade || !date ? (
                <p className="text-gray-500 text-center" style={{ ...statusTextStyle, padding: "clamp(0.5rem, 2vh, 1rem) 0" }}>
                  Selecione unidade e data para ver os horários disponíveis.
                </p>
              ) : loadingHorarios ? (
                <p className="text-gray-500 text-center" style={{ ...statusTextStyle, padding: "clamp(0.5rem, 2vh, 1rem) 0" }}>
                  Carregando horários...
                </p>
              ) : horariosError ? (
                <p className="text-red-600 text-center" style={{ ...statusTextStyle, padding: "clamp(0.5rem, 2vh, 1rem) 0" }}>
                  {horariosError}
                </p>
              ) : horariosDisponiveis.length === 0 ? (
                <p className="text-gray-500 text-center" style={{ ...statusTextStyle, padding: "clamp(0.5rem, 2vh, 1rem) 0" }}>
                  Não há horários disponíveis para esta unidade e data.
                </p>
              ) : (
                <div className="grid grid-cols-3" style={{ gap: "clamp(0.3rem, 1.2vh, 0.75rem)" }}>
                  {horariosDisponiveis.map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setHorario(h)}
                      className={`rounded-lg border-2 font-semibold transition-all ${
                        horario === h
                          ? "border-[#0d9488] bg-[#0d9488] text-white"
                          : "border-gray-200 hover:border-gray-300 bg-white text-gray-700"
                      }`}
                      style={{ padding: "clamp(0.35rem, 1.5vh, 0.75rem)", fontSize: "clamp(0.65rem, 2vh, 0.875rem)" }}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div style={{ paddingTop: "clamp(0.25rem, 1vh, 1.5rem)" }}>
              <button
                type="submit"
                disabled={!isFormValid}
                className="w-full bg-gradient-to-r from-[#0d9488] to-[#0f766e] hover:from-[#0f766e] hover:to-[#115e59] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                style={{ padding: "clamp(0.6rem, 2.5vh, 1rem)", fontSize: "clamp(0.8rem, 3vh, 1.1rem)" }}
              >
                Confirmar agendamento
                <ArrowRight style={{ width: "clamp(0.9rem, 2.5vh, 1.25rem)", height: "clamp(0.9rem, 2.5vh, 1.25rem)" }} />
              </button>
            </div>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
