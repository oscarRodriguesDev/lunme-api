// src/app/api/payments/charge/route.ts
import { NextRequest, NextResponse } from 'next/server';

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


// Método GET apenas para testar se a API está funcionando
export async function GET() {
  return NextResponse.json({ message: "API de pagamentos está funcionando!" });
}
