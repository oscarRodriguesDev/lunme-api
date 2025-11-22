import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();


/**
 * @swagger
 * /api/internal/gerar-link-anamnese:
 *   post:
 *     security:
 *       - BearerAuth: []
 *     summary: Gera um link temporário de acesso à anamnese
 *     description: Cria um token temporário para o psicólogo acessar a anamnese de forma segura e retorna o link completo.
 *     tags:
 *       - Interno - Anamnese
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - psicologoId
 *             properties:
 *               psicologoId:
 *                 type: string
 *                 example: "psico_98765"
 *
 *     responses:
 *       201:
 *         description: Link gerado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 link:
 *                   type: string
 *                   example: "https://meusite.com/amnp/psico_98765/123e4567-e89b-12d3-a456-426614174000"
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
 *                   example: "Campos obrigatórios: psicologoId"
 *
 *       500:
 *         description: Erro interno do servidor ao gerar o link.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro interno do servidor"
 */

export async function POST(req: NextRequest) {
  console.log("Recebido POST em /api/internal/gerar-link-anamnese");
  try {
    const {  psicologoId } = await req.json();

    if ( !psicologoId) {
      return NextResponse.json(
        { error: "Campos obrigatórios: psicologoId" },
        { status: 400 }
      );
    }

    const token = randomUUID(); // pode usar nanoid() se preferir

    await prisma.acessoAnamneseTemp.create({
      data: {
        token,
        psicologoId, 
      },
    });

    const link = `${process.env.NEXTAUTH_URL}/amnp/${psicologoId}/${token}`;

    return NextResponse.json({ link }, { status: 201 });
  } catch (error) {
    console.error("Erro ao gerar link:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
