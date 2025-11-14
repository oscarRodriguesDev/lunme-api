import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


/**
 * @swagger
 * /api/anamnese/acesso/{token}:
 *   get:
 *     summary: Valida o acesso temporário à anamnese via token
 *     description: >
 *       Este endpoint valida se o acesso à anamnese é autorizado com base em um token temporário.
 *       O token expira em **10 minutos** após a criação ou após o primeiro acesso.  
 *       O acesso só é válido para o mesmo IP que realizou o primeiro acesso.
 *     tags:
 *       - Anamnese
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token único de acesso temporário.
 *     responses:
 *       200:
 *         description: Acesso autorizado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 autorizado:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Token ausente na requisição.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 autorizado:
 *                   type: boolean
 *                   example: false
 *                 erro:
 *                   type: string
 *                   example: "Token ausente"
 *       404:
 *         description: Token não encontrado ou inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 autorizado:
 *                   type: boolean
 *                   example: false
 *                 erro:
 *                   type: string
 *                   example: "Token inválido"
 *       403:
 *         description: Token expirado ou usado em IP diferente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 autorizado:
 *                   type: boolean
 *                   example: false
 *                 erro:
 *                   type: string
 *                   example: "Link expirado ou IP diferente"
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
 * /api/anamnese/acesso/{token}:
 *   delete:
 *     summary: Remove registro de acesso temporário à anamnese
 *     description: Deleta um registro de token de acesso temporário. Útil para invalidar manualmente o link.
 *     tags:
 *       - Anamnese
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token único do registro que será removido.
 *     responses:
 *       200:
 *         description: Registro removido com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *                 mensagem:
 *                   type: string
 *                   example: "Registro removido com sucesso"
 *       400:
 *         description: Token ausente na requisição.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 *                   example: "Token ausente"
 *       404:
 *         description: Registro não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 *                   example: "Registro não encontrado"
 *       500:
 *         description: Erro interno do servidor ao tentar deletar.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 *                   example: "Erro interno ao tentar deletar"
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

 