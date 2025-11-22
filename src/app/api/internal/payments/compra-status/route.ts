
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/dist/server/api-utils";

const prisma = new PrismaClient();


/**
 * @swagger
 * /api/internal/payments/compra-status:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     summary: Consulta o status de uma compra
 *     description: Retorna o status e informações de uma compra específica com base no userId e paymentId.
 *     tags:
 *       - Interno - Pagamentos
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário relacionado à compra
 *       - in: query
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do pagamento gerado no checkout
 *     responses:
 *       200:
 *         description: Status da compra encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "PAID"
 *                 compra:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "4fd872ab91"
 *                     Status:
 *                       type: string
 *                       example: "PAID"
 *                     qtdCreditos:
 *                       type: integer
 *                       example: 20
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
 *                   example: "Parâmetros 'userId' e 'paymentId' são obrigatórios."
 *       404:
 *         description: Compra não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Compra não encontrada para os parâmetros fornecidos."
 *       500:
 *         description: Erro ao consultar status da compra
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao buscar status da compra."
 *                 details:
 *                   type: string
 *                   example: "Error: conexão com banco falhou"
 */

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


