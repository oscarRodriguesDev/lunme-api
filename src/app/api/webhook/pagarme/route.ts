// app/api/webhooks/pagarme/route.ts
import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();





//funçã opara entrega de credito
async function EntregaCredito(transactionId: string) {
  try {
    // Busca a compra no banco de dados usando o transactionId (que é o paymentId da compra)
    const compra = await prisma.compra.findFirst({
      where: { paymentId: transactionId },
      select: { id: true, userId: true, qtdCreditos: true, Status: true },
    });

    if (!compra) {
      console.error("Compra não encontrada para entrega de créditos. paymentId:", transactionId);
      return { success: false, error: "Compra não encontrada." };
    }

    if (compra.Status === "entregue" || compra.qtdCreditos === null) {
      console.warn("Créditos já entregues ou compra inválida para entrega. paymentId:", transactionId);
      return { success: false, error: "Créditos já entregues ou compra inválida." };
    }

    // Busca o usuário para atualizar os créditos
    const comprador = await prisma.user.findUnique({
      where: { id: compra.userId },
      select: { creditos: true },
    });

    if (!comprador) {
      console.error("Usuário não encontrado para entrega de créditos. userId:", compra.userId);
      return { success: false, error: "Usuário não encontrado." };
    }

    // Soma os créditos
    const creditosAtuais = Number(comprador.creditos) || 0;
    const creditosAdicionar = Number(compra.qtdCreditos) || 0;
    const novoCredito = creditosAtuais + creditosAdicionar;

    // Atualiza o saldo de créditos do usuário
    await prisma.user.update({
      where: { id: compra.userId },
      data: { creditos:String(novoCredito) },
    });

    // Marca a compra como entregue e zera qtdCreditos
    await prisma.compra.update({
      where: { id: compra.id },
      data: { Status: "entregue", qtdCreditos: null },
    });

    return { success: true, message: "Créditos entregues com sucesso." };
  } catch (error) {
    console.error("Erro ao entregar créditos:", error);
    return { success: false, error: "Erro ao entregar créditos." };
  }
}




//função para atualizar compra
async function atualizarStatusCompra(transactionId: string, status: "PENDING" | "FAILED" | "PAID"|'PROCESSING'|'entregue') {
  // Atualiza o status da compra no banco de dados
  try {
    const compra = await prisma.compra.update({
      where: { id: transactionId },
      data: { Status: status.toLowerCase() }, // salva como "pending", "failed" ou "paid"
    });
    return { success: true, compra };
  } catch (error) {
    console.error("Erro ao atualizar status da compra:", error);
    return { success: false, error: "Erro ao atualizar status da compra." };
  }
}



/**
 * @swagger
 * /api/webhook/pagarme:
 *   post:
 *     summary: Webhook de eventos do Pagar.me
 *     description: |
 *       Endpoint que recebe e processa eventos de pagamento enviados pelo Pagar.me.  
 *       A autenticação é feita via Basic Auth utilizando credenciais definidas em variáveis de ambiente.
 *
 *     tags:
 *       - pagarme 
 *     
 *
 *     security:
 *       - basicAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Corpo enviado pelo Pagar.me contendo o tipo de evento e dados da ordem.
 *             properties:
 *               type:
 *                 type: string
 *                 example: "order.paid"
 *               data:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "ord_12345"
 *                   charges:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         last_transaction:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               example: "tran_987654"
 *
 *     responses:
 *       200:
 *         description: Webhook recebido e processado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 received:
 *                   type: boolean
 *                   example: true
 *
 *       401:
 *         description: Autenticação falhou (Basic Auth incorreto).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *
 *       400:
 *         description: Erro ao processar o webhook.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Webhook error"
 *
 * components:
 *   securitySchemes:
 *     basicAuth:
 *       type: http
 *       scheme: basic
 */

export async function POST(req: NextRequest) {
  try {
 
    const auth = req.headers.get("authorization");
    const expected = "Basic " +
      Buffer.from(
        process.env.PAGARME_WEBHOOK_USER + ":" + process.env.PAGARME_WEBHOOK_PASSWORD
      ).toString("base64");

    if (!auth || auth !== expected) {
      console.warn("⚠️ Acesso não autorizado ao webhook");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    

    // -----------------------------
    // Log dos headers (opcional, para debug)
    // -----------------------------
    console.log("Webhook chamado, headers:", JSON.stringify([...req.headers]));

    const body = await req.json();
    const event = body.type;


     console.log("evento: ", event);
    switch (event) {
      case  "order.paid":
        console.log("✅ Pagamento aprovado:", body.data.id); 
        // Supondo que o ID da transação está em body.data.charges[0].last_transaction.id
        let ordem1 = body.data?.id; // Pega o id da ordem (order)
        const result1 = await atualizarStatusCompra(ordem1, "PAID");
        await  EntregaCredito(ordem1) 
     
        break;
      case "order.payment_failed":
        console.log("❌ Pagamento recusado:", body.data.id);
        const transactionId2 = body.data?.id;
        const result2 = await atualizarStatusCompra(transactionId2, "FAILED");
        //preciso redirecionar o usuario para a pagina de creditos aqui
        
        break;
      case "order.payment_processing":
        const transactionId3 = body.data?.id;
        const result3 = await atualizarStatusCompra(transactionId3, "PROCESSING");
        console.log("⏳ Pagamento em processamento:", body.data.id);
        break;
      case "order.payment.canceled":
        const transactionId4 = body.data?.id;
        const result4 = await atualizarStatusCompra(transactionId4, "FAILED");
        console.log("⚠️ Pedido cancelado:", body.data.id);
        break;
        case 'order.payment.pending':
        const transactionId5 = body.data?.id;
        const result5 = await atualizarStatusCompra(transactionId5, "PENDING");
        console.log("⏳ Pagamento pendente:", body.data.id);
        break;
      default:
        console.log("Evento ignorado:", event);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Erro no webhook:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}



/**
 * @swagger
 * /api/webhook/pagarme:
 *   get:
 *     summary: Verifica o status do webhook
 *     description: Retorna uma mensagem confirmando que o endpoint do webhook está ativo e funcionando corretamente.
 *     tags:
 *       - pagarme
 *
 *     responses:
 *       200:
 *         description: Webhook respondendo corretamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Webhook ativo e funcionando!"
 */


export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "Webhook ativo e funcionando!" });
}

