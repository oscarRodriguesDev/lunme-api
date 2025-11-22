// src/app/api/payments/charge/route.ts
import { NextRequest, NextResponse } from 'next/server';


/**
 * @swagger
 * /api/internal/payments/credit-card:
 *   post:
 *     security:
 *       - BearerAuth: []
 *     summary: Cria uma cobrança via cartão de crédito usando Pagar.me
 *     description: Realiza a criação de uma ordem e pagamento por cartão de crédito diretamente via API do Pagar.me.
 *     tags:
 *       - Interno - Pagamentos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - card_number
 *               - card_holder_name
 *               - card_expiration_date
 *               - card_cvv
 *               - customer
 *               - items
 *             properties:
 *               card_number:
 *                 type: string
 *                 example: "4111111111111111"
 *               card_holder_name:
 *                 type: string
 *                 example: "João da Silva"
 *               card_expiration_date:
 *                 type: string
 *                 example: "1229"
 *               card_cvv:
 *                 type: string
 *                 example: "123"
 *               customer:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "João Silva"
 *                   email:
 *                     type: string
 *                     example: "joao@email.com"
 *                   document:
 *                     type: string
 *                     example: "12345678900"
 *                   address:
 *                     type: object
 *                     properties:
 *                       street:
 *                         type: string
 *                         example: "Rua A"
 *                       number:
 *                         type: string
 *                         example: "123"
 *                       neighborhood:
 *                         type: string
 *                         example: "Centro"
 *                       city:
 *                         type: string
 *                         example: "São Paulo"
 *                       state:
 *                         type: string
 *                         example: "SP"
 *                       zipCode:
 *                         type: string
 *                         example: "01000000"
 *                   phones:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         countryCode:
 *                           type: string
 *                           example: "55"
 *                         areaCode:
 *                           type: string
 *                           example: "11"
 *                         number:
 *                           type: string
 *                           example: "987654321"
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - code
 *                     - quantity
 *                     - unit_price
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "PROD001"
 *                     description:
 *                       type: string
 *                       example: "Créditos de IA"
 *                     quantity:
 *                       type: integer
 *                       example: 1
 *                     unit_price:
 *                       type: number
 *                       example: 1990
 *     responses:
 *       200:
 *         description: Pagamento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 order:
 *                   type: object
 *                   example:
 *                     id: "ord_123"
 *                     status: "paid"
 *                     amount: 1990
 *       400:
 *         description: Dados incompletos ou inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Dados incompletos"
 *       500:
 *         description: Erro interno ao criar cobrança
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao processar pagamento."
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { card_number, card_holder_name, card_expiration_date, card_cvv, customer, items } = body;

    if (!customer || !items || !card_number || !card_holder_name || !card_expiration_date || !card_cvv) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    // 1️⃣ Calcular valor total
    const totalAmount = items.reduce(
      (sum: number, i: any) => sum + (i.unit_price || i.price) * i.quantity,
      0
    );

    // 2️⃣ Criar order direto
    // 2️⃣ Criar order direto
const orderData = {
  customer: {
    ...customer,
    address: {
      ...customer.address,
      zip_code: customer.address.zipCode, // converter para snake_case
      country: "BR"
    },
    phones: {
      mobile_phone: customer.phones[0] // assume que mandou um array com 1 telefone
        ? {
            country_code: customer.phones[0].countryCode,
            area_code: customer.phones[0].areaCode,
            number: customer.phones[0].number
          }
        : undefined
    },
    metadata: {}
  },
  items: items.map((i: any) => ({
    code: i.code,
    description: i.description || i.title || "Produto",
    quantity: i.quantity,
    amount: i.unit_price || i.price // campo certo é "amount"
  })),
  payments: [
    {
      payment_method: "credit_card",
      credit_card: {
        installments: 1,
        statement_descriptor: "MINHA LOJA",
        card: {
          number: card_number,
          holder_name: card_holder_name,
          exp_month: card_expiration_date.substring(0, 2),
          exp_year: "20" + card_expiration_date.substring(2, 4),
          cvv: card_cvv
        }
      }
    }
  ],
  closed: true
};


    const orderResponse = await fetch("https://api.pagar.me/core/v5/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${process.env.PAGARME_API_KEY}:`).toString("base64")}`,
      },
      body: JSON.stringify(orderData),
    });

    const orderText = await orderResponse.text();
    let orderResult;
    try {
      orderResult = JSON.parse(orderText);
    } catch {
      console.error("Resposta da order não é JSON:", orderText);
      return NextResponse.json({ error: "Falha ao criar order", raw: orderText }, { status: 500 });
    }

    if (!orderResponse.ok) {
      console.error("Erro ao criar order:", orderResult);
      return NextResponse.json({ error: orderResult }, { status: orderResponse.status });
    }

    return NextResponse.json({ success: true, order: orderResult });
  } catch (err: any) {
    console.error("Erro na rota /payments/charge:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


/**
 * @swagger
 * /api/internal/payments/credit-card:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     summary: Teste de funcionamento da API de pagamentos
 *     description: Retorna uma mensagem simples indicando que a API está ativa.
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
 *                   example: "API de pagamentos está funcionando!"
 */

export async function GET() {
  return NextResponse.json({ message: "API de pagamentos está funcionando!" });
}
