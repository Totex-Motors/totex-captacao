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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => router.push("/formulario")}
            className="flex items-center gap-2 text-[#0d9488] hover:text-[#0f766e] mb-8 transition-colors font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>

          <div className="mb-8 bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0d9488] to-[#0f766e] text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                2
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dados pessoais
              </h1>
            </div>
            <p className="text-gray-600 ml-13">
              Precisamos de algumas informações suas
            </p>
          </div>

          {/* Progress */}
          <div className="flex gap-2">
            <div className="flex-1 h-2 bg-gradient-to-r from-[#0d9488] to-[#0f766e] rounded-full shadow-md"></div>
            <div className="flex-1 h-2 bg-gradient-to-r from-[#0d9488] to-[#0f766e] rounded-full shadow-md"></div>
            <div className="flex-1 h-2 bg-gray-200 rounded-full"></div>
          </div>
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white border-2 border-gray-100 rounded-2xl p-8 shadow-lg space-y-6"
        >
          {/* Nome */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-[#0d9488]" />
              Nome completo *
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Digite seu nome completo"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
              required
            />
          </div>

          {/* CPF */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#0d9488]" />
              CPF *
            </label>
            <input
              type="text"
              value={formData.cpf}
              onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })}
              placeholder="000.000.000-00"
              maxLength={14}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
              required
            />
          </div>

          {/* E-mail */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#0d9488]" />
              E-mail *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
              required
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#0d9488]" />
              WhatsApp *
            </label>
            <input
              type="tel"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: formatWhatsApp(e.target.value) })}
              placeholder="(00) 00000-0000"
              maxLength={15}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            {!isFormValid && (
              <p className="text-sm text-red-600 mb-3 text-center">
                * Preencha todos os campos obrigatórios para continuar
              </p>
            )}
            <button
              type="submit"
              disabled={!isFormValid}
              className="w-full bg-gradient-to-r from-[#0d9488] to-[#0f766e] hover:from-[#0f766e] hover:to-[#115e59] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-lg"
            >
              Continuar
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
