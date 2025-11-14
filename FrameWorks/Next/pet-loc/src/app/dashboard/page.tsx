'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  Search,
  ShoppingBag,
  Users,
  LogOut,
  User,
  Plus,
  MapPin,
  MessageCircle
} from 'lucide-react';

interface User {
  id: string;
  nome: string;
  email: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  useEffect(() => {
    // Verificar autenticação
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser({
        id: parsedUser.id,
        nome: parsedUser.nome,
        email: parsedUser.email
      });
    } catch (error) {
      console.error('Erro ao parsear dados do usuário:', error);
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }

  const menuItems = [
    { id: 'overview', label: 'Visão Geral', icon: Heart },
    { id: 'pets', label: 'Meus Pets', icon: Heart },
    { id: 'pets-perdidos', label: 'Pets Perdidos', icon: Search },
    { id: 'loja', label: 'Loja', icon: ShoppingBag },
    { id: 'comunidade', label: 'Comunidade', icon: Users },
  ];

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
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-700">{user.nome}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === item.id
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      Bem-vindo, {user.nome}!
                    </h1>
                    <p className="text-gray-600">
                      Aqui está o resumo das suas atividades na PetLoc.
                    </p>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link
                      href="/pets-perdidos/reportar"
                      className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Search className="h-8 w-8 text-red-600" />
                      <div>
                        <h3 className="font-semibold text-red-900">Reportar Pet Perdido</h3>
                        <p className="text-sm text-red-700">Ajude a encontrar seu pet</p>
                      </div>
                    </Link>

                    <Link
                      href="/loja"
                      className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <ShoppingBag className="h-8 w-8 text-green-600" />
                      <div>
                        <h3 className="font-semibold text-green-900">Ir às Compras</h3>
                        <p className="text-sm text-green-700">Produtos para seu pet</p>
                      </div>
                    </Link>

                    <Link
                      href="/comunidade"
                      className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      <Users className="h-8 w-8 text-purple-600" />
                      <div>
                        <h3 className="font-semibold text-purple-900">Comunidade</h3>
                        <p className="text-sm text-purple-700">Conecte-se com outros</p>
                      </div>
                    </Link>

                    <Link
                      href="/dashboard/adicionar-pet"
                      className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Plus className="h-8 w-8 text-blue-600" />
                      <div>
                        <h3 className="font-semibold text-blue-900">Adicionar Pet</h3>
                        <p className="text-sm text-blue-700">Cadastre seu pet</p>
                      </div>
                    </Link>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Atividades Recentes
                    </h2>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            Você visualizou 3 pets perdidos próximos
                          </p>
                          <p className="text-xs text-gray-500">Há 2 horas</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <MessageCircle className="h-5 w-5 text-green-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            Nova mensagem na comunidade
                          </p>
                          <p className="text-xs text-gray-500">Há 5 horas</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'pets' && (
                <div className="text-center py-12">
                  <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Meus Pets
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Gerencie seus pets cadastrados na plataforma.
                  </p>
                  <Link href="/dashboard/adicionar-pet" className="btn-primary mr-3">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Pet
                  </Link>
                </div>
              )}

              {activeTab === 'pets-perdidos' && (
                <div className="text-center py-12">
                  <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Pets Perdidos
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Visualize pets perdidos na sua região e ajude a reunir famílias.
                  </p>
                  <Link href="/pets-perdidos" className="btn-primary mr-3">
                    Ver Pets Perdidos
                  </Link>
                  <Link href="/pets-perdidos/reportar" className="btn-secondary">
                    Reportar Pet Perdido
                  </Link>
                </div>
              )}

              {activeTab === 'loja' && (
                <div className="text-center py-12">
                  <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Loja PetLoc
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Produtos de qualidade para o seu pet com entrega rápida.
                  </p>
                  <Link href="/loja" className="btn-success">
                    Ir às Compras
                  </Link>
                </div>
              )}

              {activeTab === 'comunidade' && (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Comunidade PetLoc
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Conecte-se com outros donos de pets, compartilhe experiências.
                  </p>
                  <Link href="/comunidade" className="btn-primary">
                    Participar da Comunidade
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
