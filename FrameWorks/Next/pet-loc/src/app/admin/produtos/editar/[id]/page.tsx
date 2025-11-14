"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, Save, Trash2 } from "lucide-react";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

interface ProductFormData {
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  estoque: number;
  ativo: boolean;
}

export default function EditarProduto() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imagem, setImagem] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [formData, setFormData] = useState<ProductFormData>({
    nome: "",
    descricao: "",
    preco: 0,
    categoria: "ração",
    estoque: 0,
    ativo: true,
  });

  useEffect(() => {
    // Verificar se usuário é admin
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.tipo !== "admin") {
        router.push("/dashboard");
        return;
      }
      setIsAdmin(true);
    } catch (error) {
      router.push("/login");
      return;
    }

    // Carregar dados do produto
    loadProduct();
  }, [router, productId]);

  const loadProduct = async () => {
    try {
      const docRef = doc(db, "produtos", productId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData({
          nome: data.nome || "",
          descricao: data.descricao || "",
          preco: data.preco || 0,
          categoria: data.categoria || "ração",
          estoque: data.estoque || 0,
          ativo: data.ativo !== false,
        });
        setCurrentImageUrl(data.imagem || "");
        setPreviewUrl(data.imagem || "");
      } else {
        alert("Produto não encontrado!");
        router.push("/admin/produtos");
      }
    } catch (error) {
      console.error("Erro ao carregar produto:", error);
      alert("Erro ao carregar produto");
    } finally {
      setFetching(false);
    }
  };

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
    try {
      const storageRef = ref(storage, `produtos/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      throw error;
    }
  };

  const deleteCurrentImage = async () => {
    if (currentImageUrl) {
      try {
        // Extrair o caminho do arquivo da URL
        const imageRef = ref(storage, currentImageUrl);
        await deleteObject(imageRef);
      } catch (error) {
        console.error("Erro ao deletar imagem antiga:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.descricao || formData.preco <= 0) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = currentImageUrl;

      if (imagem) {
        // Deletar imagem antiga se existir
        if (currentImageUrl) {
          await deleteCurrentImage();
        }
        // Upload da nova imagem
        imageUrl = await uploadImage(imagem);
      }

      const docRef = doc(db, "produtos", productId);
      await updateDoc(docRef, {
        ...formData,
        imagem: imageUrl,
        atualizadoEm: new Date(),
      });

      alert("Produto atualizado com sucesso!");
      router.push("/admin/produtos");

    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      alert(`Erro ao atualizar produto: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.")) {
      try {
        // Deletar imagem se existir
        if (currentImageUrl) {
          await deleteCurrentImage();
        }

        // Deletar documento
        await deleteDoc(doc(db, "produtos", productId));

        alert("Produto excluído com sucesso!");
        router.push("/admin/produtos");
      } catch (error) {
        console.error("Erro ao excluir produto:", error);
        alert("Erro ao excluir produto");
      }
    }
  };

  if (!isAdmin || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          <h1 className="text-xl font-bold">Admin • Editar Produto</h1>
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

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Editar Produto</h1>
          <button
            onClick={handleDelete}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Excluir Produto</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow p-6 space-y-6 rounded">
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
          <div className="grid grid-cols-2 gap-4">
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
              Imagem do Produto
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
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              {loading ? "Atualizando..." : "Atualizar Produto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
