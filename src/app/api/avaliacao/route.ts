import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


/**
 * @swagger
 * /api/avaliacoes:
 *   post:
 *     summary: Cria uma nova avaliação de psicólogo
 *     description: Registra a avaliação de um psicólogo, incluindo notas de áudio, vídeo, experiência geral, avaliação profissional e comentário opcional.
 *     tags:
 *       - Avaliações
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - audio
 *               - video
 *               - experienciaGeral
 *               - avaliacaoProfissional
 *               - psicologoId
 *             properties:
 *               audio:
 *                 type: number
 *                 description: Nota do áudio (0 a 5)
 *                 example: 4
 *               video:
 *                 type: number
 *                 description: Nota do vídeo (0 a 5)
 *                 example: 5
 *               experienciaGeral:
 *                 type: number
 *                 description: Nota da experiência geral (0 a 5)
 *                 example: 4
 *               avaliacaoProfissional:
 *                 type: number
 *                 description: Nota da avaliação profissional do psicólogo (0 a 5)
 *                 example: 5
 *               comentario:
 *                 type: string
 *                 description: Comentário opcional sobre a avaliação
 *                 example: "Excelente atendimento e didática."
 *               psicologoId:
 *                 type: string
 *                 description: ID do psicólogo avaliado
 *                 example: "clv123456789"
 *     responses:
 *       201:
 *         description: Avaliação criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "clv987654321"
 *                 audio:
 *                   type: number
 *                   example: 4
 *                 video:
 *                   type: number
 *                   example: 5
 *                 experienciaGeral:
 *                   type: number
 *                   example: 4
 *                 avaliacaoProfissional:
 *                   type: number
 *                   example: 5
 *                 comentario:
 *                   type: string
 *                   example: "Excelente atendimento e didática."
 *                 psicologoId:
 *                   type: string
 *                   example: "clv123456789"
 *       400:
 *         description: Campos obrigatórios inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Campos obrigatórios inválidos."
 *       500:
 *         description: Erro interno ao criar avaliação.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro interno ao criar avaliação."
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      audio,
      video,
      experienciaGeral,
      avaliacaoProfissional,
      comentario,
      psicologoId,
    } = body;

    // Validação básica
    if (
      typeof audio !== "number" ||
      typeof video !== "number" ||
      typeof experienciaGeral !== "number" ||
      typeof avaliacaoProfissional !== "number" ||
      typeof psicologoId !== "string"
    ) {
      return NextResponse.json(
        { error: "Campos obrigatórios inválidos." },
        { status: 400 }
      );
    }

    const novaAvaliacao = await prisma.avaliacao.create({
      data: {
        audio,
        video,
        experienciaGeral,
        avaliacaoProfissional,
        comentario,
        psicologoId,
      },
    });

    return NextResponse.json(novaAvaliacao, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar avaliação:", error);
    return NextResponse.json(
      { error: "Erro interno ao criar avaliação." },
      { status: 500 }
    );
  }
}
