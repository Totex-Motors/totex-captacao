"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Calendar, MapPin, Clock, Car, Home, AlertCircle } from "lucide-react";

const AUTO_RETURN_SECONDS = 40;

export default function Confirmation() {
  const router = useRouter();
  const [carData, setCarData] = useState<any>(null);
  const [personalData, setPersonalData] = useState<any>(null);
  const [schedulingData, setSchedulingData] = useState<any>(null);
  const [countdown, setCountdown] = useState(AUTO_RETURN_SECONDS);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  const getSubmissionKey = (car: any, personal: any, scheduling: any) => {
    return JSON.stringify({
      customerName: personal?.nome ?? "",
      customerEmail: personal?.email ?? "",
      customerPhone: personal?.whatsapp ?? "",
      vehicleBrand: car?.marca ?? "",
      vehicleModel: car?.modelo ?? "",
      vehicleVersion: car?.versao ?? "",
      vehicleYear: car?.anoFabricacao ?? "",
      locationId: scheduling?.unidade?.id ?? "",
      scheduledDate: scheduling?.data ?? "",
      scheduledTime: scheduling?.horario ?? "",
    });
  };

  useEffect(() => {
    const car = localStorage.getItem("carData");
    const personal = localStorage.getItem("personalData");
    const scheduling = localStorage.getItem("schedulingData");

    if (car) setCarData(JSON.parse(car));
    if (personal) setPersonalData(JSON.parse(personal));
    if (scheduling) setSchedulingData(JSON.parse(scheduling));

    // Enviar agendamento assim que o componente montar
    if (car && personal && scheduling) {
      const parsedCar = JSON.parse(car);
      const parsedPersonal = JSON.parse(personal);
      const parsedScheduling = JSON.parse(scheduling);

      const submissionKey = getSubmissionKey(parsedCar, parsedPersonal, parsedScheduling);
      const completedKey = sessionStorage.getItem("appointmentSubmissionCompleted");
      const inProgressKey = sessionStorage.getItem("appointmentSubmissionInProgress");

      if (completedKey === submissionKey || inProgressKey === submissionKey) {
        return;
      }

      sessionStorage.setItem("appointmentSubmissionInProgress", submissionKey);
      enviarAgendamento(parsedCar, parsedPersonal, parsedScheduling, submissionKey);
    }
  }, []);

  useEffect(() => {
    if (sucesso && countdown === 0) {
      handleReturnHome();
    }
  }, [sucesso, countdown]);

  const enviarAgendamento = async (car: any, personal: any, scheduling: any, submissionKey?: string) => {
    try {
      setEnviando(true);
      setErro("");

      const payload = {
        customerName: personal.nome,
        customerEmail: personal.email,
        customerPhone: personal.whatsapp,
        vehicleBrand: car.marca,
        vehicleModel: car.modelo,
        vehicleVersion: car.versao,
        vehicleYear: car.anoFabricacao,
        locationId: scheduling.unidade?.id,
        scheduledDate: scheduling.data,
        scheduledTime: scheduling.horario,
      };

      const response = await fetch("/api/inspection/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok || responseData?.success === false) {
        throw new Error(
          responseData?.message || responseData?.error || "Erro ao enviar agendamento"
        );
      }

      if (submissionKey) {
        sessionStorage.setItem("appointmentSubmissionCompleted", submissionKey);
        sessionStorage.removeItem("appointmentSubmissionInProgress");
      }

      setEnviando(false);
      setSucesso(true);

      // Inicia contagem regressiva
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } catch (error) {
      console.error("Erro ao enviar agendamento:", error);
      sessionStorage.removeItem("appointmentSubmissionInProgress");
      setErro(error instanceof Error ? error.message : "Erro ao enviar agendamento");
      setEnviando(false);
    }
  };

  const handleReturnHome = () => {
    sessionStorage.removeItem("appointmentSubmissionInProgress");
    sessionStorage.removeItem("appointmentSubmissionCompleted");
    localStorage.removeItem("carData");
    localStorage.removeItem("personalData");
    localStorage.removeItem("schedulingData");
    router.push("/");
  };

  const handleRetry = () => {
    if (carData && personalData && schedulingData) {
      const submissionKey = getSubmissionKey(carData, personalData, schedulingData);
      sessionStorage.removeItem("appointmentSubmissionCompleted");
      sessionStorage.setItem("appointmentSubmissionInProgress", submissionKey);
      setErro("");
      setSucesso(false);
      setCountdown(AUTO_RETURN_SECONDS);
      enviarAgendamento(carData, personalData, schedulingData, submissionKey);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Status */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
              className="inline-block"
            >
              {enviando ? (
                <div className="bg-gradient-to-br from-[#0d9488] to-[#0f766e] rounded-full p-6 inline-block shadow-2xl">
                  <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : erro ? (
                <div className="bg-red-100 rounded-full p-6 inline-block shadow-2xl">
                  <AlertCircle className="w-16 h-16 text-red-600" />
                </div>
              ) : (
                <div className="bg-gradient-to-br from-[#0d9488] to-[#0f766e] rounded-full p-6 inline-block shadow-2xl">
                  <CheckCircle2 className="w-16 h-16 text-white" />
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6"
            >
              {enviando ? (
                <>
                  <h1 className="text-4xl font-bold text-gray-900 mb-3">
                    Enviando agendamento...
                  </h1>
                  <p className="text-lg text-gray-600">
                    Aguarde um momento
                  </p>
                </>
              ) : erro ? (
                <>
                  <h1 className="text-4xl font-bold text-red-600 mb-3">
                    Erro ao enviar agendamento
                  </h1>
                  <p className="text-lg text-gray-600">
                    {erro}
                  </p>
                </>
              ) : sucesso ? (
                <>
                  <h1 className="text-4xl font-bold text-gray-900 mb-3">
                    Agendamento concluído!
                  </h1>
                  <p className="text-lg text-gray-600 max-w-xl mx-auto">
                    Seu horário foi reservado com sucesso. Você vai receber no e-mail as informações detalhadas do agendamento.
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-gray-900 mb-3">
                    Preparando confirmação...
                  </h1>
                  <p className="text-lg text-gray-600 max-w-xl mx-auto">
                    Estamos validando os dados do agendamento.
                  </p>
                </>
              )}
            </motion.div>
          </div>

          {/* Details Card */}
          {!enviando && (sucesso || !!erro) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white border-2 border-gray-100 rounded-2xl p-8 mb-8 space-y-6 shadow-lg"
            >
              {/* Car Info */}
              {carData && (
                <div className="pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Car className="w-5 h-5 text-[#0d9488]" />
                    <h3 className="font-semibold text-gray-900">Veículo</h3>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {carData.marca} {carData.modelo}
                  </p>
                  <div className="text-gray-600 space-y-1">
                    <p><span className="font-semibold">Versão:</span> {carData.versao}</p>
                    <p><span className="font-semibold">Ano:</span> {carData.anoFabricacao}</p>
                  </div>
                <div className="space-y-2 text-gray-600">
                  <p><span className="font-semibold">Nome:</span> {personalData.nome}</p>
                  <p><span className="font-semibold">Email:</span> {personalData.email}</p>
                  <p><span className="font-semibold">WhatsApp:</span> {personalData.whatsapp}</p>
                </div>
              </div>
            )}

            {/* Scheduling Info */}
            {schedulingData && (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#0d9488] mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">
                      <span className="text-gray-600 font-normal">Local: </span>
                      {schedulingData.unidade?.nome}
                    </p>
                    <p className="text-sm text-gray-600">
                      {schedulingData.unidade?.endereco}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#0d9488]" />
                  <p className="font-semibold text-gray-900">
                    <span className="text-gray-600 font-normal">Data: </span>
                    {schedulingData.dataBr} ({schedulingData.diaSemana})
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#0d9488]" />
                  <p className="font-semibold text-gray-900">
                    <span className="text-gray-600 font-normal">Horário: </span>
                    {schedulingData.horario}
                  </p>
                </div>
              </div>
            )}
            </motion.div>
          )}

          {/* Instructions */}
          {sucesso && !enviando && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-[#0d9488]/5 rounded-xl p-6 mb-8 border border-[#0d9488]/20"
            >
              <h3 className="font-semibold text-gray-900 mb-4">
                Não esqueça de levar:
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-[#0d9488] rounded-full"></div>
                  <span>Documento do veículo (CRLV)</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-[#0d9488] rounded-full"></div>
                  <span>Documento de identidade (RG ou CNH)</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-[#0d9488] rounded-full"></div>
                  <span>Chaves do veículo</span>
                </li>
              </ul>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center space-y-3"
          >
            {erro && (
              <div className="space-y-3">
                <button
                  onClick={handleRetry}
                  className="w-full bg-[#0d9488] hover:bg-[#0f766e] text-white font-semibold py-4 px-8 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-lg"
                >
                  🔄 Tentar Novamente
                </button>
                <button
                  onClick={handleReturnHome}
                  className="w-full bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-4 px-8 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-lg"
                >
                  <Home className="w-5 h-5" />
                  Voltar ao início
                </button>
              </div>
            )}

            {sucesso && !enviando && (
              <>
                <button
                  onClick={handleReturnHome}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-8 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-lg"
                >
                  <Home className="w-5 h-5" />
                  Voltar ao início
                </button>
                <p className="text-sm text-gray-400">
                  Retornando automaticamente em {countdown} segundos
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
