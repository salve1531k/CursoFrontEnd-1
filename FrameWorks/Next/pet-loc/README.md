# PetLoc - Sistema de Localização de Pets

Um sistema completo para localização e cuidado de animais de estimação, desenvolvido com Next.js, TypeScript, Tailwind CSS e MongoDB.

## 🚀 Funcionalidades

### ✅ Implementadas
- **Página Inicial**: Landing page responsiva com navegação
- **Sistema de Autenticação**: Login e registro de usuários
- **Dashboard**: Painel de controle do usuário
- **Pets Perdidos**: Listagem e busca de pets perdidos
- **Loja**: E-commerce para produtos pet
- **Comunidade**: Rede social para donos de pets
- **API Routes**: Endpoints para autenticação
- **Banco de Dados**: Conexão MongoDB com Mongoose
- **Modelos de Dados**: Schemas para User e Pet

### 🔄 Em Desenvolvimento
- Sistema de upload de imagens
- Notificações em tempo real
- Geolocalização para pets perdidos
- Sistema de mensagens
- Integração com veterinários

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB com Mongoose
- **Autenticação**: JWT (JSON Web Tokens)
- **Ícones**: Lucide React
- **Formatação**: ESLint, Prettier

## 📁 Estrutura do Projeto

```
pet-loc/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   └── auth/          # Rotas de autenticação
│   │   ├── comunidade/        # Página da comunidade
│   │   ├── dashboard/         # Dashboard do usuário
│   │   ├── login/             # Página de login
│   │   ├── loja/              # Loja virtual
│   │   ├── pets-perdidos/     # Listagem de pets perdidos
│   │   ├── globals.css        # Estilos globais
│   │   ├── layout.tsx         # Layout raiz
│   │   └── page.tsx           # Página inicial
│   ├── components/            # Componentes reutilizáveis
│   ├── lib/                   # Utilitários e configurações
│   │   └── mongodb.ts         # Conexão com MongoDB
│   └── models/                # Modelos de dados (Mongoose)
│       ├── User.ts            # Schema do usuário
│       └── Pet.ts             # Schema do pet
├── public/                    # Arquivos estáticos
├── package.json               # Dependências
├── tailwind.config.js         # Configuração Tailwind
├── next.config.ts             # Configuração Next.js
├── tsconfig.json              # Configuração TypeScript
└── README.md                  # Este arquivo
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- MongoDB (local ou MongoDB Atlas)
- npm ou yarn

### Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd pet-loc
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   Crie um arquivo `.env.local` na raiz do projeto:
   ```env
   MONGODB_URI=mongodb://localhost:27017/petloc
   JWT_SECRET=sua-chave-secreta-super-segura-aqui
   NEXTAUTH_SECRET=outra-chave-secreta
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Execute o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação**
   Abra [http://localhost:3000](http://localhost:3000) no navegador

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o ESLint

## 🔐 Autenticação

O sistema utiliza JWT para autenticação. As rotas protegidas verificam a presença e validade do token.

### Credenciais de Teste
- Email: `joao@email.com`
- Senha: `123456`

## 🎨 Design System

O projeto utiliza um design system consistente com:
- Cores primárias: Azul (#3b82f6) e Verde (#10b981)
- Tipografia: Inter (Google Fonts)
- Componentes responsivos
- Animações suaves
- Tema claro/escuro (base preparado)

## 📱 Responsividade

A aplicação é totalmente responsiva e otimizada para:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (até 767px)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Contato

Para dúvidas ou sugestões, entre em contato:
- Email: contato@petloc.com
- Site: https://petloc.com

---

**PetLoc** - Conectando pets e suas famílias 💙
