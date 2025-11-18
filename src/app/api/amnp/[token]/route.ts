import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();




/**
 * @swagger
 * /api/amnp/{token}:
 *   get:
 *     summary: Valida o acesso temporário à anamnese por token
 *     description: >
 *       Valida um token temporário de acesso à anamnese.  
 *       O link expira em 10 minutos e só pode ser acessado pelo mesmo IP após o primeiro acesso.
 *     tags:
 *       - Anamnese
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token único de acesso enviado ao paciente.
 *     responses:
 *       200:
 *         description: Acesso autorizado.
 *         content:
 *           application/json:
 *             examples:
 *               permitido:
 *                 summary: Token válido
 *                 value:
 *                   autorizado: true
 *       400:
 *         description: Token não informado.
 *         content:
 *           application/json:
 *             example:
 *               autorizado: false
 *               erro: "Token ausente"
 *       404:
 *         description: Token inexistente no banco.
 *         content:
 *           application/json:
 *             example:
 *               autorizado: false
 *               erro: "Token inválido"
 *       403:
 *         description: Token expirado ou inválido após validações.
 *         content:
 *           application/json:
 *             oneOf:
 *               - example:
 *                   autorizado: false
 *                   erro: "Link expirado (tempo excedido)"
 *               - example:
 *                   autorizado: false
 *                   erro: "Link expirado ou IP diferente"
 *       500:
 *         description: Erro interno no servidor.
 */

export async function GET(req: NextRequest) {
  const token = req.nextUrl.pathname.split("/").pop();
  if (!token) {
    return NextResponse.json({ autorizado: false, erro: "Token ausente" }, { status: 400 });
  }
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "0.0.0.0";
  const registro = await prisma.acessoAnamneseTemp.findUnique({ where: { token } });
  if (!registro) {
    return NextResponse.json({ autorizado: false, erro: "Token inválido" }, { status: 404 });
  }
  const agora = new Date();
  // 🔴 Caso 1: Expirado e nunca acessado
  const expiradoSemUso = !registro.acessado_em &&
    agora.getTime() - new Date(registro.criado_em).getTime() > 10 * 60 * 1000;
  if (expiradoSemUso) {
    await prisma.acessoAnamneseTemp.delete({ where: { token } });
    return NextResponse.json({ autorizado: false, erro: "Link expirado (tempo excedido)" }, { status: 403 });
  }
  // 🟡 Caso 2: Primeiro acesso
  if (!registro.acessado_em) {
    await prisma.acessoAnamneseTemp.update({
      where: { token },
      data: {
        ip,
        acessado_em: agora,
      },
    });
    return NextResponse.json({ autorizado: true });
  }
  // 🟢 Caso 3: Acesso já feito, validar IP e tempo
  const tempoDesdePrimeiroAcesso = agora.getTime() - new Date(registro.acessado_em).getTime();
  const valido = tempoDesdePrimeiroAcesso <= 10 * 60 * 1000;
  if (registro.ip === ip && valido) {
    return NextResponse.json({ autorizado: true });
  }
  // 🔴 Expirado após o primeiro acesso ou IP diferente
  await prisma.acessoAnamneseTemp.delete({ where: { token } });
  return NextResponse.json({ autorizado: false, erro: "Link expirado ou IP diferente" }, { status: 403 });
}


/**
 * @swagger
 * /api/amnp/{token}:
 *   delete:
 *     summary: Remove um registro de acesso temporário à anamnese
 *     description: >
 *       Deleta manualmente um token temporário de acesso à anamnese.  
 *       Usado para revogação imediata do link.
 *     tags:
 *       - Anamnese
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token temporário que será removido.
 *     responses:
 *       200:
 *         description: Registro removido com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               sucesso: true
 *               mensagem: "Registro removido com sucesso"
 *       400:
 *         description: Falta o token na URL.
 *         content:
 *           application/json:
 *             example:
 *               erro: "Token ausente"
 *       404:
 *         description: Nenhum registro corresponde ao token informado.
 *         content:
 *           application/json:
 *             example:
 *               erro: "Registro não encontrado"
 *       500:
 *         description: Erro inesperado ao tentar remover o registro.
 *         content:
 *           application/json:
 *             example:
 *               erro: "Erro interno ao tentar deletar"
 */

export async function DELETE(req: NextRequest) {
  const token = req.nextUrl.pathname.split('/').pop();

  if (!token) {
    return NextResponse.json({ erro: 'Token ausente' }, { status: 400 });
  }

  try {
    const registro = await prisma.acessoAnamneseTemp.findUnique({ where: { token } });

    if (!registro) {
      return NextResponse.json({ erro: 'Registro não encontrado' }, { status: 404 });
    }

    await prisma.acessoAnamneseTemp.delete({ where: { token } });

    return NextResponse.json({ sucesso: true, mensagem: 'Registro removido com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar registro:', error);
    return NextResponse.json({ erro: 'Erro interno ao tentar deletar' }, { status: 500 });
  }
}

 