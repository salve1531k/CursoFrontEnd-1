"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { ArrowLeft, Upload, Save } from "lucide-react";

interface ProductFormData {
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  estoque: number;
  ativo: boolean;
}

export default function NovoProduto() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagem, setImagem] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const [formData, setFormData] = useState<ProductFormData>({
    nome: "",
    descricao: "",
    preco: 0,
    categoria: "ração",
    estoque: 0,
    ativo: true,
  });

  useEffect(() => {
    // Verificar se usuário está logado e é admin
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.tipo !== "admin") {
        router.push("/admin/produtos/novo");
        return;
      }
    } catch (error) {
      router.push("/login");
      return;
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "preco" || name === "estoque" ? Number(value) : value
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
    const storageRef = ref(storage, `produtos/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.descricao || formData.preco <= 0) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = "";

      if (imagem) {
        imageUrl = await uploadImage(imagem);
      }

      await addDoc(collection(db, "produtos"), {
        ...formData,
        imagem: imageUrl,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      });

      alert("Produto criado com sucesso!");
      router.push("/admin/produtos");

    } catch (error) {
      console.error("Erro ao criar produto:", error);
      alert("Erro ao criar produto. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          <h1 className="text-xl font-bold">Admin • Novo Produto</h1>
          <Link href="/admin/produtos" className="text-gray-600 hover:text-gray-900">
            Voltar para lista
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link
          href="/admin/produtos"
          className="inline-flex items-center gap-2 text-blue-600 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para lista de produtos
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <Save className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Cadastrar Novo Produto
            </h1>
            <p className="text-gray-600">
              Adicione um novo produto à loja com todas as informações necessárias.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Produto *
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Ração Premium para Cães Adultos"
                required
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição *
              </label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Descrição detalhada do produto"
                required
              />
            </div>

            {/* Preço e Estoque */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preço (R$) *
                </label>
                <input
                  type="number"
                  name="preco"
                  value={formData.preco}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estoque *
                </label>
                <input
                  type="number"
                  name="estoque"
                  value={formData.estoque}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria *
              </label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="ração">Ração</option>
                <option value="brinquedos">Brinquedos</option>
                <option value="acessórios">Acessórios</option>
                <option value="medicamentos">Medicamentos</option>
                <option value="higiene">Higiene</option>
                <option value="outros">Outros</option>
              </select>
            </div>

            {/* Imagem */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto do Produto
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
                        {previewUrl ? "Trocar imagem" : "Selecionar imagem"}
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

            {/* Ativo */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="ativo"
                checked={formData.ativo}
                onChange={(e) => setFormData(prev => ({ ...prev, ativo: !prev.ativo }))}
              />
              <label htmlFor="ativo" className="text-sm font-medium">
                Produto ativo (disponível para venda)
              </label>
            </div>

            {/* Submit */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                {loading ? "Criando..." : "Criar Produto"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
