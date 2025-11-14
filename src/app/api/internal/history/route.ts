// app/api/internal/history/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { psicologoId, descricao, tipo, timestamp } = await req.json();

    // Verificações básicas
    if (!psicologoId || !descricao) {
      return NextResponse.json(
        { error: 'psicologoId e descricao são obrigatórios' },
        { status: 400 }
      );
    }

    // Criação no banco
    const historico = await prisma.historico.create({
      data: {
        psicologoId,
        descricao,
        tipo: tipo || 'geral',
        timestamp: timestamp ? new Date(timestamp) : new Date(),
      },
    });

    return NextResponse.json(historico, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao salvar histórico:', error);
    return NextResponse.json(
      { error: 'Erro interno ao salvar histórico', details: error.message },
      { status: 500 }
    );
  }
}


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const psicologoId = searchParams.get('psicologoId');

  if (!psicologoId) {
    return NextResponse.json({ error: 'psicologoId é obrigatório' }, { status: 400 });
  }

  try {
    const historicos = await prisma.historico.findMany({
      where: {
        psicologoId,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    return NextResponse.json(historicos);
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    return NextResponse.json({ error: 'Erro ao buscar histórico' }, { status: 500 });
  }
}


export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const historicoId = searchParams.get('id');

  if (!historicoId) {
    return NextResponse.json({ error: 'ID do histórico é obrigatório' }, { status: 400 });
  }

  try {
    const historico = await prisma.historico.delete({
      where: {
        id: historicoId,
      },
    });

    return NextResponse.json({ message: 'Histórico deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar histórico:', error);
    return NextResponse.json({ error: 'Erro ao deletar histórico' }, { status: 500 });
  }
}
