'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Users, Package, AlertTriangle, BarChart3, Settings, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se usuário está logado e é admin
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
      setUser(parsedUser);
    } catch (error) {
      router.push('/login');
      return;
    }

    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  const adminStats = [
    { title: 'Total de Usuários', value: '1,234', icon: Users, color: 'text-blue-600' },
    { title: 'Produtos Ativos', value: '89', icon: Package, color: 'text-green-600' },
    { title: 'Pets Perdidos', value: '23', icon: AlertTriangle, color: 'text-orange-600' },
    { title: 'Relatórios', value: '12', icon: BarChart3, color: 'text-purple-600' }
  ];

  const adminActions = [
    {
      title: 'Gerenciar Usuários',
      description: 'Criar, editar e excluir usuários',
      icon: Users,
      href: '/admin/usuarios',
      color: 'bg-blue-50 hover:bg-blue-100 text-blue-700'
    },
    {
      title: 'Gerenciar Produtos',
      description: 'Adicionar e editar produtos da loja',
      icon: Package,
      href: '/admin/produtos',
      color: 'bg-green-50 hover:bg-green-100 text-green-700'
    },
    {
      title: 'Pets Perdidos',
      description: 'Gerenciar anúncios de pets perdidos',
      icon: AlertTriangle,
      href: '/admin/pets-perdidos',
      color: 'bg-orange-50 hover:bg-orange-100 text-orange-700'
    },
    {
      title: 'Relatórios',
      description: 'Visualizar estatísticas e relatórios',
      icon: BarChart3,
      href: '/admin/relatorios',
      color: 'bg-purple-50 hover:bg-purple-100 text-purple-700'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">PL</span>
                </div>
                <span className="font-bold text-xl text-slate-800">PetLoc Admin</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">Olá, {user?.displayName || user?.nome}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {adminStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Admin Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Painel Administrativo</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {adminActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className={`block p-6 rounded-xl transition-all duration-200 ${action.color} border border-transparent hover:shadow-md`}
              >
                <div className="flex items-start space-x-4">
                  <action.icon className="w-8 h-8 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
                    <p className="text-sm opacity-80">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Ações Rápidas</h3>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Novo Usuário
            </button>
            <Link href="/admin/produtos/novo" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-block">
              Novo Produto
            </Link>
            <Link href="/admin/pets-perdidos" className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors inline-block">
              Ver Pets Perdidos
            </Link>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Gerar Relatório
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
