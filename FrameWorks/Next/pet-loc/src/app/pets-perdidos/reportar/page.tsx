'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { ArrowLeft, Upload, Heart } from 'lucide-react';

interface PetFormData {
  nome: string;
  especie: string;
  raca: string;
  cor: string;
  tamanho: string;
  localPerdido: string;
  dataPerdido: string;
  descricao: string;
  contato: string;
  recompensa?: number;
}

export default function ReportarPetPerdido() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagem, setImagem] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const [formData, setFormData] = useState<PetFormData>({
    nome: '',
    especie: 'Cachorro',
    raca: '',
    cor: '',
    tamanho: 'Médio',
    localPerdido: '',
    dataPerdido: '',
    descricao: '',
    contato: '',
    recompensa: undefined
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'recompensa' ? (value ? Number(value) : undefined) : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagem(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `pets-perdidos/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.localPerdido || !formData.dataPerdido || !formData.contato) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);

    try {
      let imageUrl = '';

      if (imagem) {
        imageUrl = await uploadImage(imagem);
      }

      await addDoc(collection(db, 'pets-perdidos'), {
        ...formData,
        imagem: imageUrl,
        status: 'perdido',
        dataCriacao: new Date(),
        ultimaAtualizacao: new Date()
      });

      alert('Pet perdido reportado com sucesso!');
      router.push('/pets-perdidos');

    } catch (error) {
      console.error('Erro ao reportar pet:', error);
      alert('Erro ao reportar pet. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">PetLoc</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="btn-primary">
                Entrar
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/pets-perdidos"
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar para Pets Perdidos</span>
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <Heart className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Reportar Pet Perdido
            </h1>
            <p className="text-gray-600">
              Ajude-nos a encontrar seu pet. Preencha os dados abaixo com o máximo de detalhes possível.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Pet *
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Rex, Mia, Buddy"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Espécie *
                </label>
                <select
                  name="especie"
                  value={formData.especie}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="Cachorro">Cachorro</option>
                  <option value="Gato">Gato</option>
                  <option value="Pássaro">Pássaro</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
            </div>

            {/* Raça e Cor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Raça
                </label>
                <input
                  type="text"
                  name="raca"
                  value={formData.raca}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Labrador, Siamês, SRD"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cor
                </label>
                <input
                  type="text"
                  name="cor"
                  value={formData.cor}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Dourado, Branco, Preto"
                />
              </div>
            </div>

            {/* Tamanho */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tamanho
              </label>
              <select
                name="tamanho"
                value={formData.tamanho}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Pequeno">Pequeno</option>
                <option value="Médio">Médio</option>
                <option value="Grande">Grande</option>
              </select>
            </div>

            {/* Local e Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Local onde foi perdido *
                </label>
                <input
                  type="text"
                  name="localPerdido"
                  value={formData.localPerdido}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Centro, São Paulo - SP"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data em que foi perdido *
                </label>
                <input
                  type="date"
                  name="dataPerdido"
                  value={formData.dataPerdido}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição detalhada
              </label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Descreva características especiais, comportamento, se usa coleira, chip, etc."
              />
            </div>

            {/* Contato e Recompensa */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contato para informações *
                </label>
                <input
                  type="text"
                  name="contato"
                  value={formData.contato}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Telefone ou email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recompensa (opcional)
                </label>
                <input
                  type="number"
                  name="recompensa"
                  value={formData.recompensa || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Valor em R$"
                  min="0"
                />
              </div>
            </div>

            {/* Imagem */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto do Pet
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  {previewUrl ? (
                    <div className="mb-4">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-w-full h-48 object-cover rounded-lg mx-auto"
                      />
                    </div>
                  ) : (
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  )}
                  <div className="space-y-2">
                    <label htmlFor="imagem" className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-800 font-medium">
                        {previewUrl ? 'Trocar imagem' : 'Selecionar imagem'}
                      </span>
                      <input
                        id="imagem"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-sm text-gray-500">
                      PNG, JPG até 10MB
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Reportando...' : 'Reportar Pet Perdido'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
