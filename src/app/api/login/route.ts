import { NextResponse } from "next/server";
import { PrismaClient, UserRole } from "@prisma/client";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/login:
 *  post:
 * @summary Realiza login do usuário
 * @description Valida email e senha, checa permissões e retorna um token JWT.
 * @tags Autenticação
 *
 * @requestBody
 *   required: true
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         required:
 *           - email
 *           - password
 *         properties:
 *           email:
 *             type: string
 *             format: email
 *             example: "usuario@exemplo.com"
 *           password:
 *             type: string
 *             example: "senhaSegura123"
 *
 * @response 200
 *   description: Login realizado com sucesso
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         properties:
 *           success:
 *             type: boolean
 *             example: true
 *           user:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "clx123456"
 *               name:
 *                 type: string
 *                 example: "Maria Silva"
 *               role:
 *                 type: string
 *                 example: "PSYCHOLOGIST"
 *               email:
 *                 type: string
 *                 example: "maria@exemplo.com"
 *               crp:
 *                 type: string
 *                 nullable: true
 *           token:
 *             type: string
 *             example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *           expiresIn:
 *             type: string
 *             example: "3h"
 *
 * @response 400
 *   description: Campos obrigatórios ausentes
 *
 * @response 401
 *   description: Senha incorreta ou usuário inválido
 *
 * @response 403
 *   description: Usuário sem permissão
 *
 * @response 404
 *   description: Usuário não encontrado
 *
 * @response 500
 *   description: Erro interno no servidor
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
        expiresIn: "7d",
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
