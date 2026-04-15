"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, AlertCircle } from "lucide-react";

interface Marca {
  code: string;
  name: string;
}

interface Modelo {
  code: string;
  name: string;
}

interface ModeloAgrupado {
  model: string;
  versions: Modelo[];
}

interface AnoFipe {
  code: string;
  name: string;
}

const ANO_MIN = 1950;
const ANO_MAX = 2027;

const ANOS_PADRAO = Array.from({ length: ANO_MAX - ANO_MIN + 1 }, (_, i) => ANO_MAX - i);

function normalizarTexto(valor: string): string {
  return valor.trim().replace(/\s+/g, " ").toLowerCase();
}

function extrairModeloBase(nomeCompleto: string): string {
  const clean = nomeCompleto.trim().replace(/\s+/g, " ");
  const parts = clean.split(" ");
  if (parts.length <= 1) return clean;

  const stopTokens = [
    /^\d/,
    /^(i|ii|iii|iv|v|vi|vii|viii|ix|x)$/i,
    /^(1\.0|1\.4|1\.6|1\.8|2\.0|tsi|tgi|mpi|tfsi|flex|turbo|at|mt|cvt)$/i,
  ];

  const baseParts: string[] = [];
  for (const part of parts) {
    if (stopTokens.some((rule) => rule.test(part))) break;
    baseParts.push(part);
    if (baseParts.length >= 2) {
      const nextIndex = parts.indexOf(part) + 1;
      if (nextIndex < parts.length && stopTokens.some((rule) => rule.test(parts[nextIndex]))) {
        break;
      }
    }
  }

  return baseParts.length > 0 ? baseParts.join(" ") : parts[0];
}

function extrairNomeVersao(nomeCompleto: string, modeloBase: string): string {
  if (!modeloBase) return nomeCompleto;
  if (nomeCompleto.toLowerCase().startsWith(modeloBase.toLowerCase())) {
    const restante = nomeCompleto.slice(modeloBase.length).trim();
    return restante || nomeCompleto;
  }
  return nomeCompleto;
}

