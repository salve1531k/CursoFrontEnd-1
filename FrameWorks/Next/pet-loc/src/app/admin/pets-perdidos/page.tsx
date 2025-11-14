"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { db } from "@/lib/firebase";

interface Pet {
  id: string;
  nome: string;
  especie: string;
  raca: string;
  cor: string;
  tamanho: string;
  localPerdido: string;
  dataPerdido: string;
  descricao: string;
  contato: string;
  imagens: string[];
  ativo: boolean;
}

export default function AdminLostPets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [search, setSearch] = useState("");

  async function loadPets() {
    const snapshot = await getDocs(collection(db, "pets-perdidos"));
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Pet[];
    setPets(data);
  }

  useEffect(() => {
    loadPets();
  }, []);

  async function toggleAtivo(id: string, ativo: boolean) {
    await updateDoc(doc(db, "pets-perdidos", id), { ativo });
    loadPets();
  }

  async function excluir(id: string) {
    if (confirm("Tem certeza que deseja excluir este anúncio?")) {
      await deleteDoc(doc(db, "pets-perdidos", id));
      loadPets();
    }
  }

  const filtrados = pets.filter((p) =>
    p.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold">Admin • Pets Perdidos</h1>

          <Link
            href="/admin/pets-perdidos/novo"
            className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Anúncio</span>
          </Link>
        </div>
      </header>

      {/* CONTEÚDO */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Busca */}
        <div className="bg-white shadow p-4 rounded-lg flex items-center space-x-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome..."
            className="w-full outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Lista */}
        <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Pet</th>
                <th className="p-3 text-left">Local</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Ações</th>
              </tr>
            </thead>

            <tbody>
              {filtrados.map((pet) => (
                <tr key={pet.id} className="border-t">
                  <td className="p-3 font-medium">
                    {pet.nome} <span className="text-gray-500">({pet.especie})</span>
                  </td>

                  <td className="p-3">{pet.localPerdido}</td>

                  <td className="p-3">
                    {pet.ativo ? (
                      <span className="flex items-center text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Ativo
                      </span>
                    ) : (
                      <span className="flex items-center text-red-600">
                        <XCircle className="w-4 h-4 mr-1" />
                        Inativo
                      </span>
                    )}
                  </td>

                  <td className="p-3 flex gap-3">
                    <Link
                      href={`/admin/pets-perdidos/editar/${pet.id}`}
                      className="px-3 py-1 rounded bg-yellow-600 text-white text-sm hover:bg-yellow-700 flex items-center gap-1"
                    >
                      <Edit className="w-4 h-4" />
                      Editar
                    </Link>

                    <button
                      onClick={() => toggleAtivo(pet.id, !pet.ativo)}
                      className="px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
                    >
                      {pet.ativo ? "Desativar" : "Ativar"}
                    </button>

                    <button
                      onClick={() => excluir(pet.id)}
                      className="px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700 flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
