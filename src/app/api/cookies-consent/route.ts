import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";


/**
 * @swagger
 * /api/cookies-consent:
 *   get:
 *     summary: Busca consentimento do usuário pelo IP
 *     description: >
 *       Retorna o consentimento do usuário baseado no IP do cliente.
 *       Se o consentimento tiver mais de 30 dias, será removido e retornará erro.
 *     tags:
 *       - Consentimento
 *     responses:
 *       200:
 *         description: Consentimento encontrado e válido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "clv987654321"
 *                 ipNumber:
 *                   type: string
 *                   example: "192.168.0.1"
 *                 data:
 *                   type: string
 *                   description: Data do consentimento
 *                   example: "26/08/2025"
 *                 hora:
 *                   type: string
 *                   description: Hora do consentimento
 *                   example: "14:35"
 *                 nome:
 *                   type: string
 *                   example: "João Silva"
 *                 cpf:
 *                   type: string
 *                   example: "123.456.789-00"
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
 *         description: Erro interno ao buscar consentimento.
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
 *   delete:
 *     summary: Remove consentimento do usuário pelo IP
 *     description: Deleta todos os registros de consentimento associados ao IP do cliente.
 *     tags:
 *       - Consentimento
 *     responses:
 *       200:
 *         description: Consentimento deletado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Erro interno ao tentar deletar o consentimento.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao deletar consentimento"
 */

export async function DELETE(req: Request) {
  try {
    const prisma = new PrismaClient();
    
    // Obtém o IP do cliente
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ipNumber = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';
    
    // Deleta o consentimento do banco de dados
    await prisma.cookies_consent.deleteMany({
      where: {
        ipNumber: ipNumber
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao deletar consentimento' },
      { status: 500 }
    );
  }
}


/**
 * @swagger
 * /api/cookies-consent/accept:
 *   post:
 *     summary: Registra aceitação de cookies
 *     description: Salva o consentimento do usuário, incluindo IP, data, hora e se aceitou as permissões.
 *     tags:
 *       - Consentimento
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
 *                 description: Indica se o usuário aceitou os cookies
 *                 example: true
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 description: Data e hora do consentimento
 *                 example: "2025-08-26T14:35:00Z"
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
 *       500:
 *         description: Erro ao salvar consentimento.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao salvar consentimento"
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
