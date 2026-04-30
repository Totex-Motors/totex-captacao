"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, User, Phone, CreditCard, Mail } from "lucide-react";

export default function PersonalData() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    whatsapp: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("personalData", JSON.stringify(formData));
    router.push("/agendamento");
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    return value;
  };

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
    }
    return value;
  };

  const isFormValid =
    formData.nome.trim().length >= 3 &&
    formData.cpf.replace(/\D/g, "").length === 11 &&
    formData.email.includes("@") && formData.email.includes(".") &&
    formData.whatsapp.replace(/\D/g, "").length >= 10;

  const inputStyle = {
    padding: "clamp(0.35rem, 1.5vh, 0.75rem) clamp(0.4rem, 2vw, 1rem)",
    fontSize: "clamp(0.7rem, 2.2vh, 0.9rem)",
  };

  const labelStyle = {
    fontSize: "clamp(0.65rem, 2vh, 0.8rem)",
    marginBottom: "clamp(0.2rem, 0.8vh, 0.5rem)",
  };

  const iconSize = {
    width: "clamp(0.8rem, 2.5vh, 1.1rem)",
    height: "clamp(0.8rem, 2.5vh, 1.1rem)",
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
            onClick={() => router.push("/formulario")}
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
                2
              </div>
              <h1 className="font-bold text-gray-900" style={{ fontSize: "clamp(1.1rem, 4.5vh, 1.75rem)" }}>
                Dados pessoais
              </h1>
            </div>
            <p className="text-gray-600" style={{ fontSize: "clamp(0.65rem, 2vh, 0.875rem)" }}>
              Precisamos de algumas informações suas
            </p>
          </div>

          {/* Progress */}
          <div className="flex gap-2" style={{ height: "clamp(4px, 1vh, 8px)" }}>
            <div className="flex-1 bg-gradient-to-r from-[#0d9488] to-[#0f766e] rounded-full shadow-md"></div>
            <div className="flex-1 bg-gradient-to-r from-[#0d9488] to-[#0f766e] rounded-full shadow-md"></div>
            <div className="flex-1 bg-gray-200 rounded-full"></div>
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
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(0.5rem, 2vh, 1.5rem)" }}>
            {/* Nome */}
            <div>
              <label className="flex items-center gap-2 font-semibold text-gray-700" style={labelStyle}>
                <User className="text-[#0d9488]" style={iconSize} />
                Nome completo *
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Digite seu nome completo"
                className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
                style={inputStyle}
                required
              />
            </div>

            {/* CPF */}
            <div>
              <label className="flex items-center gap-2 font-semibold text-gray-700" style={labelStyle}>
                <CreditCard className="text-[#0d9488]" style={iconSize} />
                CPF *
              </label>
              <input
                type="text"
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })}
                placeholder="000.000.000-00"
                maxLength={14}
                className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
                style={inputStyle}
                required
              />
            </div>

            {/* E-mail */}
            <div>
              <label className="flex items-center gap-2 font-semibold text-gray-700" style={labelStyle}>
                <Mail className="text-[#0d9488]" style={iconSize} />
                E-mail *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="seu@email.com"
                className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
                style={inputStyle}
                required
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="flex items-center gap-2 font-semibold text-gray-700" style={labelStyle}>
                <Phone className="text-[#0d9488]" style={iconSize} />
                WhatsApp *
              </label>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: formatWhatsApp(e.target.value) })}
                placeholder="(00) 00000-0000"
                maxLength={15}
                className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
                style={inputStyle}
                required
              />
            </div>

            {/* Submit */}
            <div style={{ paddingTop: "clamp(0.25rem, 1.5vh, 1.5rem)" }}>
              {!isFormValid && (
                <p className="text-red-600 text-center" style={{ fontSize: "clamp(0.65rem, 2vh, 0.875rem)", marginBottom: "clamp(0.2rem, 1vh, 0.75rem)" }}>
                  * Preencha todos os campos obrigatórios para continuar
                </p>
              )}
              <button
                type="submit"
                disabled={!isFormValid}
                className="w-full bg-gradient-to-r from-[#0d9488] to-[#0f766e] hover:from-[#0f766e] hover:to-[#115e59] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                style={{ padding: "clamp(0.6rem, 2.5vh, 1rem)", fontSize: "clamp(0.8rem, 3vh, 1.1rem)" }}
              >
                Continuar
                <ArrowRight style={{ width: "clamp(0.9rem, 2.5vh, 1.25rem)", height: "clamp(0.9rem, 2.5vh, 1.25rem)" }} />
              </button>
            </div>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
