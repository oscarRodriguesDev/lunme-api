import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


/**
 * @swagger
 * /api/register_admins:
 *   post:
 *     summary: Criação de um administrador
 *     description: Endpoint para registrar um administrador no sistema.
 *     tags:
 *       - Administradores
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome completo do administrador
 *                 example: João da Silva
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do administrador
 *                 example: joao@email.com
 *               password:
 *                 type: string
 *                 description: Senha do administrador
 *                 example: 123456
 *               role:
 *                 type: string
 *                 description: Papel do usuário
 *                 enum: [ADMIN, SUPER_ADMIN]
 *                 example: ADMIN
 *     responses:
 *       201:
 *         description: Administrador criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Administrador criado com sucesso
 *       400:
 *         description: Erro de validação nos dados enviados
 *       500:
 *         description: Erro interno do servidor
 */


export async function POST(req: Request) {
  try {
    // Extraindo os dados do corpo da requisição
    const { name, email, password, confirmPassword,role } = await req.json();

    // Verifica se os campos obrigatórios foram fornecidos
    if (!name || !email || !password || !confirmPassword || !role) {
      return NextResponse.json(
        { message: "Nome, email, senha e confirmação de senha são obrigatórios" }, 
        { status: 400 }
      );
    }

    // Verifica se as senhas coincidem
    if (password !== confirmPassword) {
      return NextResponse.json({ message: "As senhas não coincidem" }, { status: 400 });
    }

    // Verifica se o email já está cadastrado
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: "Usuário já cadastrado" }, { status: 400 });
    }

    // Hash da senha antes de salvar
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criação do usuário ADMIN
    const newAdmin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role, // Definindo o papel como ADMIN
      },
    });

    // Resposta de sucesso
    return NextResponse.json(
      { message: "Admin cadastrado com sucesso", user: newAdmin }, 
      { status: 201 }
    );

  } catch (error) {
   
    return NextResponse.json({ message: "Erro ao cadastrar admin" }, { status: 500 });
  }
}
