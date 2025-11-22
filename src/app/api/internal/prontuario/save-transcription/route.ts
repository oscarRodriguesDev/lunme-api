import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'chave-muito-secreta-e-segura-32bytes!!'; // 32 bytes
const IV_LENGTH = 16;


const prisma = new PrismaClient();

/**
 * @swagger
 * /api/internal/prontuario/save-transcription:
 *   put:
 *     security:
 *       - BearerAuth: []
 *     summary: Atualiza e concatena uma nova transcription ao prontuário do paciente
 *     description: Busca o prontuário pelo pacienteId e adiciona uma nova entrada de transcription concatenada com as anteriores.
 *     tags:
 *       - Interno - Prontuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pacienteId
 *               - transcription
 *             properties:
 *               pacienteId:
 *                 type: string
 *                 description: ID do paciente associado ao prontuário
 *                 example: "user_123"
 *               transcription:
 *                 type: string
 *                 description: Texto da nova transcrição a ser adicionada
 *                 example: "Paciente relatou melhora no humor após início da medicação."
 *     responses:
 *       200:
 *         description: Transcription atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 pacienteId: "user_123"
 *                 transcription: "Transcrição antiga...\n-- 20/11/2025\nNova transcrição"
 *       400:
 *         description: Erro — parâmetros obrigatórios ausentes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "ID do paciente e transcription são obrigatórios"
 *       404:
 *         description: Prontuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Prontuário não encontrado para o paciente"
 *       500:
 *         description: Erro interno ao atualizar transcription
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro interno ao atualizar transcription"
 */

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { pacienteId, transcription } = body;

    if (!pacienteId || !transcription) {
      return NextResponse.json(
        { error: "ID do paciente e transcription são obrigatórios" },
        { status: 400 }
      );
    }

    // 1. Buscar o prontuário atual
    const prontuarioExistente = await prisma.prontuario.findUnique({
      where: { pacienteId },
      select: { transcription: true },
    });

    if (!prontuarioExistente) {
      return NextResponse.json(
        { error: "Prontuário não encontrado para o paciente" },
        { status: 404 }
      );
    }

    // 2. Concatenar o novo conteúdo com separador (pode ajustar o formato abaixo)
    const novaTranscricao = `${prontuarioExistente.transcription || ''}\n*--${new Date().toLocaleDateString('pt-BR')}\n${transcription}`;

    // 3. Atualizar no banco
    const prontuarioAtualizado = await prisma.prontuario.update({
      where: { pacienteId },
      data: {
        transcription: novaTranscricao,
      },
    });

    return NextResponse.json(prontuarioAtualizado, { status: 200 });

  } catch (error: any) {
    console.error("Erro ao atualizar transcription:", error);
    return NextResponse.json(
      {
        error: "Erro interno ao atualizar transcription",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