export default function CarForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    marca: "",
    marcaNome: "",
    modelo: "",
    modeloCode: "",
    versao: "",
    versaoName: "",
    ano: "",
  });

  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [modelosAgrupados, setModelosAgrupados] = useState<ModeloAgrupado[]>([]);
  const [versoes, setVersoes] = useState<Modelo[]>([]);
  const [anos, setAnos] = useState<number[]>(ANOS_PADRAO);

  const [marcaSelecionada, setMarcaSelecionada] = useState("");
  const [modeloBaseSelecionado, setModeloBaseSelecionado] = useState("");
  const [versaoSelecionada, setVersaoSelecionada] = useState("");

  const [loadingMarcas, setLoadingMarcas] = useState(true);
  const [loadingModelos, setLoadingModelos] = useState(false);
  const [loadingAnos, setLoadingAnos] = useState(false);

  const [erro, setErro] = useState("");

  // Carrega marcas na montagem do componente
  useEffect(() => {
    const carregarMarcas = async () => {
      try {
        setLoadingMarcas(true);
        const response = await fetch("/api/fipe/brands");
        if (!response.ok) throw new Error("Erro ao buscar marcas");
        const data = await response.json();
        setMarcas(data);
      } catch (error) {
        console.error("Erro ao carregar marcas:", error);
        setErro("Erro ao carregar marcas. Tente recarregar a página.");
      } finally {
        setLoadingMarcas(false);
      }
    };

    carregarMarcas();
  }, []);

  // Carrega lista flat da FIPE e agrupa por modelo base quando marca muda
  useEffect(() => {
    if (!marcaSelecionada) {
      setModelosAgrupados([]);
      setVersoes([]);
      setAnos(ANOS_PADRAO);
      return;
    }

    const carregarModelos = async () => {
      try {
        setLoadingModelos(true);
        setErro("");
        const response = await fetch(`/api/fipe/models?brandId=${marcaSelecionada}`);
        if (!response.ok) throw new Error("Erro ao buscar modelos");
        const data = (await response.json()) as Modelo[];
        const models = Array.isArray(data) ? data : [];

        const groupsMap = new Map<string, { model: string; versionsMap: Map<string, Modelo> }>();
        models.forEach((item) => {
          const modelBase = extrairModeloBase(item.name);
          const modelKey = normalizarTexto(modelBase);
          const versionName = extrairNomeVersao(item.name, modelBase);
          const versionKey = normalizarTexto(versionName);

          if (!groupsMap.has(modelKey)) {
            groupsMap.set(modelKey, {
              model: modelBase,
              versionsMap: new Map<string, Modelo>(),
            });
          }

          const group = groupsMap.get(modelKey)!;
          if (!group.versionsMap.has(versionKey)) {
            group.versionsMap.set(versionKey, {
              code: item.code,
              name: versionName,
            });
          }
        });

        const groups = Array.from(groupsMap.values())
          .map((group) => ({
            model: group.model,
            versions: Array.from(group.versionsMap.values()).sort((a, b) =>
              a.name.localeCompare(b.name, "pt-BR")
            ),
          }))
          .sort((a, b) => a.model.localeCompare(b.model, "pt-BR"));

        setModelosAgrupados(groups);
      } catch (error) {
        console.error("Erro ao carregar modelos:", error);
        setErro("Erro ao carregar modelos. Tente novamente.");
      } finally {
        setLoadingModelos(false);
      }
    };

    carregarModelos();
  }, [marcaSelecionada]);

  // Carrega anos quando uma versão (código FIPE) é selecionada
  useEffect(() => {
    if (!marcaSelecionada || !formData.modeloCode) {
      setAnos(ANOS_PADRAO);
      setFormData((prev) => ({ ...prev, ano: "" }));
      return;
    }

    const carregarAnos = async () => {
      try {
        setLoadingAnos(true);
        setErro("");
        const response = await fetch(
          `/api/fipe/models/${formData.modeloCode}/years?brandId=${marcaSelecionada}`
        );
        if (!response.ok) throw new Error("Erro ao buscar anos");
        const data = (await response.json()) as AnoFipe[];

        const anosUnicos = Array.from(
          new Set(
            data
              .map((v) => parseInt(v.name.split(" ")[0], 10))
              .filter((ano) => Number.isFinite(ano) && ano >= ANO_MIN && ano <= ANO_MAX)
          )
        ).sort((a, b) => b - a);

        setAnos(anosUnicos.length > 0 ? anosUnicos : ANOS_PADRAO);
      } catch (error) {
        console.error("Erro ao carregar anos:", error);
        setAnos(ANOS_PADRAO);
        setErro("Erro ao carregar anos, usando faixa padrão.");
      } finally {
        setLoadingAnos(false);
      }
    };

    carregarAnos();
  }, [marcaSelecionada, formData.modeloCode]);

  const handleMarcaChange = (marcaCode: string) => {
    const marca = marcas.find((m) => m.code === marcaCode);
    setMarcaSelecionada(marcaCode);
    setModeloBaseSelecionado("");
    setVersaoSelecionada("");
    setVersoes([]);
    setAnos(ANOS_PADRAO);

    setFormData({
      ...formData,
      marca: marcaCode,
      marcaNome: marca?.name || "",
      modelo: "",
      modeloCode: "",
      versao: "",
      versaoName: "",
      ano: "",
    });
  };

  const handleModeloChange = (modeloBase: string) => {
    setModeloBaseSelecionado(modeloBase);
    setVersaoSelecionada("");
    const grupo = modelosAgrupados.find((g) => g.model === modeloBase);
    setVersoes(grupo?.versions || []);
    setAnos(ANOS_PADRAO);

    setFormData({
      ...formData,
      modelo: modeloBase,
      modeloCode: "",
      versao: "",
      versaoName: "",
      ano: "",
    });
  };

  const handleVersaoChange = (versaoCode: string) => {
    setVersaoSelecionada(versaoCode);
    const versao = versoes.find((v) => v.code === versaoCode);

    setFormData({
      ...formData,
      versao: versaoCode,
      versaoName: versao?.name || "",
      modeloCode: versao?.code || "",
      ano: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const carData = {
      marca: formData.marcaNome,
      modelo: formData.modelo,
      versao: formData.versaoName,
      anoFabricacao: parseInt(formData.ano, 10),
    };
    localStorage.setItem("carData", JSON.stringify(carData));
    router.push("/dados-pessoais");
  };

  const isFormValid = formData.marca && formData.modelo && formData.versao && formData.ano;

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
          {/* Erro geral */}
          {erro && (
            <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{erro}</p>
            </div>
          )}

          {/* Marca e Modelo - Lado a lado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Marca */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Marca *
              </label>
              <select
                value={formData.marca}
                onChange={(e) => handleMarcaChange(e.target.value)}
                disabled={loadingMarcas}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              >
                <option value="">
                  {loadingMarcas ? "Carregando..." : "Selecione"}
                </option>
                {marcas.map((marca) => (
                  <option key={marca.code} value={marca.code}>
                    {marca.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Modelo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Modelo *
              </label>
              <select
                value={modeloBaseSelecionado}
                onChange={(e) => handleModeloChange(e.target.value)}
                disabled={!marcaSelecionada || loadingModelos}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              >
                <option value="">
                  {!marcaSelecionada
                    ? "Selecione marca primeiro"
                    : loadingModelos
                      ? "Carregando..."
                      : "Selecione"}
                </option>
                {modelosAgrupados.map((modelo) => (
                  <option key={modelo.model} value={modelo.model}>
                    {modelo.model}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Versão */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Versão *
            </label>
            <select
              value={versaoSelecionada}
              onChange={(e) => handleVersaoChange(e.target.value)}
              disabled={!modeloBaseSelecionado}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            >
              <option value="">
                {!modeloBaseSelecionado
                  ? "Selecione modelo primeiro"
                  : "Selecione versão"}
              </option>
              {versoes.map((versao) => (
                <option key={versao.code} value={versao.code}>
                  {versao.name}
                </option>
              ))}
            </select>
          </div>

          {/* Ano */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ano de Fabricação *
            </label>
            <select
              value={formData.ano}
              onChange={(e) => setFormData({ ...formData, ano: e.target.value })}
              disabled={!versaoSelecionada || loadingAnos}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            >
              <option value="">
                {!versaoSelecionada
                  ? "Selecione versão primeiro"
                  : loadingAnos
                    ? "Carregando anos..."
                    : "Selecione ano"}
              </option>
              {anos.map((ano) => (
                <option key={ano} value={ano}>
                  {ano}
                </option>
              ))}
            </select>
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
