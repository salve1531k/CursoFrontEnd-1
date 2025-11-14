// app/api/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const { email, password, nome } = await request.json();

    if (!email || !password || !nome) {
      return NextResponse.json(
        { message: 'Nome, email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Atualizar o perfil do usuário com o nome
    await updateProfile(user, {
      displayName: nome
    });

    return NextResponse.json({
      message: 'Conta criada com sucesso',
      user: {
        id: user.uid,
        nome: nome,
        email: user.email
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Erro no registro:', error);
    
    // Tratamento de erros específicos do Firebase
    if (error.code === 'auth/email-already-in-use') {
      return NextResponse.json(
        { message: 'Este email já está em uso' },
        { status: 409 }
      );
    }
    
    if (error.code === 'auth/weak-password') {
      return NextResponse.json(
        { message: 'Senha muito fraca' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}