import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

/**
 * @swagger
 * /api/internal/uploads/my-models:
 *   get:
 *     summary: Lista modelos de documentos
 *     description: Retorna todos os documentos cadastrados. Se for informado um psicologoId, retorna apenas os documentos associados a esse profissional.
 *     tags:
 *       - Interno - Model Docs
 *
 *     parameters:
 *       - in: query
 *         name: psicologoId
 *         required: false
 *         schema:
 *           type: string
 *         description: Filtra os documentos pelo ID do psicólogo
 *         example: "clzw987asd123"
 *
 *     responses:
 *       200:
 *         description: Lista de documentos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "clzw987asd123"
 *                   name:
 *                     type: string
 *                     example: "Relatório clínico"
 *                   prompt:
 *                     type: string
 *                     example: "Gerar relatório detalhado..."
 *                   tool:
 *                     type: string
 *                     example: "openai"
 *                   psicologoId:
 *                     type: string
 *                     example: "abcd1234"
 *                   criado_em:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-01-15T18:23:11.000Z"
 *
 *       500:
 *         description: Erro ao buscar documentos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao buscar documentos"
 */

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const psicologoId = url.searchParams.get('psicologoId')

    let docs

    if (psicologoId) {
      docs = await prisma.model_doc.findMany({
        where: { psicologoId },
        orderBy: { criado_em: 'desc' }
      })
    } else {
      docs = await prisma.model_doc.findMany({
        orderBy: { criado_em: 'desc' }
      })
    }

    return NextResponse.json(docs)
  } catch (err) {
    console.error("Erro ao buscar documentos:", err)
    return NextResponse.json({ error: "Erro ao buscar documentos" }, { status: 500 })
  }
}
