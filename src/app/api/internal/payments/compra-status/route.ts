
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/dist/server/api-utils";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("userId");
    const paymentId = searchParams.get("paymentId");

    if (!userId || !paymentId) {
      return NextResponse.json(
        { error: "Parâmetros 'userId' e 'paymentId' são obrigatórios." },
        { status: 400 }
      );
    }

    const compra = await prisma.compra.findFirst({
      where: {
        userId: userId,
        paymentId: paymentId,
      },
      select: {
        Status: true,
        id: true,
        createdAt: true,
        updatedAt: true,
        qtdCreditos: true,
      },
    });

    if (!compra) {
      return NextResponse.json(
        { error: "Compra não encontrada para os parâmetros fornecidos." },
        { status: 404 }
      );
    }
    // O método redirect não pode ser usado diretamente em rotas de API do Next.js.
    // Se quiser redirecionar, retorne uma resposta com status 307 e o header Location.
    if (compra.Status === 'PENDING' || compra.Status === "PAID") {
    console.log('redirecioanr')
    }
    return NextResponse.json({ status: compra.Status, compra });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao buscar status da compra.", details: String(error) },
      { status: 500 }
      
    );
  }
}


