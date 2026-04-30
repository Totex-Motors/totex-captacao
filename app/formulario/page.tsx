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

  const selectStyle = {
    padding: "clamp(0.35rem, 1.5vh, 0.75rem) clamp(0.4rem, 2vw, 1rem)",
    fontSize: "clamp(0.7rem, 2.2vh, 0.9rem)",
  };

  const labelStyle = {
    fontSize: "clamp(0.65rem, 2vh, 0.8rem)",
    marginBottom: "clamp(0.2rem, 0.8vh, 0.5rem)",
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
            onClick={() => router.push("/")}
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
                1
              </div>
              <h1 className="font-bold text-gray-900" style={{ fontSize: "clamp(1.1rem, 4.5vh, 1.75rem)" }}>
                Dados do veículo
              </h1>
            </div>
            <p className="text-gray-600" style={{ fontSize: "clamp(0.65rem, 2vh, 0.875rem)" }}>
              Preencha as informações sobre o seu carro
            </p>
          </div>

          {/* Progress */}
          <div className="flex gap-2" style={{ height: "clamp(4px, 1vh, 8px)" }}>
            <div className="flex-1 bg-gradient-to-r from-[#0d9488] to-[#0f766e] rounded-full shadow-md"></div>
            <div className="flex-1 bg-gray-200 rounded-full"></div>
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
            {/* Erro geral */}
            {erro && (
              <div
                className="flex gap-3 bg-red-50 border border-red-200 rounded-lg text-red-700"
                style={{ padding: "clamp(0.5rem, 1.5vh, 1rem)" }}
              >
                <AlertCircle
                  className="flex-shrink-0 mt-0.5"
                  style={{ width: "clamp(0.9rem, 2.5vh, 1.25rem)", height: "clamp(0.9rem, 2.5vh, 1.25rem)" }}
                />
                <p style={{ fontSize: "clamp(0.65rem, 2vh, 0.875rem)" }}>{erro}</p>
              </div>
            )}

            {/* Marca e Modelo lado a lado */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700" style={labelStyle}>
                  Marca *
                </label>
                <select
                  value={formData.marca}
                  onChange={(e) => handleMarcaChange(e.target.value)}
                  disabled={loadingMarcas}
                  className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  style={selectStyle}
                  required
                >
                  <option value="">{loadingMarcas ? "Carregando..." : "Selecione"}</option>
                  {marcas.map((marca) => (
                    <option key={marca.code} value={marca.code}>{marca.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700" style={labelStyle}>
                  Modelo *
                </label>
                <select
                  value={modeloBaseSelecionado}
                  onChange={(e) => handleModeloChange(e.target.value)}
                  disabled={!marcaSelecionada || loadingModelos}
                  className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  style={selectStyle}
                  required
                >
                  <option value="">
                    {!marcaSelecionada ? "Selecione marca primeiro" : loadingModelos ? "Carregando..." : "Selecione"}
                  </option>
                  {modelosAgrupados.map((modelo) => (
                    <option key={modelo.model} value={modelo.model}>{modelo.model}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Versão */}
            <div>
              <label className="block font-semibold text-gray-700" style={labelStyle}>
                Versão *
              </label>
              <select
                value={versaoSelecionada}
                onChange={(e) => handleVersaoChange(e.target.value)}
                disabled={!modeloBaseSelecionado}
                className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                style={selectStyle}
                required
              >
                <option value="">
                  {!modeloBaseSelecionado ? "Selecione modelo primeiro" : "Selecione versão"}
                </option>
                {versoes.map((versao) => (
                  <option key={versao.code} value={versao.code}>{versao.name}</option>
                ))}
              </select>
            </div>

            {/* Ano */}
            <div>
              <label className="block font-semibold text-gray-700" style={labelStyle}>
                Ano de Fabricação *
              </label>
              <select
                value={formData.ano}
                onChange={(e) => setFormData({ ...formData, ano: e.target.value })}
                disabled={!versaoSelecionada || loadingAnos}
                className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                style={selectStyle}
                required
              >
                <option value="">
                  {!versaoSelecionada ? "Selecione versão primeiro" : loadingAnos ? "Carregando anos..." : "Selecione ano"}
                </option>
                {anos.map((ano) => (
                  <option key={ano} value={ano}>{ano}</option>
                ))}
              </select>
            </div>

            {/* Submit */}
            <div style={{ paddingTop: "clamp(0.25rem, 1.5vh, 1.5rem)" }}>
              {!isFormValid && (
                <p className="text-red-600 text-center" style={{ fontSize: "clamp(0.65rem, 2vh, 0.875rem)", marginBottom: "clamp(0.2rem, 1vh, 0.75rem)" }}>
                  * Preencha os campos obrigatórios para continuar
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
