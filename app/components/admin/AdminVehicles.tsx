'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle, Plus, Edit2, Trash2, X } from 'lucide-react';
import { adminFetch } from '@/app/lib/admin-auth';
import { vehiclesApi, resolveUrl } from '@/app/lib/api';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  version: string;
  year: number;
  price: number;
  doors: number;
  fuel: string;
  transmission: string;
  city: string;
  state: string;
  status: string;
  plate?: string;
  isAuction?: boolean;
  auctionMargin?: number;
  auctionEndsAt?: string;
  buyNowPrice?: number;
  fipePrice?: number;
  inspectionReportUrl?: string;
  images?: Array<{ url: string; isPrimary: boolean; order: number; altText?: string }>;
  features?: Array<{ feature: string }>;
}

interface DealershipOption {
  id: string;
  name: string;
}

interface FipeBrand {
  codigo: string;
  nome: string;
}

interface FipeModel {
  codigo: number;
  nome: string;
}

interface FipeModelGroup {
  model: string;
  versions: FipeModel[];
}

interface FormData {
  type: 'CONSIGNED' | 'DEALERSHIP';
  dealershipId: string;
  brand: string;
  model: string;
  version: string;
  year: string;
  price: number;
  doors: number;
  fuel: string;
  transmission: string;
  city: string;
  state: string;
  plate: string;
  inspectionReportUrl: string;
  selectedFeatures: string[];
  isAuction: boolean;
  auctionMargin: number;
  auctionEndsAt: string;
  buyNowPrice: string;
  fipePrice: string;
}

const AVAILABLE_FEATURES = [
  'Ar condicionado',
  'Ar condicionado digital',
  'Direção elétrica',
  'Vidros elétricos',
  'Travas elétricas',
  'Espelhos elétricos',
  'Central multimídia',
  'Bluetooth',
  'Apple CarPlay',
  'Android Auto',
  'Câmera de ré',
  'Sensor de estacionamento',
  'Bancos em couro',
  'Banco do motorista ajustável',
  'Banco aquecido',
  'Teto solar',
  'Teto panorâmico',
  'ABS',
  'Controle de estabilidade',
  'Controle de tração',
  'Airbag frontal',
  'Airbag lateral',
  'Airbag de cortina',
  'Farol automático',
  'Farol de LED',
  'Limpador automático',
  'Cruise control',
  'Cruise control adaptativo',
  'Computador de bordo',
  'Chave presença',
  'Ignição sem chave',
  'Alarme',
  'Volante multifuncional',
  'Painel digital',
  'Vidro blindado',
  'Proteção de porta',
  'Desembaçador traseiro',
  'Retrovisores aquecidos',
  'Sistema de som premium',
  'Rodas de liga leve',
];

const AdminVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [dealerships, setDealerships] = useState<DealershipOption[]>([]);
  const [fipeBrands, setFipeBrands] = useState<FipeBrand[]>([]);
  const [fipeModels, setFipeModels] = useState<FipeModel[]>([]);
  const [fipeModelGroups, setFipeModelGroups] = useState<FipeModelGroup[]>([]);
  const [selectedBrandCode, setSelectedBrandCode] = useState('');
  const [selectedModelBase, setSelectedModelBase] = useState('');
  const [selectedModelCode, setSelectedModelCode] = useState('');
  const [loadingFipeBrands, setLoadingFipeBrands] = useState(false);
  const [loadingFipeModels, setLoadingFipeModels] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadPreviews, setUploadPreviews] = useState<string[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [selectedPdfFile, setSelectedPdfFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData>({
    type: 'CONSIGNED',
    dealershipId: '',
    brand: '',
    model: '',
    version: '',
    year: new Date().getFullYear().toString(),
    price: 0,
    doors: 4,
    fuel: 'FLEX',
    transmission: 'AUTOMATIC',
    city: '',
    state: '',
    plate: '',
    inspectionReportUrl: '',
    selectedFeatures: [],
    isAuction: false,
    auctionMargin: 0,
    auctionEndsAt: '',
    buyNowPrice: '',
    fipePrice: '',
  });

  const apiUrl = 'http://localhost:3001'; // Use NEXT_PUBLIC_API_URL env var if needed

  useEffect(() => {
    void fetchVehicles();
    void fetchDealerships();
    void fetchFipeBrands();
  }, []);

  const fetchVehicles = async (page = 1, append = false) => {
    try {
      const isFirstPage = page === 1;
      if (isFirstPage) setLoading(true);
      else setLoadingMore(true);

      const response = await adminFetch(`${apiUrl}/api/vehicles/admin?page=${page}&limit=10`);
      if (!response.ok) throw new Error('Erro ao carregar veículos');
      const data = await response.json();
      const vehicleList = Array.isArray(data?.data) ? data.data : [];
      const totalVehicles = data?.total || vehicleList.length;

      if (append && page > 1) {
        setVehicles((prev) => [...prev, ...vehicleList]);
      } else {
        setVehicles(vehicleList);
      }
      setTotal(totalVehicles);
      setCurrentPage(page);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar veículos');
    } finally {
      if (page === 1) setLoading(false);
      else setLoadingMore(false);
    }
  };

  const fetchDealerships = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/dealerships`);
      if (!response.ok) return;
      const data = await response.json();
      setDealerships(Array.isArray(data) ? data.map((d) => ({ id: d.id, name: d.name })) : []);
    } catch {
      setDealerships([]);
    }
  };

  const fetchFipeBrands = async () => {
    try {
      setLoadingFipeBrands(true);
      const data = await vehiclesApi.fipe.brands();
      setFipeBrands(Array.isArray(data) ? data : []);
    } catch {
      setFipeBrands([]);
    } finally {
      setLoadingFipeBrands(false);
    }
  };

  const fetchFipeModels = async (brandCode: string) => {
    if (!brandCode) {
      setFipeModels([]);
      setFipeModelGroups([]);
      return { models: [], groups: [] };
    }

    try {
      setLoadingFipeModels(true);
      const data = await vehiclesApi.fipe.models(brandCode);
      const models = Array.isArray(data) ? (data as FipeModel[]) : [];

      const toBaseModel = (name: string) => {
        const clean = name.trim().replace(/\s+/g, ' ');
        const parts = clean.split(' ');
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

        return baseParts.length > 0 ? baseParts.join(' ') : parts[0];
      };

      const groupsMap = new Map<string, FipeModel[]>();
      models.forEach((item) => {
        const key = toBaseModel(item.nome);
        const existing = groupsMap.get(key) || [];
        existing.push(item);
        groupsMap.set(key, existing);
      });

      const groups = Array.from(groupsMap.entries())
        .map(([model, versions]) => ({
          model,
          versions: versions.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')),
        }))
        .sort((a, b) => a.model.localeCompare(b.model, 'pt-BR'));

      setFipeModels(models);
      setFipeModelGroups(groups);
      return { models, groups };
    } catch {
      setFipeModels([]);
      setFipeModelGroups([]);
      return { models: [], groups: [] };
    } finally {
      setLoadingFipeModels(false);
    }
  };

  const handleOpenModal = async (vehicle?: Vehicle) => {
    if (vehicle) {
      setEditingId(vehicle.id);

      const matchedBrand = fipeBrands.find(
        (b) => b.nome.toLowerCase() === vehicle.brand.toLowerCase()
      );
      const nextBrandCode = matchedBrand?.codigo || '';

      let fetchedModels: FipeModel[] = [];
      if (nextBrandCode) {
        try {
          setLoadingFipeModels(true);
          const data = await vehiclesApi.fipe.models(nextBrandCode);
          fetchedModels = Array.isArray(data) ? (data as FipeModel[]) : [];
        } catch {
          fetchedModels = [];
        } finally {
          setLoadingFipeModels(false);
        }
      }

      setSelectedBrandCode(nextBrandCode);
      setFipeModels(fetchedModels);
      setSelectedModelBase(vehicle.model || '');

      const matchedVersion = fetchedModels.find(
        (item) => item.nome.toLowerCase() === vehicle.version.toLowerCase()
      );
      setSelectedModelCode(matchedVersion ? String(matchedVersion.codigo) : '');

      if (fetchedModels.length > 0) {
        const toBaseModel = (name: string) => {
          const clean = name.trim().replace(/\s+/g, ' ');
          const parts = clean.split(' ');
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
          return baseParts.length > 0 ? baseParts.join(' ') : parts[0];
        };
        const groupsMap = new Map<string, FipeModel[]>();
        fetchedModels.forEach((item) => {
          const key = toBaseModel(item.nome);
          const existing = groupsMap.get(key) || [];
          existing.push(item);
          groupsMap.set(key, existing);
        });
        const groups = Array.from(groupsMap.entries())
          .map(([model, versions]) => ({
            model,
            versions: versions.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')),
          }))
          .sort((a, b) => a.model.localeCompare(b.model, 'pt-BR'));
        setFipeModelGroups(groups);
      }

      setFormData({
        type: 'CONSIGNED',
        dealershipId: '',
        brand: vehicle.brand,
        model: vehicle.model,
        version: vehicle.version,
        year: vehicle.year.toString(),
        price: vehicle.price,
        doors: 4,
        fuel: vehicle.fuel,
        transmission: vehicle.transmission,
        city: vehicle.city,
        state: vehicle.state,
        plate: vehicle.plate || '',
        inspectionReportUrl: vehicle.inspectionReportUrl || '',
        selectedFeatures: vehicle.features?.map((f) => f.feature) || [],
        isAuction: vehicle.isAuction ?? false,
        auctionMargin: vehicle.auctionMargin ?? 0,
        auctionEndsAt: vehicle.auctionEndsAt ? new Date(vehicle.auctionEndsAt).toISOString().slice(0, 16) : '',
        buyNowPrice: vehicle.buyNowPrice ? String(vehicle.buyNowPrice) : '',
        fipePrice: vehicle.fipePrice ? String(vehicle.fipePrice) : '',
      });

      setSelectedFiles([]);
      const existingImages = vehicle.images?.map((img) => img.url) || [];
      setUploadPreviews(existingImages.map(resolveUrl));
      setExistingImageUrls(existingImages);
    } else {
      setEditingId(null);
      setSelectedBrandCode('');
      setSelectedModelBase('');
      setSelectedModelCode('');
      setFipeModels([]);
      setFipeModelGroups([]);
      setFormData({
        type: 'CONSIGNED',
        dealershipId: '',
        brand: '',
        model: '',
        version: '',
        year: new Date().getFullYear().toString(),
        price: 0,
        doors: 4,
        fuel: 'FLEX',
        transmission: 'AUTOMATIC',
        city: '',
        state: '',
        plate: '',
        inspectionReportUrl: '',
        selectedFeatures: [],
        isAuction: false,
        auctionMargin: 0,
        auctionEndsAt: '',
        buyNowPrice: '',
        fipePrice: '',
      });
      setSelectedFiles([]);
      setUploadPreviews([]);
      setExistingImageUrls([]);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setSelectedFiles([]);
    setUploadPreviews([]);
    setExistingImageUrls([]);
    setSelectedPdfFile(null);
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);

    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setUploadPreviews(previewUrls);
  };

  const uploadLocalImages = async () => {
    if (selectedFiles.length === 0) return [];

    const formDataUpload = new FormData();
    selectedFiles.forEach((file) => {
      formDataUpload.append('files', file);
    });

    const response = await adminFetch(`${apiUrl}/api/vehicles/upload-image`, {
      method: 'POST',
      body: formDataUpload,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = Array.isArray(errorData?.message) ? errorData.message[0] : errorData?.message;
      throw new Error(message || 'Erro no upload das imagens');
    }

    const uploaded = await response.json();
    return Array.isArray(uploaded) ? uploaded : [];
  };

  const uploadPdfFile = async (): Promise<string | null> => {
    if (!selectedPdfFile) return null;
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', selectedPdfFile);
      const response = await adminFetch(`${apiUrl}/api/vehicles/upload-pdf`, {
        method: 'POST',
        body: formDataUpload,
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.message || 'Erro no upload do PDF');
      }
      const data = await response.json();
      return data.url || null;
    } catch (error) {
      console.error('Erro ao fazer upload do PDF:', error);
      throw error;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'type' && value === 'CONSIGNED') {
      setFormData((prev) => ({
        ...prev,
        type: value,
        dealershipId: '',
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'doors' || name === 'auctionMargin' ? Number(value) : value,
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedFeatures: prev.selectedFeatures.includes(feature)
        ? prev.selectedFeatures.filter((f) => f !== feature)
        : [...prev.selectedFeatures, feature],
    }));
  };

  const handleBrandChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const brandCode = e.target.value;
    setSelectedBrandCode(brandCode);
    setSelectedModelBase('');
    setSelectedModelCode('');

    const selectedBrand = fipeBrands.find((b) => b.codigo === brandCode);
    setFormData((prev) => ({
      ...prev,
      brand: selectedBrand?.nome || '',
      model: '',
      version: '',
    }));

    await fetchFipeModels(brandCode);
    if (!brandCode) {
      setFipeModels([]);
      setFipeModelGroups([]);
    }
  };

  const handleModelBaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const modelBase = e.target.value;
    setSelectedModelBase(modelBase);
    setSelectedModelCode('');
    setFormData((prev) => ({
      ...prev,
      model: modelBase,
      version: '',
    }));
  };

  const handleVersionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const modelCode = e.target.value;
    setSelectedModelCode(modelCode);
    const selectedVersion = fipeModels.find((m) => String(m.codigo) === modelCode);
    setFormData((prev) => ({
      ...prev,
      version: selectedVersion?.nome || '',
    }));
  };

  const versionsForSelectedModel =
    fipeModelGroups.find((group) => group.model === selectedModelBase)?.versions || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!formData.brand || !formData.model) {
        throw new Error('Selecione marca e modelo antes de salvar');
      }

      if (!formData.version) {
        throw new Error('Selecione a versão do veículo antes de salvar');
      }

      if (formData.type === 'DEALERSHIP' && !formData.dealershipId) {
        throw new Error('Selecione uma loja para veículos do tipo DEALERSHIP');
      }

      const url = editingId ? `${apiUrl}/api/vehicles/${editingId}` : `${apiUrl}/api/vehicles`;
      const method = editingId ? 'PATCH' : 'POST';

      const payload = {
        ...formData,
        year: parseInt(formData.year, 10),
        state: formData.state.toUpperCase(),
      } as any;

      payload.features = formData.selectedFeatures;

      if (!payload.plate) delete payload.plate;
      if (!payload.inspectionReportUrl) delete payload.inspectionReportUrl;
      if (!payload.auctionEndsAt) delete payload.auctionEndsAt;
      if (payload.buyNowPrice === '' || payload.buyNowPrice === null) {
        delete payload.buyNowPrice;
      } else if (payload.buyNowPrice) {
        payload.buyNowPrice = Number(payload.buyNowPrice);
      }

      if ((payload as any).fipePrice === '' || (payload as any).fipePrice === null) {
        delete (payload as any).fipePrice;
      } else if ((payload as any).fipePrice) {
        (payload as any).fipePrice = Number((payload as any).fipePrice);
      }

      if (payload.type === 'CONSIGNED') {
        delete payload.dealershipId;
      }

      if (selectedPdfFile) {
        const pdfUrl = await uploadPdfFile();
        if (pdfUrl) payload.inspectionReportUrl = pdfUrl;
      }

      const uploadedImages = await uploadLocalImages();
      if (uploadedImages.length > 0) {
        payload.images = uploadedImages;
      } else if (editingId && existingImageUrls.length > 0) {
        payload.images = existingImageUrls.map((url) => ({
          url,
          isPrimary: false,
          order: 0,
        }));
      }

      const response = await adminFetch(url, {
        method,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = Array.isArray(errorData?.message) ? errorData.message[0] : errorData?.message;
        throw new Error(message || 'Erro ao salvar veículo');
      }

      await fetchVehicles();
      handleCloseModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar veículo');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este veículo?')) return;

    try {
      const response = await adminFetch(`${apiUrl}/api/vehicles/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erro ao deletar veículo');

      await fetchVehicles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar veículo');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando veículos...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Veículos</h1>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={18} />
          Novo Veículo
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 border border-red-200 mb-6">
          <AlertCircle className="text-red-600 inline-block mr-2" size={18} />
          {error}
        </div>
      )}

      <div className="border rounded-lg overflow-hidden bg-white">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Veículos ({vehicles.length} de {total})</h2>
        </div>
        <div className="p-6">
          {vehicles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Nenhum veículo cadastrado</p>
              <button
                onClick={() => handleOpenModal()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Adicionar Primeiro Veículo
              </button>
            </div>
          ) : (
            <div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold">Marca/Modelo</th>
                      <th className="text-left py-3 px-4 font-semibold">Ano</th>
                      <th className="text-left py-3 px-4 font-semibold">Preço</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Leilão</th>
                      <th className="text-right py-3 px-4 font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map((v) => (
                      <tr key={v.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          {v.brand} {v.model}
                        </td>
                        <td className="py-3 px-4">{v.year}</td>
                        <td className="py-3 px-4">R$ {(v.price || 0).toLocaleString('pt-BR')}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              v.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {v.status === 'ACTIVE' ? 'Ativo' : v.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {v.isAuction ? (
                            <span className="px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-800">
                              {v.auctionMargin ? `+${v.auctionMargin}%` : 'Sim'}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(v)}
                            className="p-1 hover:bg-gray-200 rounded text-gray-600"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(v.id)}
                            className="p-1 hover:bg-red-100 rounded text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {vehicles.length < total && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => fetchVehicles(currentPage + 1, true)}
                    disabled={loadingMore}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loadingMore ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Carregando...
                      </>
                    ) : (
                      `Ver Mais`
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
              <h2 className="text-xl font-semibold">{editingId ? 'Editar Veículo' : 'Novo Veículo'}</h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tipo *</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2 text-sm"
                  >
                    <option value="CONSIGNED">Consignado</option>
                    <option value="DEALERSHIP">Estoque de Loja</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Loja (quando estoque de loja)</label>
                  <select
                    name="dealershipId"
                    value={formData.dealershipId}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2 text-sm"
                    disabled={formData.type !== 'DEALERSHIP'}
                  >
                    <option value="">Selecione</option>
                    {dealerships.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Marca *</label>
                  <select
                    value={selectedBrandCode}
                    onChange={handleBrandChange}
                    className="w-full border rounded-lg p-2 text-sm"
                    required
                    disabled={loadingFipeBrands}
                  >
                    <option value="">{loadingFipeBrands ? 'Carregando marcas...' : 'Selecione a marca'}</option>
                    {fipeBrands.map((brand) => (
                      <option key={brand.codigo} value={brand.codigo}>
                        {brand.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Modelo *</label>
                  <select
                    value={selectedModelBase}
                    onChange={handleModelBaseChange}
                    className="w-full border rounded-lg p-2 text-sm"
                    required
                    disabled={!selectedBrandCode || loadingFipeModels}
                  >
                    <option value="">
                      {!selectedBrandCode
                        ? 'Selecione uma marca primeiro'
                        : loadingFipeModels
                          ? 'Carregando modelos...'
                          : 'Selecione o modelo'}
                    </option>
                    {fipeModelGroups.map((group) => (
                      <option key={group.model} value={group.model}>
                        {group.model}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Versão *</label>
                  <select
                    value={selectedModelCode}
                    onChange={handleVersionChange}
                    className="w-full border rounded-lg p-2 text-sm"
                    required
                    disabled={!selectedModelBase}
                  >
                    <option value="">
                      {!selectedModelBase ? 'Selecione o modelo antes' : 'Selecione a versão'}
                    </option>
                    {versionsForSelectedModel.map((version) => (
                      <option key={version.codigo} value={String(version.codigo)}>
                        {version.nome.toLowerCase().startsWith(selectedModelBase.toLowerCase())
                          ? version.nome.slice(selectedModelBase.length).trim() || version.nome
                          : version.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ano *</label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2 text-sm"
                    required
                  >
                    <option value="">Selecione o ano</option>
                    {Array.from({ length: 2027 - 1950 + 1 }, (_, i) => 2027 - i).map((year) => (
                      <option key={year} value={year.toString()}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Preço (R$) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Portas *</label>
                  <select
                    name="doors"
                    value={formData.doors}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2 text-sm"
                  >
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Combustível *</label>
                  <select
                    name="fuel"
                    value={formData.fuel}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2 text-sm"
                  >
                    <option>FLEX</option>
                    <option>GASOLINE</option>
                    <option>DIESEL</option>
                    <option>ELECTRIC</option>
                    <option>HYBRID</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Câmbio *</label>
                  <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2 text-sm"
                  >
                    <option>MANUAL</option>
                    <option>AUTOMATIC</option>
                    <option>CVT</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Cidade *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Estado (UF) *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    maxLength={2}
                    className="w-full border rounded-lg p-2 text-sm uppercase"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Placa</label>
                  <input
                    type="text"
                    name="plate"
                    value={formData.plate}
                    onChange={handleInputChange}
                    placeholder="ABC-1234"
                    className="w-full border rounded-lg p-2 text-sm uppercase"
                  />
                </div>
              </div>

              {/* Laudo Cautelar PDF */}
              <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                  Laudo Cautelar (PDF)
                </h3>
                {formData.inspectionReportUrl && !selectedPdfFile && (
                  <div className="mb-3 flex items-center gap-2 bg-white border border-blue-200 rounded-lg px-3 py-2">
                    <span className="text-xs text-blue-700 font-medium">✓ Laudo anexado</span>
                    <a
                      href={formData.inspectionReportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 underline ml-auto"
                    >
                      Ver PDF
                    </a>
                  </div>
                )}
                {selectedPdfFile && (
                  <div className="mb-3 flex items-center gap-2 bg-white border border-green-200 rounded-lg px-3 py-2">
                    <span className="text-xs text-green-700 font-medium">📄 {selectedPdfFile.name}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedPdfFile(null)}
                      className="text-xs text-red-500 ml-auto hover:text-red-700"
                    >
                      Remover
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setSelectedPdfFile(e.target.files?.[0] || null)}
                  className="w-full border border-blue-200 rounded-lg p-2 text-sm bg-white"
                />
                <p className="text-xs text-gray-500 mt-1">Somente PDF. Máx. 20MB. Será exibido na página de leilão.</p>
              </div>

              {/* Leilão para Lojistas */}
              <div className="border rounded-lg p-4 bg-amber-50 border-amber-200">
                <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-500 rounded-full inline-block"></span>
                  Leilão para Lojistas
                </h3>
                <label className="flex items-center gap-2 cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    checked={formData.isAuction}
                    onChange={(e) => setFormData((prev) => ({
                      ...prev,
                      isAuction: e.target.checked,
                      auctionMargin: e.target.checked ? prev.auctionMargin : 0,
                    }))}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span className="text-sm font-medium text-amber-900">Disponibilizar este veículo para leilão exclusivo de lojistas</span>
                </label>
                {formData.isAuction && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-amber-900">Margem de Lucro (%)</label>
                      <input
                        type="number"
                        name="auctionMargin"
                        value={formData.auctionMargin}
                        onChange={handleInputChange}
                        min={0}
                        max={100}
                        step={0.5}
                        className="w-full border border-amber-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-400"
                        placeholder="Ex: 15"
                      />
                      {formData.price > 0 && (
                        <p className="text-xs text-amber-700 mt-1">
                          Preço de abertura: <strong>R$ {Math.round(formData.price * (1 + formData.auctionMargin / 100)).toLocaleString('pt-BR')}</strong>
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-amber-900">Encerramento do Leilão</label>
                      <input
                        type="datetime-local"
                        name="auctionEndsAt"
                        value={formData.auctionEndsAt}
                        onChange={handleInputChange}
                        className="w-full border border-amber-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-400"
                      />
                      <p className="text-xs text-gray-500 mt-1">Deixe em branco para leilão sem prazo. Quando expirar sem lances, o timer é resetado.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-amber-900">Preço "Comprar Agora" (R$) — opcional</label>
                      <input
                        type="number"
                        name="buyNowPrice"
                        value={formData.buyNowPrice}
                        onChange={handleInputChange}
                        min={0}
                        step={100}
                        className="w-full border border-amber-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-400"
                        placeholder="Ex: 85000"
                      />
                      <p className="text-xs text-gray-500 mt-1">Se preenchido, permite compra imediata sem aguardar o leilão.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-amber-900">Preço Tabela FIPE (R$) — opcional</label>
                      <input
                        type="number"
                        name="fipePrice"
                        value={formData.fipePrice}
                        onChange={handleInputChange}
                        min={0}
                        step={100}
                        className="w-full border border-amber-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-400"
                        placeholder="Ex: 55000"
                      />
                      <p className="text-xs text-gray-500 mt-1">Preço na tabela FIPE para mostrar economia ao cliente.</p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Itens de série</label>
                <div className="grid grid-cols-2 gap-3 border rounded-lg p-4 bg-gray-50">
                  {AVAILABLE_FEATURES.map((feature) => (
                    <label key={feature} className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded">
                      <input
                        type="checkbox"
                        checked={formData.selectedFeatures.includes(feature)}
                        onChange={() => handleFeatureToggle(feature)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm">{feature}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Selecionados: {formData.selectedFeatures.length}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Fotos do veículo</label>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  onChange={handleFilesChange}
                  className="w-full border rounded-lg p-2 text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">JPG, PNG ou WEBP. Máximo 8MB por imagem.</p>

                {uploadPreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {uploadPreviews.map((preview, index) => (
                      <img
                        key={`${preview}-${index}`}
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded border"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'Salvando...' : editingId ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVehicles;
