# Configuração do Firebase no Next.js - PetLoc

Este guia mostra como configurar o Firebase no seu projeto Next.js PetLoc.

## 📋 Pré-requisitos

- Conta Google/Firebase
- Projeto Next.js (já configurado)
- Node.js instalado

## 🚀 Passos para Configuração

### 1. Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Criar um projeto" ou "Add project"
3. Dê um nome ao projeto (ex: `petloc-firebase`)
4. Configure o Google Analytics (opcional)
5. Clique em "Criar projeto"

### 2. Configurar Authentication

1. No menu lateral, clique em "Authentication"
2. Vá para a aba "Sign-in method"
3. Ative os provedores desejados:
   - Email/Password
   - Google (opcional)
   - Outros conforme necessário

### 3. Configurar Firestore Database

1. No menu lateral, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de teste" (para desenvolvimento)
4. Selecione uma localização para o banco

### 4. Configurar Storage (opcional)

1. No menu lateral, clique em "Storage"
2. Clique em "Começar"
3. Configure as regras de segurança

### 5. Obter Configurações do Firebase

1. Clique no ícone de engrenagem ⚙️ > "Configurações do projeto"
2. Role para baixo até "Seus apps"
3. Clique no ícone `</>` para adicionar um app web
4. Registre o app com um nome (ex: `petloc-web`)
5. Copie as configurações do SDK

### 6. Configurar Variáveis de Ambiente

1. Abra o arquivo `.env.local` no seu projeto
2. Substitua as configurações pelas suas:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD... (sua api key)
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=petloc-firebase.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=petloc-firebase
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=petloc-firebase.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABCDEF1234
```

### 7. Instalar Firebase

```bash
npm install firebase
```

### 8. Configurar Firebase no Projeto

O arquivo `src/lib/firebase.ts` já está configurado com todas as importações necessárias.

### 9. Usar os Hooks Personalizados

#### Autenticação:
```tsx
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, login, register, logout } = useAuth();

  // Use os métodos conforme necessário
}
```

#### Firestore:
```tsx
import { useFirestore } from '@/hooks/useFirestore';

function MyComponent() {
  const { data, loading, addItem, updateItem, deleteItem } = useFirestore('pets');

  // data contém todos os documentos da coleção 'pets'
}
```

#### Storage:
```tsx
import { useStorage } from '@/hooks/useStorage';

function MyComponent() {
  const { uploadFile, uploading, progress } = useStorage();

  const handleUpload = async (file: File) => {
    const url = await uploadFile(file, `images/${file.name}`);
    console.log('Arquivo enviado:', url);
  };
}
```

### 10. Configurar AuthProvider

No seu `layout.tsx` ou `_app.tsx`, envolva sua aplicação:

```tsx
import { AuthProvider } from '@/hooks/useAuth';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

## 📁 Estrutura de Arquivos Criada

```
src/
├── lib/
│   └── firebase.ts          # Configuração do Firebase
├── hooks/
│   ├── useAuth.ts          # Hook de autenticação
│   ├── useFirestore.ts     # Hook para Firestore
│   └── useStorage.ts       # Hook para Storage
├── components/
│   ├── FirebaseAuth.tsx    # Componente de auth
│   └── ui/
│       ├── Button.tsx      # Componente Button
│       └── Input.tsx       # Componente Input
```

## 🔧 Configurações de Segurança

### Firestore Rules (firestore.rules):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura/escrita para usuários autenticados
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Storage Rules (storage.rules):
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=*} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🎯 Funcionalidades Disponíveis

- ✅ Autenticação com Email/Senha
- ✅ Gerenciamento de estado de usuário
- ✅ CRUD em tempo real com Firestore
- ✅ Upload de arquivos para Storage
- ✅ Hooks personalizados para facilitar uso
- ✅ Componentes UI reutilizáveis

## 🚨 Observações Importantes

1. **Variáveis de Ambiente**: Nunca commite o arquivo `.env.local` no Git
2. **Regras de Segurança**: Configure regras apropriadas para produção
3. **Tipos TypeScript**: Os hooks incluem tipagem completa
4. **Real-time**: Firestore atualiza automaticamente os componentes

## 🐛 Troubleshooting

### Erro: "Cannot find module 'firebase'"
- Verifique se instalou: `npm install firebase`

### Erro: "Firebase config not found"
- Verifique se as variáveis de ambiente estão corretas no `.env.local`

### Erro: "Auth context not found"
- Certifique-se de envolver a app com `AuthProvider`

Agora você tem o Firebase completamente configurado no seu projeto Next.js! 🎉
