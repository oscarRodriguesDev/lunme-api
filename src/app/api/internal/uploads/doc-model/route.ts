import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { modelRM, modelDC, modelPP, modelLP, modelRP, modelAP } from "@/app/util/documents";


const prisma = new PrismaClient();

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


//delete
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
