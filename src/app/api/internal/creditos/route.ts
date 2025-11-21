import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


/**
 * @swagger
 * /api/internal/creditos:
 *   get:
 *     summary: Consulta os créditos de um usuário
 *     description: Retorna a quantidade de créditos disponíveis de um usuário específico no sistema.
 *     tags:
 *       - Interno - Creditos
 *
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário que se deseja consultar os créditos.
 *
 *     responses:
 *       200:
 *         description: Créditos retornados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 creditos:
 *                   type: number
 *                   example: 120
 *
 *       400:
 *         description: userId não informado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "userId é obrigatório"
 *
 *       404:
 *         description: Usuário não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Usuário não encontrado"
 *
 *       500:
 *         description: Erro interno ao buscar créditos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro interno ao buscar créditos"
 */

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId é obrigatório" },
        { status: 400 }
      );
    }

    // Busca o usuário e retorna a coluna creditos
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { creditos: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, creditos: user.creditos }, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao buscar créditos do usuário:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar créditos" },
      { status: 500 }
    );
  }
}
