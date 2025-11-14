import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

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
