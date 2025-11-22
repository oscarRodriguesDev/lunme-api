import { NextResponse } from "next/server";
import { PrismaClient, UserRole } from "@prisma/client";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Realiza login e retorna um JWT
 *     description: Autentica um usuário pelo email e senha, valida permissões e retorna um token JWT válido por 7 dias.
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email cadastrado do usuário
 *                 example: "usuario@clinica.com"
 *               password:
 *                 type: string
 *                 description: Senha do usuário
 *                 example: "minhasenha123"
 *             required:
 *               - email
 *               - password
 *           example:
 *             email: "usuario@clinica.com"
 *             password: "minhasenha123"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso. Retorna informações do usuário e token JWT.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "clu12abc90387xyz"
 *                     name:
 *                       type: string
 *                       example: "João Silva"
 *                     role:
 *                       type: string
 *                       example: "PSYCHOLOGIST"
 *                     email:
 *                       type: string
 *                       example: "usuario@clinica.com"
 *                     crp:
 *                       type: string
 *                       example: "CRP-12/12345"
 *                 token:
 *                   type: string
 *                   description: JWT válido por 7 dias
 *                   example: "eyJhbGciOiJIUzI1..."
 *                 expiresIn:
 *                   type: string
 *                   example: "3h"
 *       400:
 *         description: Email ou senha não enviados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email e senha são obrigatórios."
 *       401:
 *         description: Senha incorreta.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Usuário ou senha incorretos."
 *       403:
 *         description: Usuário sem permissão para acessar o sistema.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Acesso negado: este usuário não tem permissão."
 *       404:
 *         description: Usuário não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Usuário não existe no sistema."
 *       500:
 *         description: Erro inesperado ao autenticar o usuário.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro interno no servidor."
 */

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json(); //chave secreta para key da clinica de psicologia no futuro

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios." },
        { status: 400 }
      );
    }

    // 1. Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não existe no sistema." },
        { status: 404 }
      );
    }

    // 2. Validar senha (bcrypt)
    const isValid = await compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Usuário ou senha incorretos." },
        { status: 401 }
      );
    }

    // 3. Verificar roles permitidos (igual ao NextAuth)
    const allowedRoles = [
      UserRole.ADMIN,
      UserRole.PSYCHOLOGIST,
      UserRole.COMMON,
      UserRole.PISICOLOGO_ADM,
    ];

    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { error: "Acesso negado: este usuário não tem permissão." },
        { status: 403 }
      );
    }

    // 4. Criar JWT com seus dados do token()
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        crp: user.crp ?? null,
        email: user.email,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "3h",
      }
    );

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
        crp: user.crp,
      },
      token,
      expiresIn: "3h",
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
