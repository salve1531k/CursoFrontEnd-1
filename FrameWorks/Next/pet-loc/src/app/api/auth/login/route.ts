// app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const { email, password, isAdmin } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Verificar se é admin (por enquanto, baseado em email)
    const role = isAdmin || email.includes('admin') ? 'admin' : 'user';

    return NextResponse.json({
      message: 'Login realizado com sucesso',
      user: {
        id: user.uid,
        email: user.email,
        displayName: user.displayName || 'Usuário',
        role: role
      },
      token: 'fake-token-' + user.uid // Adicionando token fake para compatibilidade
    });

  } catch (error: any) {
    console.error('Erro no login:', error);

    // Tratamento de erros específicos do Firebase
    if (error.code === 'auth/invalid-credential') {
      return NextResponse.json(
        { message: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    if (error.code === 'auth/too-many-requests') {
      return NextResponse.json(
        { message: 'Muitas tentativas. Tente novamente mais tarde.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
