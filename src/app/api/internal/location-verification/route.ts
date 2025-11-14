import { NextRequest, NextResponse } from "next/server";


//verifica o status da ordem no pagarme para pagar quando confirmar o pagamento
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
