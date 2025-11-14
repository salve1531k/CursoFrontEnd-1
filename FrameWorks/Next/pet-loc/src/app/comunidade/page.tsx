'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, MessageCircle, Heart, Share2, ThumbsUp, User, Plus } from 'lucide-react';

interface Post {
  id: string;
  autor: {
    nome: string;
    avatar?: string;
  };
  conteudo: string;
  imagem?: string;
  data: string;
  likes: number;
  comentarios: number;
  compartilhamentos: number;
  categoria: string;
}

interface Comentario {
  id: string;
  autor: {
    nome: string;
    avatar?: string;
  };
  conteudo: string;
  data: string;
}

export default function Comunidade() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');

  useEffect(() => {
    // Simular dados de posts da comunidade
    const mockPosts: Post[] = [
      {
        id: '1',
        autor: {
          nome: 'Maria Silva',
          avatar: 'MS'
        },
        conteudo: 'Acabei de adotar esse lindo cãozinho! Ele estava perdido e agora faz parte da família. Obrigada a todos que compartilharam sobre pets perdidos! 🐕❤️',
        imagem: '/api/placeholder/400/300',
        data: '2024-11-12T10:30:00Z',
        likes: 24,
        comentarios: 8,
        compartilhamentos: 3,
        categoria: 'adoção'
      },
      {
        id: '2',
        autor: {
          nome: 'João Santos',
          avatar: 'JS'
        },
        conteudo: 'Alguém viu um gato siamês branco com manchas cinzas na Vila Madalena? Ele fugiu ontem e estou desesperado! Por favor, se alguém tiver alguma informação, entre em contato.',
        data: '2024-11-11T15:45:00Z',
        likes: 12,
        comentarios: 15,
        compartilhamentos: 7,
        categoria: 'perdidos'
      },
      {
        id: '3',
        autor: {
          nome: 'Ana Costa',
          avatar: 'AC'
        },
        conteudo: 'Dicas para cuidar da pelagem do meu cachorro durante o inverno? Ele está com pelos mais secos e quero garantir que ele fique confortável nessa época.',
        data: '2024-11-10T09:20:00Z',
        likes: 18,
        comentarios: 22,
        compartilhamentos: 5,
        categoria: 'cuidados'
      },
      {
        id: '4',
        autor: {
          nome: 'Pedro Oliveira',
          avatar: 'PO'
        },
        conteudo: 'Que alegria! Encontrei o dono do cachorro que estava perdido no parque. Obrigado a todos que compartilharam e ajudaram nessa busca! 🙏',
        imagem: '/api/placeholder/400/300',
        data: '2024-11-09T14:15:00Z',
        likes: 31,
        comentarios: 6,
        compartilhamentos: 12,
        categoria: 'encontrados'
      },
      {
        id: '5',
        autor: {
          nome: 'Carla Mendes',
          avatar: 'CM'
        },
        conteudo: 'Recomendações de produtos na loja PetLoc? Estou procurando uma cama nova para meu gato que está crescendo.',
        data: '2024-11-08T11:00:00Z',
        likes: 9,
        comentarios: 14,
        compartilhamentos: 2,
        categoria: 'produtos'
      }
    ];

    setPosts(mockPosts);
  }, []);

  const categories = [
    { id: 'todos', label: 'Todos', icon: Users },
    { id: 'perdidos', label: 'Pets Perdidos', icon: MessageCircle },
    { id: 'encontrados', label: 'Pets Encontrados', icon: Heart },
    { id: 'adoção', label: 'Adoção', icon: Heart },
    { id: 'cuidados', label: 'Cuidados', icon: Heart },
    { id: 'produtos', label: 'Produtos', icon: Heart }
  ];

  const filteredPosts = selectedCategory === 'todos'
    ? posts
    : posts.filter(post => post.categoria === selectedCategory);

  const handleNewPost = () => {
    if (newPostContent.trim()) {
      const newPost: Post = {
        id: Date.now().toString(),
        autor: {
          nome: 'Você',
          avatar: 'VC'
        },
        conteudo: newPostContent,
        data: new Date().toISOString(),
        likes: 0,
        comentarios: 0,
        compartilhamentos: 0,
        categoria: 'geral'
      };

      setPosts([newPost, ...posts]);
      setNewPostContent('');
      setShowNewPost(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Agora há pouco';
    if (diffInHours < 24) return `Há ${diffInHours}h`;
    return date.toLocaleDateString('pt-BR');
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Comunidade PetLoc
              </h1>
              <p className="text-gray-600">
                Conecte-se com outros amantes de pets, compartilhe experiências e ajude a comunidade.
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={() => setShowNewPost(true)}
                className="btn-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Post
              </button>
            </div>
          </div>
        </div>

        {/* New Post Modal */}
        {showNewPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Criar Novo Post</h2>
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Compartilhe suas experiências, faça perguntas ou ajude outros membros da comunidade..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={6}
              />
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowNewPost(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleNewPost}
                  disabled={!newPostContent.trim()}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Publicar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-sm p-6">
              {/* Post Header */}
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-700">
                    {post.autor.avatar}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">{post.autor.nome}</h3>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{formatDate(post.data)}</span>
                  </div>
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full mt-1 capitalize">
                    {post.categoria}
                  </span>
                </div>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-gray-900 whitespace-pre-wrap">{post.conteudo}</p>
                {post.imagem && (
                  <div className="mt-4">
                    <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">Imagem do post</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-6">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <ThumbsUp className="h-4 w-4" />
                    <span className="text-sm">{post.likes}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm">{post.comentarios}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <Share2 className="h-4 w-4" />
                    <span className="text-sm">{post.compartilhamentos}</span>
                  </button>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum post encontrado
            </h3>
            <p className="text-gray-600">
              Seja o primeiro a compartilhar nesta categoria!
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 bg-purple-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Faça parte da nossa comunidade!
          </h2>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            Junte-se a milhares de amantes de pets que compartilham experiências,
            ajudam na busca de animais perdidos e trocam dicas sobre cuidados.
          </p>
          <Link href="/login" className="btn-primary text-lg px-8 py-3">
            Participar da Comunidade
          </Link>
        </div>
      </div>
    </div>
  );
}
