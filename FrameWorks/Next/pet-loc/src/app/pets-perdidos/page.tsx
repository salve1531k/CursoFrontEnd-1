'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Calendar,
  Heart,
  Filter,
  Plus,
} from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";
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
  imagem?: string;
  status: 'perdido' | 'encontrado';
}

export default function PetsPerdidos() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEspecie, setSelectedEspecie] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔥 Buscar pets do Firestore
  useEffect(() => {
    async function loadPets() {
      try {
        const q = query(collection(db, "pets-perdidos"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Pet[];

        setPets(data);
        setFilteredPets(data);
      } catch (error) {
        console.error("Erro ao carregar pets:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPets();
  }, []);

  // filtros
  useEffect(() => {
    let filtrados = pets;

    if (searchTerm) {
      filtrados = filtrados.filter(
        (p) =>
          p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.raca.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.localPerdido.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedEspecie) {
      filtrados = filtrados.filter((p) => p.especie === selectedEspecie);
    }

    setFilteredPets(filtrados);
  }, [searchTerm, selectedEspecie, pets]);

  const especies = [...new Set(pets.map((p) => p.especie))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* header público */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-xl">PetLoc</span>
          </Link>

          <div className="flex gap-4">
            <Link href="/pets-perdidos" className="text-blue-600 font-medium">
              Pets Perdidos
            </Link>
            <Link href="/admin" className="text-gray-600 hover:text-gray-900">
              Área Admin
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Pets Perdidos</h1>
            <p className="text-gray-600">
              Veja animais reportados como perdidos.
            </p>
          </div>

          <Link
            href="/pets-perdidos/reportar"
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Reportar Pet Perdido
          </Link>
        </div>

        {/* Área de busca */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="flex gap-4 flex-col lg:flex-row">
            {/* search */}
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                className="w-full py-3 pl-10 border rounded-lg"
                placeholder="Buscar por nome, raça ou local..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* filtros */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="border rounded-lg px-4 py-3 hover:bg-gray-50"
            >
              <Filter className="w-5 h-5 inline-block mr-2" />
              Filtros
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 border-t pt-4">
              <label className="block font-medium mb-2">Espécie:</label>
              <select
                value={selectedEspecie}
                onChange={(e) => setSelectedEspecie(e.target.value)}
                className="w-full mt-2 border rounded-lg p-2"
              >
                <option value="">Todas</option>
                {especies.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* LISTA DE PETS */}
        {loading ? (
          <p className="text-center text-gray-500 py-10">Carregando...</p>
        ) : filteredPets.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            Nenhum pet encontrado...
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPets.map((pet) => (
              <div key={pet.id} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="relative">
                  <img
                    src={pet.imagem || "/placeholder-pet.jpg"}
                    alt={pet.nome}
                    className="h-48 w-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="status lost">
                      Perdido
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-xl font-bold">{pet.nome}</h3>

                  <p className="text-gray-600 text-sm">{pet.especie} • {pet.raca}</p>

                  <p className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {pet.localPerdido}
                  </p>

                  <p className="flex items-center text-sm text-gray-600 mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    Perdido em {new Date(pet.dataPerdido).toLocaleDateString("pt-BR")}
                  </p>

                  <p className="text-gray-700 mt-2 line-clamp-3">{pet.descricao}</p>

                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-gray-600">
                      Contato: {pet.contato}
                    </p>
                    <button className="btn-primary text-sm px-4 py-2">
                      Contatar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 bg-blue-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Seu pet está perdido?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Cadastre seu pet perdido na nossa plataforma e aumente as chances de reencontrá-lo.
            Nossa comunidade está pronta para ajudar!
          </p>
          <Link href="/pets-perdidos/reportar" className="btn-success text-lg px-8 py-3">
            Reportar Pet Perdido
          </Link>
        </div>
      </div>
    </div>
  );
}
