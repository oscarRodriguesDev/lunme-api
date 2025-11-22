// src/app/api/payments/charge/route.ts
import { NextRequest, NextResponse } from 'next/server';



/**
 * @swagger
 * /api/internal/payments/pix:
 *   post:
 *     security:
 *       - BearerAuth: []
 *     summary: Cria uma cobrança PIX via Pagar.me
 *     description: Gera uma ordem de pagamento PIX no Pagar.me e retorna o QR Code e dados da transação.
 *     tags:
 *       - Interno - Pagamentos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer:
 *                 type: object
 *                 description: Dados do comprador
 *                 properties:
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   document:
 *                     type: string
 *                     description: CPF do cliente
 *                   address:
 *                     type: object
 *                     properties:
 *                       street:
 *                         type: string
 *                       number:
 *                         type: string
 *                       neighborhood:
 *                         type: string
 *                       city:
 *                         type: string
 *                       state:
 *                         type: string
 *                       zipCode:
 *                         type: string
 *                   phones:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         countryCode:
 *                           type: string
 *                         areaCode:
 *                           type: string
 *                         number:
 *                           type: string
 *
 *               items:
 *                 type: array
 *                 description: Lista de produtos ou créditos
 *                 items:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     description:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                     unit_price:
 *                       type: number
 *                     price:
 *                       type: number
 *             required:
 *               - customer
 *               - items
 *     responses:
 *       200:
 *         description: PIX criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 order:
 *                   type: object
 *                   description: Retorno completo da API da Pagar.me
 *
 *       400:
 *         description: Dados ausentes ou inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *
 *       500:
 *         description: Erro interno ao gerar o PIX
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer, items } = body;

    if (!customer || !items || !items.length) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    const totalAmount = items.reduce(
      (sum: number, i: any) => sum + (i.unit_price || i.price) * 1 * i.quantity,
      0
    );

    const orderData = {
      customer: {
        ...customer,
        address: {
          ...customer.address,
          zip_code: customer.address.zipCode,
          country: "BR",
        },
        phones: {
          mobile_phone: customer.phones?.[0]
            ? {
                country_code: customer.phones[0].countryCode,
                area_code: customer.phones[0].areaCode,
                number: customer.phones[0].number,
              }
            : undefined,
        },
        metadata: {},
      },
      items: items.map((i: any) => ({
        code: i.code,
        description: i.description || i.title || "Produto",
        quantity: i.quantity,
        amount: (i.unit_price || i.price),//por enquanto
      })),
      payments: [
        {
          payment_method: "pix",
          amount: totalAmount,
          pix: { expires_in: 3600 }, // 1 hora
        },
      ],
      environment: "production",
      //closed:false // obrigatório para teste PIX
    };

    const orderResponse = await fetch("https://api.pagar.me/core/v5/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${process.env.PAGARME_API_KEY}:`).toString(
          "base64"
        )}`,
      },
      body: JSON.stringify(orderData),
    });

    const orderResult = await orderResponse.json();
    

    if (!orderResponse.ok) {
      return NextResponse.json({ error: orderResult }, { status: orderResponse.status });
    }

    return NextResponse.json({ success: true, order: orderResult });
  } catch (err: any) {
    console.error("Erro na rota api/internal/payments/pix:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

 




/**
 * @swagger
 * /api/internal/payments/pix:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     summary: Verifica se a API de pagamentos está funcionando
 *     description: Retorna uma mensagem simples confirmando o funcionamento da API.
 *     tags:
 *       - Interno - Pagamentos
 *     responses:
 *       200:
 *         description: API funcionando corretamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: API de pagamentos está funcionando!
 */

export async function GET() {
  return NextResponse.json({ message: "API de pagamentos está funcionando!" });
}
