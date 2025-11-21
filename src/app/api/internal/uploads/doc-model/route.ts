import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { modelRM, modelDC, modelPP, modelLP, modelRP, modelAP } from "@/app/util/documents";


const prisma = new PrismaClient();


/**
 * @swagger
 * /api/internal/uploads/doc-model:
 *   post:
 *     summary: Cria um novo modelo de documento
 *     description: Registra um novo model_doc vinculado a um psicólogo, contendo nome, prompt e ferramenta utilizada.
 *     tags:
 *       - Interno - files and uploads
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - psicologoId
 *               - prompt
 *               - tool
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Modelo de Anamnese"
 *               psicologoId:
 *                 type: string
 *                 example: "clxyz123abc"
 *               prompt:
 *                 type: string
 *                 example: "Gere uma anamnese estruturada com base nas respostas do paciente."
 *               tool:
 *                 type: string
 *                 example: "gpt-4o"
 *
 *     responses:
 *       201:
 *         description: Documento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 id: "clzy987asd"
 *                 name: "Modelo de Anamnese"
 *                 psicologoId: "clxyz123abc"
 *                 prompt: "Gere uma anamnese estruturada..."
 *                 tool: "gpt-4o"
 *                 createdAt: "2025-01-01T12:00:00.000Z"
 *                 updatedAt: "2025-01-01T12:00:00.000Z"
 *
 *       400:
 *         description: Falha de validação (campos obrigatórios ausentes)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Campos obrigatórios: name, psicologoId, prompt"
 *
 *       500:
 *         description: Erro interno no servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro interno no servidor"
 */

export async function POST(req: Request) {
  try {
    const { name, psicologoId, prompt,tool } = await req.json()

    if (!name || !psicologoId || !prompt||!tool) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: name, psicologoId, prompt' },
        { status: 400 }
      )
    }

    const novoDoc = await prisma.model_doc.create({
      data: {
        name,
        psicologoId,
        prompt,
        tool,
      },
    })

    return NextResponse.json(novoDoc, { status: 201 })
  } catch (error: any) {
    console.error('Erro ao criar documento:', error)
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 })
  }
}

// mock local (pode mover pra outro arquivo depois)
const Relatorios = (idP: string) => [
  {
    id: "1",
    name: "RM",
    psicologoId: idP,
    prompt: modelRM,
    tool: 'Relatório Multiprofissional'
  },
  {
    id: "2",
    name: "PP",
    psicologoId: idP,
    prompt: modelPP,
    tool: 'Parecer Psicológico'
  },
  {
    id: "3",
    name: "LP",
    psicologoId: idP,
    prompt: modelLP,
    tool: 'Laudo Psicológico'
  },
  {
    id: "4",
    name: "DC",
    psicologoId: idP,
    prompt: modelDC,
    tool: 'Declaração'
  },
  {
    id: "5",
    name: "RP",
    psicologoId: idP,
    prompt: modelRP,
    tool: 'Relatório Psicológico'
  }, {
    id: "6",
    name: "AP",
    psicologoId: idP,
    prompt: modelAP,
    tool: 'Atestado Psicologico'
  }
]


/**
 * @swagger
 * /api/internal/uploads/doc-model:
 *   get:
 *     summary: Lista todos os modelos de documentos do psicólogo
 *     description: Retorna os modelos de documentos salvos no banco e também os modelos mockados carregados automaticamente.
 *     tags:
 *       - Interno - files and uploads
 *
 *     parameters:
 *       - in: query
 *         name: psicologoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do psicólogo
 *         example: "clxyz123abc"
 *
 *     responses:
 *       200:
 *         description: Lista completa de modelos (reais + mock)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *               example:
 *                 - id: "clzw987asd"
 *                   name: "Modelo de Evolução"
 *                   psicologoId: "clxyz123abc"
 *                   prompt: "Gerar evolução com base nas observações..."
 *                   tool: "gpt-4o-mini"
 *                   createdAt: "2025-01-01T12:00:00.000Z"
 *                   updatedAt: "2025-01-01T12:00:00.000Z"
 *                 - id: "mock-1"
 *                   name: "Relatório Inicial"
 *                   psicologoId: "clxyz123abc"
 *                   prompt: "Gerar relatório inicial..."
 *                   tool: "mock"
 *
 *       400:
 *         description: Campo obrigatório ausente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Campo obrigatório: psicologoId"
 *
 *       500:
 *         description: Erro interno no servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro interno no servidor"
 */

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const psicologoId = url.searchParams.get('psicologoId')

    if (!psicologoId) {
      return NextResponse.json(
        { error: 'Campo obrigatório: psicologoId' },
        { status: 400 }
      )
    }

    const docs = await prisma.model_doc.findMany({
      where: { psicologoId },
    })
    const mockDocs = Relatorios(psicologoId)
    // Se não houver documentos, usa os mockados
    if (!docs || docs.length === 0) {

      return NextResponse.json(mockDocs, { status: 200 })
    }
    const todosDocs = [...docs, ...mockDocs]
    // Retorna os docs do banco normalmente
    return NextResponse.json(todosDocs, { status: 200 })

  } catch (error: any) {
    console.error('Erro ao buscar documentos:', error)
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 }
    )
  }
}


/**
 * @swagger
 * /api/internal/uploads/doc-model:
 *   delete:
 *     summary: Remove um modelo de documento
 *     description: Deleta um registro de modelo de documento pelo ID fornecido.
 *     tags:
 *       - Interno - files and uploads
 *
 *     parameters:
 *       - in: query
 *         name: docId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do documento a ser deletado
 *         example: "clzw987asd123"
 *
 *     responses:
 *       200:
 *         description: Documento removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Documento deletado com sucesso"
 *
 *       400:
 *         description: Campo obrigatório não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Campo obrigatório: docId"
 *
 *       500:
 *         description: Erro interno ao deletar o documento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro interno no servidor"
 */

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url)
    const docId = url.searchParams.get('docId')

    if (!docId) {
      return NextResponse.json(
        { error: 'Campo obrigatório: docId' },
        { status: 400 }
      )
    }

    const deletedDoc = await prisma.model_doc.delete({
      where: { id: docId },
    })

    return NextResponse.json({ message: 'Documento deletado com sucesso' }, { status: 200 })
  } catch (error: any) {
    console.error('Erro ao deletar documento:', error)
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 })
  }
}
