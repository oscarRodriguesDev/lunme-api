/**
 * NextResponse é utilizado para criar respostas HTTP no padrão Next.js API Route (App Router).
 * Permite retornar JSON, redirecionamentos, manipular headers, etc.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/route-handlers#the-responseredirect-helper
 */
import { NextResponse } from "next/server";

/**
 * PrismaClient é o client do ORM Prisma para realizar consultas e transações com o banco de dados.
 * Recomendado criar apenas uma instância por execução, especialmente em ambientes serverless.
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client
 */
import { PrismaClient } from "@prisma/client";

/**
 * Instância única do Prisma Client.
 * Evite recriar em cada requisição em ambientes como Vercel (serverless).
 */
const prisma = new PrismaClient();


/**
 * Handler da rota GET para buscar um usuário por ID via query string.
 *
 * @param {Request} req - Objeto de requisição HTTP padrão do Next.js (App Router).
 * @returns {Promise<NextResponse>} Retorna o objeto do usuário em formato JSON ou um erro com o status apropriado.
 *
 * Fluxo:
 * - Extrai o parâmetro `id` da URL.
 * - Valida se o `id` foi fornecido.
 * - Busca o usuário no banco de dados usando Prisma.
 * - Retorna:
 *   - 200 com os dados do usuário, se encontrado.
 *   - 400 se o ID não for fornecido.
 *   - 404 se o usuário não for encontrado.
 *   - 500 em caso de erro interno.
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
 * Handler da rota PUT para atualizar os dados de um usuário.
 *
 * @param {Request} req - Objeto de requisição HTTP contendo os dados no corpo da requisição (JSON).
 * @returns {Promise<NextResponse>} Retorna o usuário atualizado em formato JSON ou uma mensagem de erro com o status apropriado.
 *
 * Fluxo:
 * - Extrai o `id` e os dados a serem atualizados do corpo da requisição.
 * - Valida se o `id` foi fornecido.
 * - Verifica se o usuário com o `id` especificado existe.
 * - Atualiza os campos do usuário com os dados recebidos.
 * - Retorna:
 *   - 200 com os dados do usuário atualizado.
 *   - 400 se o ID não for fornecido.
 *   - 404 se o usuário não for encontrado.
 *   - 500 em caso de erro interno.
 */


export async function PUT(req:Request) {
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

