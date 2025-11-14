'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { ArrowLeft, Upload, Heart, Plus } from 'lucide-react';

interface PetFormData {
  nome: string;
  especie: string;
  raca: string;
  cor: string;
  tamanho: string;
  idade?: number;
  sexo: string;
  descricao: string;
  vacinas: string;
  castrado: boolean;
  alergias: string;
  medicamentos: string;
}

export default function AdicionarPet() {
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
    idade: undefined,
    sexo: 'Macho',
    descricao: '',
    vacinas: '',
    castrado: false,
    alergias: '',
    medicamentos: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : (name === 'idade' ? (value ? Number(value) : undefined) : value)
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
    const storageRef = ref(storage, `pets/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome) {
      alert('Por favor, preencha o nome do pet.');
      return;
    }

    setLoading(true);

    try {
      let imageUrl = '';

      if (imagem) {
        imageUrl = await uploadImage(imagem);
      }

      // Pegar dados do usuário logado
      const userData = localStorage.getItem('user');
      if (!userData) {
        alert('Você precisa estar logado para adicionar um pet.');
        router.push('/login');
        return;
      }

      const user = JSON.parse(userData);

      // Criar objeto de dados do pet sem campos undefined
      const petData: any = {
        nome: formData.nome,
        especie: formData.especie,
        raca: formData.raca || '',
        cor: formData.cor || '',
        tamanho: formData.tamanho,
        sexo: formData.sexo,
        descricao: formData.descricao || '',
        vacinas: formData.vacinas || '',
        castrado: formData.castrado,
        alergias: formData.alergias || '',
        medicamentos: formData.medicamentos || '',
        imagem: imageUrl,
        donoId: user.id,
        donoNome: user.nome || '',
        donoEmail: user.email || '',
        status: 'Ativo',
        disponivelParaAdocao: false,
        dataCriacao: new Date(),
        ultimaAtualizacao: new Date()
      };

      // Adicionar idade apenas se definida
      if (formData.idade !== undefined && formData.idade !== null) {
        petData.idade = formData.idade;
      }

      console.log('Dados do pet a serem salvos:', petData);

      await addDoc(collection(db, 'pets'), petData);

      alert('Pet adicionado com sucesso!');
      router.push('/dashboard');

    } catch (error) {
      console.error('Erro ao adicionar pet:', error);
      alert('Erro ao adicionar pet. Tente novamente.');
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
              <Link href="/dashboard" className="btn-primary">
                Voltar ao Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar ao Dashboard</span>
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <Plus className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Adicionar Pet
            </h1>
            <p className="text-gray-600">
              Cadastre seu pet na plataforma PetLoc para ter acesso a todos os recursos.
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

            {/* Raça, Cor e Tamanho */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            </div>

            {/* Idade e Sexo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Idade (anos)
                </label>
                <input
                  type="number"
                  name="idade"
                  value={formData.idade || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 2"
                  min="0"
                  max="30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sexo *
                </label>
                <select
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="Macho">Macho</option>
                  <option value="Fêmea">Fêmea</option>
                </select>
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Conte um pouco sobre o temperamento, hábitos e características do seu pet..."
              />
            </div>

            {/* Informações Médicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Informações Médicas</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vacinas
                  </label>
                  <textarea
                    name="vacinas"
                    value={formData.vacinas}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Liste as vacinas tomadas..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alergias
                  </label>
                  <textarea
                    name="alergias"
                    value={formData.alergias}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Liste alergias conhecidas..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medicamentos
                  </label>
                  <textarea
                    name="medicamentos"
                    value={formData.medicamentos}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Medicamentos em uso..."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="castrado"
                    name="castrado"
                    checked={formData.castrado}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="castrado" className="text-sm font-medium text-gray-700">
                    Pet é castrado
                  </label>
                </div>
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
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Adicionando...' : 'Adicionar Pet'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
