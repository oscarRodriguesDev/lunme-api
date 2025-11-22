// app/api/internal/history/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/internal/history:
 *   post:
 *     security:
 *       - BearerAuth: []
 *     summary: Adiciona um registro ao histórico de um psicólogo
 *     description: Cria um novo registro no histórico de um psicólogo, com descrição, tipo e timestamp.
 *     tags:
 *       - Interno - Histórico
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - psicologoId
 *               - descricao
 *             properties:
 *               psicologoId:
 *                 type: string
 *                 example: "psico_98765"
 *               descricao:
 *                 type: string
 *                 example: "Consulta realizada com sucesso"
 *               tipo:
 *                 type: string
 *                 example: "geral"
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-11-20T14:30:00Z"
 *
 *     responses:
 *       201:
 *         description: Histórico criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "hist_123456"
 *                 psicologoId:
 *                   type: string
 *                 descricao:
 *                   type: string
 *                 tipo:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *
 *       400:
 *         description: Parâmetros obrigatórios não informados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "psicologoId e descricao são obrigatórios"
 *
 *       500:
 *         description: Erro interno ao salvar histórico.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro interno ao salvar histórico"
 *                 details:
 *                   type: string
 *                   example: "Mensagem de erro detalhada do servidor"
 */

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

/**
 * @swagger
 * /api/internal/history:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     summary: Lista o histórico de um psicólogo
 *     description: Retorna todos os registros do histórico de um psicólogo, ordenados do mais recente para o mais antigo.
 *     tags:
 *       - Interno - Histórico
 *
 *     parameters:
 *       - in: query
 *         name: psicologoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do psicólogo cujos registros serão retornados.
 *
 *     responses:
 *       200:
 *         description: Histórico retornado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "hist_123456"
 *                   psicologoId:
 *                     type: string
 *                   descricao:
 *                     type: string
 *                     example: "Consulta realizada com sucesso"
 *                   tipo:
 *                     type: string
 *                     example: "geral"
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-11-20T14:30:00Z"
 *
 *       400:
 *         description: Parâmetro psicologoId não informado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "psicologoId é obrigatório"
 *
 *       500:
 *         description: Erro ao buscar histórico.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao buscar histórico"
 */

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

/**
 * @swagger
 * /api/internal/history:
 *   delete:
 *     security:
 *       - BearerAuth: []
 *     summary: Deleta um registro do histórico de um psicólogo
 *     description: Remove um registro do histórico com base no ID fornecido.
 *     tags:
 *       - Interno - Histórico
 *
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do registro de histórico a ser deletado.
 *
 *     responses:
 *       200:
 *         description: Histórico deletado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Histórico deletado com sucesso"
 *
 *       400:
 *         description: ID do histórico não informado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "ID do histórico é obrigatório"
 *
 *       500:
 *         description: Erro ao deletar o histórico.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao deletar histórico"
 */

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
