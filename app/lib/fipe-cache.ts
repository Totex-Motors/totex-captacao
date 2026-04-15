// Sistema de cache em memória para FIPE API
// Atualiza uma vez por dia para respeitar rate limit de 500 requisições

const FIPE_BASE_URL = "https://fipe.parallelum.com.br/api/v2";
const VEHICLE_TYPE = "cars";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas

interface CacheData {
  brands?: Array<{ code: string; name: string }>;
  models?: Record<string, Array<{ code: string; name: string }>>;
  versions?: Record<string, Array<{ code: string; name: string }>>;
  timestamp?: number;
}

// Armazenamento global do cache
let fipeCache: CacheData = {};

// Função para buscar dados da API FIPE
async function fetchFromFipe(endpoint: string): Promise<any> {
  try {
    const response = await fetch(`${FIPE_BASE_URL}${endpoint}`, {
      headers: {
        "User-Agent": "totex-captacao/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`FIPE API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar dados da FIPE:", error);
    throw error;
  }
}

// Função para obter marcas com cache
export async function getBrands(): Promise<Array<{ code: string; name: string }>> {
  const now = Date.now();

  // Verifica se cache está válido
  if (fipeCache.brands && fipeCache.timestamp && now - fipeCache.timestamp < CACHE_DURATION) {
    console.log("📦 Retornando marcas do cache");
    return fipeCache.brands;
  }

  console.log("🔄 Buscando marcas da FIPE...");
  const brands = await fetchFromFipe(`/${VEHICLE_TYPE}/brands`);

  // Atualiza cache
  fipeCache.brands = brands;
  fipeCache.timestamp = now;

  console.log(`✅ Cache atualizado com ${brands.length} marcas`);
  return brands;
}

// Função para obter modelos de uma marca com cache
export async function getModels(brandId: string): Promise<Array<{ code: string; name: string }>> {
  const cacheKey = `models_${brandId}`;

  // Verifica se cache está válido
  if (
    fipeCache.models?.[cacheKey] &&
    fipeCache.timestamp &&
    Date.now() - fipeCache.timestamp < CACHE_DURATION
  ) {
    console.log(`📦 Retornando modelos da marca ${brandId} do cache`);
    return fipeCache.models[cacheKey];
  }

  console.log(`🔄 Buscando modelos da marca ${brandId} na FIPE...`);
  const models = await fetchFromFipe(`/${VEHICLE_TYPE}/brands/${brandId}/models`);

  // Atualiza cache
  if (!fipeCache.models) {
    fipeCache.models = {};
  }
  fipeCache.models[cacheKey] = models;
  fipeCache.timestamp = Date.now();

  console.log(`✅ Cache atualizado com ${models.length} modelos da marca ${brandId}`);
  return models;
}

// Função para obter versões de um modelo com cache
export async function getVersions(
  brandId: string,
  modelId: string
): Promise<Array<{ code: string; name: string }>> {
  const cacheKey = `versions_${brandId}_${modelId}`;

  // Verifica se cache está válido
  if (
    fipeCache.versions?.[cacheKey] &&
    fipeCache.timestamp &&
    Date.now() - fipeCache.timestamp < CACHE_DURATION
  ) {
    console.log(`📦 Retornando versões do modelo ${modelId} do cache`);
    return fipeCache.versions[cacheKey];
  }

  console.log(`🔄 Buscando versões do modelo ${modelId} na FIPE...`);
  const years = await fetchFromFipe(`/${VEHICLE_TYPE}/brands/${brandId}/models/${modelId}/years`);

  // Para cada ano, buscar as informações
  const versions: Array<{ code: string; name: string }> = [];

  for (const year of years) {
    try {
      const versionInfo = await fetchFromFipe(
        `/${VEHICLE_TYPE}/brands/${brandId}/models/${modelId}/years/${year.code}`
      );

      // Retorna o nome completo do modelo/versão
      versions.push({
        code: year.code,
        name: versionInfo.model,
      });
    } catch (error) {
      console.error(`Erro ao buscar versão do ano ${year.code}:`, error);
    }
  }

  // Atualiza cache
  if (!fipeCache.versions) {
    fipeCache.versions = {};
  }
  fipeCache.versions[cacheKey] = versions;
  fipeCache.timestamp = Date.now();

  console.log(`✅ Cache atualizado com ${versions.length} versões do modelo ${modelId}`);
  return versions;
}

// Função para limpar cache manualmente (útil para testes)
export function clearCache(): void {
  fipeCache = {};
  console.log("🗑️ Cache limpo");
}

// Função para obter status do cache
export function getCacheStatus(): {
  isCached: boolean;
  age: number;
  expiresIn: number;
} {
  const now = Date.now();
  const age = fipeCache.timestamp ? now - fipeCache.timestamp : -1;
  const expiresIn = fipeCache.timestamp ? CACHE_DURATION - age : -1;

  return {
    isCached: fipeCache.brands !== undefined,
    age: Math.max(0, age),
    expiresIn: Math.max(0, expiresIn),
  };
}
