  'use client';

  import { useEffect } from 'react';
  import { useRouter } from 'next/navigation';
  import Link from 'next/link';
  import { Heart, ShoppingBag, Users, Search } from 'lucide-react';
  import { useAuth } from '@/hooks/useAuth';

  export default function Home() {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
      // Verificar se usuário já está logado
      if (!loading && user) {
        router.push('/dashboard');
      }
    }, [user, loading, router]);

    return (
      <div className="min-h-screen">
        {/* Navigation */}
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="flex items-center space-x-2">
                  <Heart className="h-8 w-8 text-blue-600" />
                  <span className="text-xl font-bold text-gray-900">PetLoc</span>
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/login" className="btn-primary">
                  Entrar
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="hero">
          <div className="max-w-4xl mx-auto">
            <h1 className="animate-fade-in">Encontre seu Pet Perdido</h1>
            <p className="animate-slide-in">
              Conecte-se com a comunidade pet, compre produtos para seu amigo de quatro patas
              e ajude a reunir famílias com seus animais perdidos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login" className="btn-primary text-lg px-8 py-3">
                Começar Agora
              </Link>
              <Link href="/pets-perdidos" className="btn-success text-lg px-8 py-3">
                Ver Pets Perdidos
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Tudo que você precisa para seu pet
              </h2>
              <p className="text-xl text-gray-600">
                Uma plataforma completa para donos de pets responsáveis
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Pets Perdidos */}
              <div className="card text-center">
                <div className="flex justify-center mb-4">
                  <Search className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Pets Perdidos</h3>
                <p className="text-gray-600 mb-4">
                  Ajude a reunir famílias com seus animais perdidos através da nossa comunidade.
                </p>
                <Link href="/pets-perdidos" className="btn-primary w-full">
                  Ver Pets Perdidos
                </Link>
              </div>

              {/* Loja */}
              <div className="card text-center">
                <div className="flex justify-center mb-4">
                  <ShoppingBag className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Loja Online</h3>
                <p className="text-gray-600 mb-4">
                  Produtos de qualidade para seu pet com entrega rápida e segura.
                </p>
                <Link href="/loja" className="btn-success w-full">
                  Ir às Compras
                </Link>
              </div>

              {/* Comunidade */}
              <div className="card text-center">
                <div className="flex justify-center mb-4">
                  <Users className="h-12 w-12 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Comunidade</h3>
                <p className="text-gray-600 mb-4">
                  Conecte-se com outros donos de pets, compartilhe experiências e dicas.
                </p>
                <Link href="/comunidade" className="btn-primary w-full">
                  Participar
                </Link>
              </div>

              {/* Login */}
              <div className="card text-center">
                <div className="flex justify-center mb-4">
                  <Heart className="h-12 w-12 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Conta PetLoc</h3>
                <p className="text-gray-600 mb-4">
                  Crie sua conta e tenha acesso a todas as funcionalidades da plataforma.
                </p>
                <Link href="/login" className="btn-success w-full">
                  Criar Conta
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-600 text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Pronto para começar sua jornada com a PetLoc?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Junte-se a milhares de donos de pets que já fazem parte da nossa comunidade.
            </p>
            <Link href="/login" className="btn-success text-lg px-8 py-3">
              Criar Conta Gratuita
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Heart className="h-6 w-6 text-blue-400" />
                  <span className="text-lg font-bold">PetLoc</span>
                </div>
                <p className="text-gray-400">
                  Conectando donos de pets com amor e responsabilidade.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Plataforma</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/pets-perdidos" className="hover:text-white">Pets Perdidos</Link></li>
                  <li><Link href="/loja" className="hover:text-white">Loja</Link></li>
                  <li><Link href="/comunidade" className="hover:text-white">Comunidade</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Suporte</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/ajuda" className="hover:text-white">Ajuda</Link></li>
                  <li><Link href="/contato" className="hover:text-white">Contato</Link></li>
                  <li><Link href="/termos" className="hover:text-white">Termos de Uso</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Redes Sociais</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white">
                    <span className="sr-only">Facebook</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <span className="sr-only">Instagram</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C8.396 0 7.609.043 6.298.099 4.987.155 4.042.31 3.298.61c-.828.32-1.532.75-2.24 1.46C.35 2.78.12 3.484 0 4.312c-.3.754-.455 1.7-.51 3.01C-.067 8.633-.11 9.42-.11 13.041c0 3.621.043 4.408.099 5.719.055 1.31.21 2.255.51 3.01.19.754.75 1.532 1.46 2.24.708.708 1.486 1.268 2.24 1.46.755.3 1.7.455 3.01.51 1.31.055 2.097.098 5.719.098 3.621 0 4.408-.043 5.719-.098 1.31-.055 2.255-.21 3.01-.51.754-.19 1.532-.75 2.24-1.46.708-.708 1.268-1.486 1.46-2.24.3-.755.455-1.7.51-3.01.055-1.31.098-2.097.098-5.719 0-3.621-.043-4.408-.098-5.719-.055-1.31-.21-2.255-.51-3.01-.19-.754-.75-1.532-1.46-2.24C21.22.35 20.516.12 19.688 0c-.754-.3-1.7-.455-3.01-.51C16.408-.067 15.621-.11 12-.11zm0 2.28c3.578 0 4.002.013 5.414.06 1.302.043 2.008.22 2.476.37.566.18 1.037.42 1.498.88.46.46.7 1.032.88 1.498.15.468.327 1.174.37 2.476.047 1.412.06 1.836.06 5.414s-.013 4.002-.06 5.414c-.043 1.302-.22 2.008-.37 2.476-.18.566-.42 1.037-.88 1.498-.46.46-1.032.7-1.498.88-.468.15-1.174.327-2.476.37-1.412.047-1.836.06-5.414.06s-4.002-.013-5.414-.06c-1.302-.043-2.008-.22-2.476-.37-.566-.18-1.037-.42-1.498-.88-.46-.46-.7-1.032-.88-1.498-.15-.468-.327-1.174-.37-2.476C2.013 16.043 2 15.619 2 12.041s.013-4.002.06-5.414c.043-1.302.22-2.008.37-2.476.18-.566.42-1.037.88-1.498.46-.46 1.032-.7 1.498-.88.468-.15 1.174-.327 2.476-.37C7.615 2.293 8.039 2.28 12.017 2.28zm0 17.722c-3.753 0-6.806-3.053-6.806-6.806s3.053-6.806 6.806-6.806 6.806 3.053 6.806 6.806-3.053 6.806-6.806 6.806zm0-11.632c-2.56 0-4.638 2.078-4.638 4.638s2.078 4.638 4.638 4.638 4.638-2.078 4.638-4.638-2.078-4.638-4.638-4.638zm6.406-2.98c-.883 0-1.6.717-1.6 1.6s.717 1.6 1.6 1.6 1.6-.717 1.6-1.6-.717-1.6-1.6-1.6z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 PetLoc. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }
