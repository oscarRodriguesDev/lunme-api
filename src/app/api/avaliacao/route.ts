import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/avaliacao:
 *   post:
 *     summary: Registra uma nova avaliação sobre a reuniãoo e o atendimento
 *     description: >
 *       Permite que um paciente registre uma avaliação contendo notas sobre áudio,
 *       vídeo, experiência geral, avaliação profissional e um comentário opcional.
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
 *                 description: Nota de 1 a 5 referente à qualidade do áudio.
 *               video:
 *                 type: number
 *                 description: Nota de 1 a 5 referente à qualidade do vídeo.
 *               experienciaGeral:
 *                 type: number
 *                 description: Nota geral da experiência.
 *               avaliacaoProfissional:
 *                 type: number
 *                 description: Nota referente ao atendimento profissional.
 *               comentario:
 *                 type: string
 *                 description: Comentários adicionais (opcional).
 *               psicologoId:
 *                 type: string
 *                 description: ID do psicólogo avaliado.
 *           example:
 *             audio: 5
 *             video: 4
 *             experienciaGeral: 5
 *             avaliacaoProfissional: 5
 *             comentario: "Atendimento excelente, muito acolhedor!"
 *             psicologoId: "clt9xpq1f0001x9z9a1cdefg"
 *     responses:
 *       201:
 *         description: Avaliação registrada com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               id: "clt9z03uc0000x9zg9dgd1234"
 *               audio: 5
 *               video: 4
 *               experienciaGeral: 5
 *               avaliacaoProfissional: 5
 *               comentario: "Atendimento excelente, muito acolhedor!"
 *               psicologoId: "clt9xpq1f0001x9z9a1cdefg"
 *               createdAt: "2025-01-01T12:00:00.000Z"
 *       400:
 *         description: Dados enviados inválidos.
 *         content:
 *           application/json:
 *             example:
 *               error: "Campos obrigatórios inválidos."
 *       500:
 *         description: Erro interno ao criar a avaliação.
 *         content:
 *           application/json:
 *             example:
 *               error: "Erro interno ao criar avaliação."
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
