import { NextRequest, NextResponse } from "next/server";


/**
 * @swagger
 * /api/internal/location-verification:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     summary: Consulta o status de pagamento de uma ordem
 *     description: Retorna o status de pagamento de uma ordem consultando a API do Pagar.me.
 *     tags:
 *       - Interno - Pagamentos
 *
 *     parameters:
 *       - in: query
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da ordem a ser consultada no Pagar.me.
 *
 *     responses:
 *       200:
 *         description: Status de pagamento retornado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "paid"
 *                 orderId:
 *                   type: string
 *                   example: "order_123456"
 *                 order:
 *                   type: object
 *                   description: Retorna o objeto completo da ordem conforme API do Pagar.me
 *
 *       400:
 *         description: Parâmetro orderId não informado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "orderId é obrigatório"
 *
 *       500:
 *         description: Erro interno ao consultar status ou chave da API não configurada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro interno ao consultar status"
 */

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId é obrigatório" },
        { status: 400 }
      );
    }

    const apiKey = process.env.PAGARME_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Chave da API Pagar.me não configurada" },
        { status: 500 }
      );
    }

    const pagarmeResponse = await fetch(
      `https://api.pagar.me/core/v5/transactions/${orderId}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          authorization: `Basic ${Buffer.from(apiKey + ":").toString("base64")}`,
        },
      }
    );

    if (!pagarmeResponse.ok) {
      const errText = await pagarmeResponse.text();
      console.error("Erro Pagar.me:", errText);
      return NextResponse.json(
        { error: "Erro ao consultar status no Pagar.me" },
        { status: pagarmeResponse.status }
      );
    }

    const data = await pagarmeResponse.json();

    // 🟢 Extrair status principal
    const charge = data.charges?.[0];
    const lastTransaction = charge?.last_transaction;

    const status = lastTransaction?.status || charge?.status || data.status;

    return NextResponse.json({
      status,      // ex: "waiting_payment" | "paid" | "failed" | "canceled"
      orderId,
      order: data, // retorna tudo também caso precise
    });
  } catch (error) {
    console.error("Erro interno no status de pagamento:", error);
    return NextResponse.json(
      { error: "Erro interno ao consultar status" },
      { status: 500 }
    );
  }
}
