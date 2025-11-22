import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();






/**
 * @swagger
 * /api/internal/payments/savepay:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     summary: Lista as compras de um usuário
 *     description: Retorna todas as compras associadas a um usuário, ordenadas da mais recente para a mais antiga.
 *     tags:
 *       - Interno - Pagamentos
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário para buscar compras
 *     responses:
 *       200:
 *         description: Compras encontradas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 compras:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       userId:
 *                         type: string
 *                       Status:
 *                         type: string
 *                         example: PAID
 *                       qtdCreditos:
 *                         type: number
 *                         example: 10
 *                       paymentId:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: userId não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: userId é obrigatório
 *       500:
 *         description: Erro interno ao buscar compras
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro interno ao buscar compras
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



/**
 * @swagger
 * /api/internal/payments/savepay:
 *   post:
 *     security:
 *       - BearerAuth: []
 *     summary: Salva uma compra/pagamento no sistema
 *     description: Registra uma nova compra no banco de dados com status e créditos adquiridos.
 *     tags:
 *       - Interno - Pagamentos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID do usuário que realizou a compra
 *               paymentId:
 *                 type: string
 *                 description: ID do pagamento gerado pelo gateway
 *               stats:
 *                 type: string
 *                 description: Status da compra (PENDING, FAILED, PAID)
 *                 example: PENDING
 *               qtdCreditos:
 *                 type: number
 *                 description: Quantidade de créditos adquiridos
 *             required:
 *               - userId
 *               - paymentId
 *     responses:
 *       201:
 *         description: Compra registrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 compra:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     paymentId:
 *                       type: string
 *                     Status:
 *                       type: string
 *                       example: PENDING
 *                     qtdCreditos:
 *                       type: number
 *                       example: 10
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Parâmetros obrigatórios ausentes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "userId e paymentId são obrigatórios"
 *       500:
 *         description: Erro interno ao criar compra
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro interno ao criar compra"
 */

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


/**
 * @swagger
 * /api/internal/payments/savepay:
 *   delete:
 *     security:
 *       - BearerAuth: []
 *     summary: Remove uma compra salva pelo paymentId
 *     description: Deleta todas as compras associadas ao paymentId informado.
 *     tags:
 *       - Interno - Pagamentos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentId:
 *                 type: string
 *                 description: ID do pagamento a ser removido
 *             required:
 *               - paymentId
 *     responses:
 *       200:
 *         description: Compras deletadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 deletedCount:
 *                   type: number
 *                   description: Quantidade de registros removidos
 *                   example: 1
 *       400:
 *         description: paymentId ausente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "paymentId é obrigatório"
 *       404:
 *         description: Nenhuma compra encontrada para o paymentId informado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Nenhuma compra encontrada para esse paymentId"
 *       500:
 *         description: Erro interno ao deletar compra
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro interno ao deletar compra"
 */

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


