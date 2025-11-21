import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";


/**
 * @swagger
 * /api/cookies-consent:
 *   get:
 *     summary: Verifica se o usuário já deu consentimento para cookies.
 *     description: Retorna o registro de consentimento baseado no IP do cliente. Se estiver expirado (mais de 30 dias), o registro é removido e retornado 404.
 *     tags:
 *       - uso de cookies
 *     parameters:
 *       - in: header
 *         name: x-forwarded-for
 *         required: false
 *         description: IP real do usuário (usado quando a aplicação está atrás de proxy).
 *         schema:
 *           type: string
 *           example: "201.22.31.45"
 *     responses:
 *       200:
 *         description: Consentimento encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "clxyzc12345"
 *                 ipNumber:
 *                   type: string
 *                   example: "201.22.31.45"
 *                 data:
 *                   type: string
 *                   example: "17/11/2025"
 *       404:
 *         description: Consentimento não encontrado ou expirado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Consentimento não encontrado"
 *       500:
 *         description: Erro ao buscar consentimento.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao buscar consentimento"
 */

export async function GET(req: Request) {
  try {
    const prisma = new PrismaClient();
    
    // Obtém o IP do cliente
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ipNumber = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';
    
    const consent = await prisma.cookies_consent.findFirst({
      where: {
        ipNumber: ipNumber,
      },
    });

    // Se não encontrar o consentimento, retorna 404
    if (!consent) {
      return NextResponse.json(
        { error: 'Consentimento não encontrado' },
        { status: 404 }
      );
    }

    // Verifica se o consentimento está desatualizado (mais de 30 dias)
    const consentDate = new Date(consent.data.split('/').reverse().join('-'));
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - consentDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 30) {
      // Remove o consentimento antigo
      await prisma.cookies_consent.delete({
        where: {
          id: consent.id // Usando o ID do consentimento para garantir a exclusão correta
        }
      });
      return NextResponse.json(
        { error: 'Consentimento expirado' },
        { status: 404 }
      );
    }

    return NextResponse.json(consent);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar consentimento' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/cookies-consent:
 *   post:
 *     summary: Registra o consentimento de cookies do usuário.
 *     description: Armazena no banco o consentimento baseado no IP do cliente, junto com data, hora e status (aceito ou não).
 *     tags:
 *       - uso de cookies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accepted
 *               - timestamp
 *             properties:
 *               accepted:
 *                 type: boolean
 *                 example: true
 *                 description: Indica se o usuário aceitou os cookies.
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-11-17T23:59:00.000Z"
 *                 description: Momento exato do consentimento.
 *     responses:
 *       200:
 *         description: Consentimento salvo com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Corpo da requisição inválido.
 *       500:
 *         description: Erro interno ao salvar consentimento.
 */

export async function POST(req: Request) {
  try {
    const prisma = new PrismaClient();
    const { accepted, timestamp } = await req.json();
    
    // Obtém o IP do cliente
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ipNumber = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';
    
    // Formata a data e hora
    const data = new Date(timestamp).toLocaleDateString('pt-BR');
    const hora = new Date(timestamp).toLocaleTimeString('pt-BR');
    
    // Salva no banco de dados
    await prisma.cookies_consent.create({
      data: {
        ipNumber,
        data,
        Hora: hora,
        permissão: accepted
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao salvar consentimento' },
      { status: 500 }
    );
  }
}
