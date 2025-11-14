"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter, useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EditarPetPerdido() {
  const router = useRouter();
  const { id } = useParams();

  const [nome, setNome] = useState("");
  const [especie, setEspecie] = useState("Cachorro");
  const [raca, setRaca] = useState("");
  const [cor, setCor] = useState("");
  const [tamanho, setTamanho] = useState("Médio");
  const [localPerdido, setLocalPerdido] = useState("");
  const [dataPerdido, setDataPerdido] = useState("");
  const [descricao, setDescricao] = useState("");
  const [contato, setContato] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    async function loadPet() {
      if (!id) return;

      try {
        const docRef = doc(db, "pets-perdidos", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setNome(data.nome || "");
          setEspecie(data.especie || "Cachorro");
          setRaca(data.raca || "");
          setCor(data.cor || "");
          setTamanho(data.tamanho || "Médio");
          setLocalPerdido(data.localPerdido || "");
          setDataPerdido(data.dataPerdido || "");
          setDescricao(data.descricao || "");
          setContato(data.contato || "");
          setAtivo(data.ativo ?? true);
        }
      } catch (error) {
        console.error("Erro ao carregar pet:", error);
        alert("Erro ao carregar dados do pet");
      } finally {
        setInitialLoading(false);
      }
    }

    loadPet();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const docRef = doc(db, "pets-perdidos", id as string);
      await updateDoc(docRef, {
        nome,
        especie,
        raca,
        cor,
        tamanho,
        localPerdido,
        dataPerdido,
        descricao,
        contato,
        ativo,
        updatedAt: new Date(),
      });

      alert("Pet atualizado com sucesso!");
      router.push("/admin/pets-perdidos");

    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar pet.");
    }

    setLoading(false);
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          <h1 className="text-xl font-bold">Admin • Editar Pet Perdido</h1>
          <Link href="/admin/pets-perdidos" className="text-gray-600 hover:text-gray-900">
            Voltar para lista
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link
          href="/admin/pets-perdidos"
          className="inline-flex items-center gap-2 text-blue-600 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para lista
        </Link>

        <h1 className="text-3xl font-bold mb-6">Editar Pet Perdido</h1>

        <form onSubmit={handleSubmit} className="bg-white shadow p-6 space-y-4 rounded">
          <input
            className="w-full p-2 border rounded"
            placeholder="Nome do Pet"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <select
              className="border p-2 rounded"
              value={especie}
              onChange={(e) => setEspecie(e.target.value)}
            >
              <option>Cachorro</option>
              <option>Gato</option>
              <option>Pássaro</option>
              <option>Outro</option>
            </select>

            <input
              className="p-2 border rounded"
              placeholder="Raça"
              value={raca}
              onChange={(e) => setRaca(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              className="p-2 border rounded"
              placeholder="Cor"
              value={cor}
              onChange={(e) => setCor(e.target.value)}
            />

            <select
              className="border p-2 rounded"
              value={tamanho}
              onChange={(e) => setTamanho(e.target.value)}
            >
              <option>Pequeno</option>
              <option>Médio</option>
              <option>Grande</option>
            </select>
          </div>

          <input
            className="w-full p-2 border rounded"
            placeholder="Local onde foi perdido"
            value={localPerdido}
            onChange={(e) => setLocalPerdido(e.target.value)}
            required
          />

          <input
            type="date"
            className="w-full p-2 border rounded"
            value={dataPerdido}
            onChange={(e) => setDataPerdido(e.target.value)}
            required
          />

          <textarea
            className="w-full p-2 border rounded"
            placeholder="Descrição"
            rows={4}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          <input
            className="w-full p-2 border rounded"
            placeholder="Contato (telefone ou email)"
            value={contato}
            onChange={(e) => setContato(e.target.value)}
            required
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="ativo"
              checked={ativo}
              onChange={(e) => setAtivo(e.target.checked)}
            />
            <label htmlFor="ativo" className="text-sm font-medium">
              Anúncio ativo
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg disabled:bg-blue-400 hover:bg-blue-700"
          >
            {loading ? "Salvando..." : "Atualizar Pet Perdido"}
          </button>
        </form>
      </div>
    </div>
  );
}
