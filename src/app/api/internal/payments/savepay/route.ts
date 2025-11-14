import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();






//retorna as compras do usuario
// GET /api/internal/payments/savepay?userId=...
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
    const compras = await prisma.compra.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, compras }, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao buscar compras:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar compras" },
      { status: 500 }
    );
  }
}



//salvar papgamento salvo
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, paymentId, stats,qtdCreditos } = body;
    if (!userId || !paymentId) {
      return NextResponse.json(
        { error: "userId e paymentId são obrigatórios" },
        { status: 400 }
      );
    }
    // Validar status e definir default
    const validStatuses = ["PENDING", "FAILED", "PAID"];
    const statusToSave =
      typeof stats === "string" && validStatuses.includes(stats.toUpperCase())
        ? stats.toUpperCase()
        : "PENDING";
    console.log("status api", statusToSave);
    // Criar a compra no banco
    const compra = await prisma.compra.create({
      data: {
        userId,
        paymentId,
        Status: statusToSave,
        qtdCreditos,
      },
    });

    return NextResponse.json({ success: true, compra }, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao criar compra:", error);
    return NextResponse.json(
      { error: "Erro interno ao criar compra" },
      { status: 500 }
    );
  }
}


//deletar pagamnto salvo
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { paymentId } = body;

    if (!paymentId) {
      return NextResponse.json(
        { error: "paymentId é obrigatório" },
        { status: 400 }
      );
    }

    // Tenta deletar a compra pelo paymentId
    const deleted = await prisma.compra.deleteMany({
      where: { paymentId },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: "Nenhuma compra encontrada para esse paymentId" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, deletedCount: deleted.count },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erro ao deletar compra:", error);
    return NextResponse.json(
      { error: "Erro interno ao deletar compra" },
      { status: 500 }
    );
  }
}


//recuperar tod