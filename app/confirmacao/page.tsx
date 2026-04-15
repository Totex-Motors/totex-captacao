"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Calendar, MapPin, Clock, Car, Home } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Confirmation() {
  const router = useRouter();
  const [carData, setCarData] = useState<any>(null);
  const [schedulingData, setSchedulingData] = useState<any>(null);
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    const car = localStorage.getItem("carData");
    const scheduling = localStorage.getItem("schedulingData");

    if (car) setCarData(JSON.parse(car));
    if (scheduling) setSchedulingData(JSON.parse(scheduling));

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleReturnHome();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleReturnHome = () => {
    localStorage.removeItem("carData");
    localStorage.removeItem("personalData");
    localStorage.removeItem("schedulingData");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Success Icon */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
              className="inline-block"
            >
              <div className="bg-gradient-to-br from-[#0d9488] to-[#0f766e] rounded-full p-6 inline-block shadow-2xl">
                <CheckCircle2 className="w-16 h-16 text-white" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6"
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                Agendamento confirmado!
              </h1>
              <p className="text-lg text-gray-600">
                Seu horário está reservado
              </p>
            </motion.div>
          </div>

          {/* Details Card */}
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
                <p className="text-gray-600">
                  Ano: {carData.ano} • {carData.km} km
                  {carData.placa && ` • Placa: ${carData.placa}`}
                </p>
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
                    {schedulingData.date &&
                      format(new Date(schedulingData.date), "EEEE, dd 'de' MMMM 'de' yyyy", {
                        locale: ptBR,
                      }).replace(/^\w/, (c) => c.toUpperCase())}
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

          {/* Instructions */}
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

          {/* Return Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center"
          >
            <button
              onClick={handleReturnHome}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-8 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-lg"
            >
              <Home className="w-5 h-5" />
              Voltar ao início
            </button>
            <p className="text-sm text-gray-400 mt-4">
              Retornando automaticamente em {countdown} segundos
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
