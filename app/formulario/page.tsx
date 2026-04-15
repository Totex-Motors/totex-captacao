"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function CarForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    marca: "",
    modelo: "",
    ano: "",
    km: "",
    placa: "",
    cor: "",
    observacoes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("carData", JSON.stringify(formData));
    router.push("/dados-pessoais");
  };

  const isFormValid = formData.marca && formData.modelo && formData.ano && formData.km;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-[#0d9488] hover:text-[#0f766e] mb-8 transition-colors font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>

          <div className="mb-8 bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0d9488] to-[#0f766e] text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                1
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dados do veículo
              </h1>
            </div>
            <p className="text-gray-600 ml-13">
              Preencha as informações sobre o seu carro
            </p>
          </div>

          {/* Progress */}
          <div className="flex gap-2">
            <div className="flex-1 h-2 bg-gradient-to-r from-[#0d9488] to-[#0f766e] rounded-full shadow-md"></div>
            <div className="flex-1 h-2 bg-gray-200 rounded-full"></div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Marca */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Marca *
              </label>
              <select
                value={formData.marca}
                onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent bg-white text-gray-900"
                required
              >
                <option value="">Selecione</option>
                {[
                  "Chevrolet",
                  "Fiat",
                  "Ford",
                  "Honda",
                  "Hyundai",
                  "Nissan",
                  "Renault",
                  "Toyota",
                  "Volkswagen",
                  "Outro",
                ].map((marca) => (
                  <option key={marca} value={marca}>
                    {marca}
                  </option>
                ))}
              </select>
            </div>

            {/* Modelo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Modelo *
              </label>
              <input
                type="text"
                value={formData.modelo}
                onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                placeholder="Ex: Onix, Gol, Civic..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
                required
              />
            </div>

            {/* Ano */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ano *
              </label>
              <input
                type="number"
                value={formData.ano}
                onChange={(e) => setFormData({ ...formData, ano: e.target.value })}
                placeholder="2020"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
                required
              />
            </div>

            {/* Quilometragem */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quilometragem *
              </label>
              <input
                type="number"
                value={formData.km}
                onChange={(e) => setFormData({ ...formData, km: e.target.value })}
                placeholder="Ex: 50000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
                required
              />
            </div>

            {/* Placa */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Placa
              </label>
              <input
                type="text"
                value={formData.placa}
                onChange={(e) => setFormData({ ...formData, placa: e.target.value.toUpperCase() })}
                placeholder="ABC-1234"
                maxLength={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
              />
            </div>

            {/* Cor */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cor
              </label>
              <select
                value={formData.cor}
                onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent bg-white text-gray-900"
              >
                <option value="">Selecione</option>
                {[
                  "Branco",
                  "Preto",
                  "Prata",
                  "Vermelho",
                  "Azul",
                  "Cinza",
                  "Verde",
                  "Amarelo",
                  "Outra",
                ].map((cor) => (
                  <option key={cor} value={cor}>
                    {cor}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Observações adicionais
            </label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Informações relevantes sobre o veículo..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            {!isFormValid && (
              <p className="text-sm text-red-600 mb-3 text-center">
                * Preencha os campos obrigatórios para continuar
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
