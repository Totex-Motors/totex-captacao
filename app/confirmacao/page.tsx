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

  const iconSize = {
    width: "clamp(0.8rem, 2.5vh, 1.25rem)",
    height: "clamp(0.8rem, 2.5vh, 1.25rem)",
  };

  const bodyTextStyle = {
    fontSize: "clamp(0.7rem, 2.2vh, 0.9rem)",
  };

  return (
    <div className="bg-white flex items-center justify-center" style={{ height: "100dvh", overflowY: "auto" }}>
      <div
        className="w-full max-w-2xl"
        style={{ padding: "clamp(0.75rem, 3vh, 2rem) clamp(0.5rem, 4vw, 1.5rem)" }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Status Icon + Title */}
          <div className="text-center" style={{ marginBottom: "clamp(0.75rem, 3vh, 2rem)" }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
              className="inline-block"
            >
              {enviando ? (
                <div
                  className="bg-gradient-to-br from-[#0d9488] to-[#0f766e] rounded-full inline-block shadow-2xl"
                  style={{ padding: "clamp(0.8rem, 2.5vh, 1.5rem)" }}
                >
                  <div
                    className="border-4 border-white border-t-transparent rounded-full animate-spin"
                    style={{ width: "clamp(2rem, 6vh, 3.5rem)", height: "clamp(2rem, 6vh, 3.5rem)" }}
                  ></div>
                </div>
              ) : erro ? (
                <div
                  className="bg-red-100 rounded-full inline-block shadow-2xl"
                  style={{ padding: "clamp(0.8rem, 2.5vh, 1.5rem)" }}
                >
                  <AlertCircle
                    className="text-red-600"
                    style={{ width: "clamp(2rem, 6vh, 3.5rem)", height: "clamp(2rem, 6vh, 3.5rem)" }}
                  />
                </div>
              ) : (
                <div
                  className="bg-gradient-to-br from-[#0d9488] to-[#0f766e] rounded-full inline-block shadow-2xl"
                  style={{ padding: "clamp(0.8rem, 2.5vh, 1.5rem)" }}
                >
                  <CheckCircle2
                    className="text-white"
                    style={{ width: "clamp(2rem, 6vh, 3.5rem)", height: "clamp(2rem, 6vh, 3.5rem)" }}
                  />
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{ marginTop: "clamp(0.5rem, 2vh, 1.5rem)" }}
            >
              {enviando ? (
                <>
                  <h1 className="font-bold text-gray-900" style={{ fontSize: "clamp(1.1rem, 4.5vh, 1.75rem)", marginBottom: "clamp(0.2rem, 1vh, 0.75rem)" }}>
                    Enviando agendamento...
                  </h1>
                  <p className="text-gray-600" style={bodyTextStyle}>
                    Aguarde um momento
                  </p>
                </>
              ) : erro ? (
                <>
                  <h1 className="font-bold text-red-600" style={{ fontSize: "clamp(1.1rem, 4.5vh, 1.75rem)", marginBottom: "clamp(0.2rem, 1vh, 0.75rem)" }}>
                    Erro ao enviar agendamento
                  </h1>
                  <p className="text-gray-600" style={bodyTextStyle}>
                    {erro}
                  </p>
                </>
              ) : sucesso ? (
                <>
                  <h1 className="font-bold text-gray-900" style={{ fontSize: "clamp(1.1rem, 4.5vh, 1.75rem)", marginBottom: "clamp(0.2rem, 1vh, 0.75rem)" }}>
                    Agendamento concluído!
                  </h1>
                  <p className="text-gray-600 max-w-xl mx-auto" style={bodyTextStyle}>
                    Seu horário foi reservado com sucesso. Você vai receber no e-mail as informações detalhadas do agendamento.
                  </p>
                </>
              ) : (
                <>
                  <h1 className="font-bold text-gray-900" style={{ fontSize: "clamp(1rem, 4vh, 1.5rem)", marginBottom: "clamp(0.2rem, 1vh, 0.75rem)" }}>
                    Preparando confirmação...
                  </h1>
                  <p className="text-gray-600 max-w-xl mx-auto" style={bodyTextStyle}>
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
              className="bg-white border-2 border-gray-100 rounded-2xl shadow-lg"
              style={{ padding: "clamp(0.75rem, 2.5vh, 2rem)", marginBottom: "clamp(0.5rem, 2vh, 2rem)" }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "clamp(0.5rem, 2vh, 1.5rem)" }}>
                {/* Car + Personal Info */}
                {carData && (
                  <div className="border-b border-gray-200" style={{ paddingBottom: "clamp(0.5rem, 2vh, 1.5rem)" }}>
                    <div className="flex items-center gap-3" style={{ marginBottom: "clamp(0.3rem, 1vh, 0.75rem)" }}>
                      <Car className="text-[#0d9488]" style={iconSize} />
                      <h3 className="font-semibold text-gray-900" style={bodyTextStyle}>Veículo</h3>
                    </div>
                    <p className="font-bold text-gray-900" style={{ fontSize: "clamp(0.9rem, 3.5vh, 1.5rem)", marginBottom: "clamp(0.1rem, 0.5vh, 0.25rem)" }}>
                      {carData.marca} {carData.modelo}
                    </p>
                    <div className="text-gray-600" style={{ ...bodyTextStyle, display: "flex", flexDirection: "column", gap: "clamp(0.1rem, 0.5vh, 0.25rem)" }}>
                      <p><span className="font-semibold">Versão:</span> {carData.versao}</p>
                      <p><span className="font-semibold">Ano:</span> {carData.anoFabricacao}</p>
                      <p><span className="font-semibold">Quilometragem:</span> {typeof carData.quilometragem === "number" ? carData.quilometragem.toLocaleString("pt-BR") : carData.quilometragem}</p>
                    </div>
                    {personalData && (
                      <div className="text-gray-600" style={{ ...bodyTextStyle, marginTop: "clamp(0.3rem, 1vh, 0.5rem)", display: "flex", flexDirection: "column", gap: "clamp(0.1rem, 0.5vh, 0.25rem)" }}>
                        <p><span className="font-semibold">Nome:</span> {personalData.nome}</p>
                        <p><span className="font-semibold">Email:</span> {personalData.email}</p>
                        <p><span className="font-semibold">WhatsApp:</span> {personalData.whatsapp}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Scheduling Info */}
                {schedulingData && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "clamp(0.4rem, 1.5vh, 1rem)" }}>
                    <div className="flex items-start gap-3">
                      <MapPin className="text-[#0d9488] mt-0.5" style={iconSize} />
                      <div>
                        <p className="font-semibold text-gray-900" style={bodyTextStyle}>
                          <span className="text-gray-600 font-normal">Local: </span>
                          {schedulingData.unidade?.nome}
                        </p>
                        <p className="text-gray-600" style={{ fontSize: "clamp(0.6rem, 1.8vh, 0.8rem)" }}>
                          {schedulingData.unidade?.endereco}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="text-[#0d9488]" style={iconSize} />
                      <p className="font-semibold text-gray-900" style={bodyTextStyle}>
                        <span className="text-gray-600 font-normal">Data: </span>
                        {schedulingData.dataBr} ({schedulingData.diaSemana})
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="text-[#0d9488]" style={iconSize} />
                      <p className="font-semibold text-gray-900" style={bodyTextStyle}>
                        <span className="text-gray-600 font-normal">Horário: </span>
                        {schedulingData.horario}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Instructions */}
          {sucesso && !enviando && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-[#0d9488]/5 rounded-xl border border-[#0d9488]/20"
              style={{ padding: "clamp(0.5rem, 2vh, 1.5rem)", marginBottom: "clamp(0.5rem, 2vh, 2rem)" }}
            >
              <h3 className="font-semibold text-gray-900" style={{ fontSize: "clamp(0.75rem, 2.5vh, 1rem)", marginBottom: "clamp(0.3rem, 1.2vh, 1rem)" }}>
                Não esqueça de levar:
              </h3>
              <ul style={{ display: "flex", flexDirection: "column", gap: "clamp(0.2rem, 0.8vh, 0.5rem)" }}>
                {[
                  "Documento do veículo (CRLV)",
                  "Documento de identidade (RG ou CNH)",
                  "Chaves do veículo",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-700" style={bodyTextStyle}>
                    <div className="bg-[#0d9488] rounded-full shrink-0" style={{ width: "6px", height: "6px" }}></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center"
            style={{ display: "flex", flexDirection: "column", gap: "clamp(0.3rem, 1.2vh, 0.75rem)" }}
          >
            {erro && (
              <>
                <button
                  onClick={handleRetry}
                  className="w-full bg-[#0d9488] hover:bg-[#0f766e] text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                  style={{ padding: "clamp(0.6rem, 2.5vh, 1rem)", fontSize: "clamp(0.8rem, 3vh, 1.1rem)" }}
                >
                  🔄 Tentar Novamente
                </button>
                <button
                  onClick={handleReturnHome}
                  className="w-full bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                  style={{ padding: "clamp(0.6rem, 2.5vh, 1rem)", fontSize: "clamp(0.8rem, 3vh, 1.1rem)" }}
                >
                  <Home style={iconSize} />
                  Voltar ao início
                </button>
              </>
            )}

            {sucesso && !enviando && (
              <>
                <button
                  onClick={handleReturnHome}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                  style={{ padding: "clamp(0.6rem, 2.5vh, 1rem)", fontSize: "clamp(0.8rem, 3vh, 1.1rem)" }}
                >
                  <Home style={iconSize} />
                  Voltar ao início
                </button>
                <p className="text-gray-400" style={{ fontSize: "clamp(0.6rem, 1.8vh, 0.8rem)" }}>
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
