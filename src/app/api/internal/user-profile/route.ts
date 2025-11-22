
import { NextResponse } from "next/server";


import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();


/**
 * @swagger
 * /api/internal/user-profile:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     summary: Retorna um usuário pelo ID
 *     description: Busca no banco de dados um usuário específico pelo seu ID.
 *     tags:
 *       - Interno - Usuários
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 'ID do usuário a ser consultado'
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "abc123"
 *                 name:
 *                   type: string
 *                   example: "João Silva"
 *                 email:
 *                   type: string
 *                   example: "joao@email.com"
 *                 role:
 *                   type: string
 *                   example: "ADMIN"
 *                 vinculo_admin:
 *                   type: string
 *                   example: "admin123"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-11-19T12:00:00.000Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-11-19T12:00:00.000Z"
 *       400:
 *         description: ID do usuário não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "ID do usuário não fornecido."
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Usuário não encontrado."
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro interno do servidor."
 */

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id"); // Obtém o ID da query string

    if (!id) {
      return NextResponse.json({ error: "ID do usuário não fornecido." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    return NextResponse.json(user); //aqui retorna o usuario
  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}




/**
 * @swagger
 * /api/internal/user-profile:
 *   put:
 *     security:
 *       - BearerAuth: []
 *     summary: Atualiza os dados de um usuário
 *     description: Atualiza as informações de um usuário existente no sistema pelo ID.
 *     tags:
 *       - Interno - Usuários
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID do usuário a ser atualizado
 *               name:
 *                 type: string
 *                 description: Nome do usuário
 *               email:
 *                 type: string
 *                 description: Email do usuário
 *               role:
 *                 type: string
 *                 description: "Papel do usuário. Valores possíveis: ADMIN, PSICOLOGO, PSICOLOGO_ADM, PSYCHOLOGIST, COMMON"
 *               vinculo_admin:
 *                 type: string
 *                 description: ID do usuário administrador vinculado (opcional)
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 id: "abc123"
 *                 name: "João Silva"
 *                 email: "joao@email.com"
 *                 role: "ADMIN"
 *                 vinculo_admin: null
 *                 createdAt: "2025-11-19T12:00:00.000Z"
 *                 updatedAt: "2025-11-19T12:05:00.000Z"
 *       400:
 *         description: ID do usuário não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "ID do usuário é obrigatório."
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Usuário não encontrado."
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro interno do servidor."
 */

export async function PUT(req: Request) {
  try {
    const { id, ...updates } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID do usuário é obrigatório." }, { status: 400 });
    }

    // Verifica se o usuário existe
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    // Atualiza os dados do usuário
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}

