'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Star, Heart, ShoppingCart, Filter, Search, Package, Plus, LogOut } from 'lucide-react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';

interface Product {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  marca: string;
  estoque: number;
  imagem?: string;
  avaliacao: number;
  numAvaliacoes: number;
  desconto?: number;
  ativo?: boolean;
}

export default function Loja() {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('nome');
  const [showFilters, setShowFilters] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Carregar produtos do Firebase
    const loadProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "produtos"));
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          preco: d.data().preco || 0,
          estoque: d.data().estoque || 0,
          avaliacao: d.data().avaliacao || 4.5,
          numAvaliacoes: d.data().numAvaliacoes || 0,
          desconto: d.data().desconto || undefined,
          marca: d.data().marca || "PetLoc"
        })) as Product[];
        setProducts(data.filter(p => p.ativo !== false));
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        // Fallback para dados mockados se Firebase falhar
        const mockProducts: Product[] = [
          {
            id: '1',
            nome: 'Ração Premium para Cães Adultos',
            descricao: 'Ração completa e balanceada para cães adultos de todas as raças.',
            preco: 89.90,
            categoria: 'Ração',
            marca: 'PetNutri',
            estoque: 50,
            avaliacao: 4.5,
            numAvaliacoes: 128,
            desconto: 10
          },
          {
            id: '2',
            nome: 'Coleira Ajustável com Placa',
            descricao: 'Coleira resistente e confortável com placa de identificação personalizada.',
            preco: 29.90,
            categoria: 'Acessórios',
            marca: 'PetStyle',
            estoque: 30,
            avaliacao: 4.2,
            numAvaliacoes: 89
          },
          {
            id: '3',
            nome: 'Cama Pet Confortável',
            descricao: 'Cama ortopédica para cães e gatos, lavável e resistente.',
            preco: 149.90,
            categoria: 'Camas',
            marca: 'PetComfort',
            estoque: 15,
            avaliacao: 4.7,
            numAvaliacoes: 203,
            desconto: 15
          },
          {
            id: '4',
            nome: 'Brinquedo Interativo para Gatos',
            descricao: 'Varinha com penas para estimular o instinto de caça dos felinos.',
            preco: 19.90,
            categoria: 'Brinquedos',
            marca: 'CatFun',
            estoque: 40,
            avaliacao: 4.3,
            numAvaliacoes: 67
          },
          {
            id: '5',
            nome: 'Shampoo Medicinal para Pets',
            descricao: 'Shampoo terapêutico para tratamento de pele sensível e alergias.',
            preco: 34.90,
            categoria: 'Higiene',
            marca: 'PetCare',
            estoque: 25,
            avaliacao: 4.6,
            numAvaliacoes: 156
          },
          {
            id: '6',
            nome: 'Caixa de Transporte Pet',
            descricao: 'Caixa resistente e segura para transporte de animais de estimação.',
            preco: 79.90,
            categoria: 'Transporte',
            marca: 'SafePet',
            estoque: 12,
            avaliacao: 4.4,
            numAvaliacoes: 94,
            desconto: 5
          }
        ];

        setProducts(mockProducts);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.marca.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoria
    if (selectedCategory) {
      filtered = filtered.filter(product => product.categoria === selectedCategory);
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'preco-asc':
          return a.preco - b.preco;
        case 'preco-desc':
          return b.preco - a.preco;
        case 'avaliacao':
          return b.avaliacao - a.avaliacao;
        case 'nome':
        default:
          return a.nome.localeCompare(b.nome);
      }
    });

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, sortBy, products]);

  const categories = [...new Set(products.map(product => product.categoria))];

  const addToCart = async (product: Product) => {
    try {
      // Verificar se usuário está logado
      if (!user) {
        alert('Você precisa estar logado para adicionar produtos ao carrinho.');
        return;
      }

      // Adicionar ao Firestore
      await addDoc(collection(db, 'cart'), {
        productId: product.id,
        nome: product.nome,
        preco: product.preco,
        quantidade: 1,
        imagem: product.imagem,
        userId: user.uid,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      setCartCount(prev => prev + 1);
      alert(`${product.nome} adicionado ao carrinho!`);
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      alert('Erro ao adicionar produto ao carrinho.');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
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
              {user ? (
                <>
                  <span className="text-sm text-gray-700">
                    Olá, {user.displayName || user.email}
                  </span>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-2 btn-secondary"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sair</span>
                  </button>
                </>
              ) : (
                <Link href="/login" className="btn-primary">
                  Entrar
                </Link>
              )}
              <button className="relative p-2">
                <ShoppingCart className="h-6 w-6 text-gray-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Loja PetLoc
              </h1>
              <p className="text-gray-600">
                Produtos de qualidade para o seu pet com entrega rápida e segura.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <Link href="/dashboard" className="btn-primary">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Meu Painel
              </Link>
              {user && (
                <>
                  <Link href="/admin/produtos/novo" className="btn-success">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Novo Produto
                  </Link>
                  <Link href="/admin/produtos" className="btn-secondary">
                    <Package className="h-4 w-4 mr-2" />
                    Gerenciar Produtos
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="nome">Ordenar por Nome</option>
              <option value="preco-asc">Preço: Menor para Maior</option>
              <option value="preco-desc">Preço: Maior para Menor</option>
              <option value="avaliacao">Melhor Avaliados</option>
            </select>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-5 w-5" />
              <span>Filtros</span>
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todas as categorias</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Product Image */}
              <div className="relative">
                {product.imagem ? (
                  <img
                    src={product.imagem}
                    alt={product.nome}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                    <ShoppingBag className="h-16 w-16 text-green-400" />
                  </div>
                )}
                {product.desconto && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    -{product.desconto}%
                  </div>
                )}
                <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50">
                  <Heart className="h-4 w-4 text-gray-400" />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="mb-2">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    {product.categoria}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.nome}
                </h3>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.descricao}
                </p>

                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.avaliacao)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">
                    ({product.numAvaliacoes})
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {product.desconto ? (
                      <>
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(product.preco * (1 - product.desconto / 100))}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(product.preco)}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(product.preco)}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.marca}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {product.estoque > 0 ? `${product.estoque} em estoque` : 'Fora de estoque'}
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.estoque === 0}
                    className="btn-success disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-600">
              Tente ajustar os filtros ou termos de busca.
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 bg-green-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Não encontrou o que procura?
          </h2>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Entre em contato conosco! Temos uma ampla variedade de produtos e podemos
            ajudar a encontrar exatamente o que seu pet precisa.
          </p>
          <Link href="/contato" className="btn-primary text-lg px-8 py-3">
            Fale Conosco
          </Link>
        </div>
      </div>
    </div>
  );
}
