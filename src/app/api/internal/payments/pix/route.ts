// src/app/api/payments/charge/route.ts
import { NextRequest, NextResponse } from 'next/server';



/* 
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer, items } = body;

    if (!customer || !items) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    // 1️⃣ Calcular valor total
    const totalAmount = items.reduce(
      (sum: number, i: any) => sum + (i.unit_price || i.price) * i.quantity,
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
        amount: (i.unit_price || i.price) * 1,
      })),
      payments: [
        {
          payment_method: "pix",
          amount: totalAmount,
          pix: {
            expires_in: 3600
          }
        }
      ],
      closed: false,
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
    console.error("Erro na rota /payments/pix:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

 */

// /pages/api/internal/payments/pix.ts


//função que estava dando certo

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

 





// Método GET apenas para testar se a API está funcionando
export async function GET() {
  return NextResponse.json({ message: "API de pagamentos está funcionando!" });
}
