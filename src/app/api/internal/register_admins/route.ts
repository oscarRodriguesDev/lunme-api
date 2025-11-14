import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Extraindo os dados do corpo da requisição
    const { name, email, password, confirmPassword,role,vinculo_admin } = await req.json();

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
        vinculo_admin: vinculo_admin, //vinculo com outro user admin não obrigatorio
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
