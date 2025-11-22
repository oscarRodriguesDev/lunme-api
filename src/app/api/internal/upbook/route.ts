import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"



interface Livro {
  id: string
  resumo: string
}




const prisma = new PrismaClient()
/**
 * @swagger
 * /api/internal/upbook:
 *   post:
 *     security:
 *       - BearerAuth: []
 *     summary: Cria um novo livro científico
 *     description: Adiciona um livro à base científica, vinculando opcionalmente a um psicólogo.
 *     tags:
 *       - Interno - Livros
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - autor
 *               - resumo
 *             properties:
 *               name:
 *                 type: string
 *                 description: Título do livro
 *                 example: "Psicologia Moderna"
 *               psicologoId:
 *                 type: string
 *                 description: ID do psicólogo associado (opcional)
 *                 example: "abc123"
 *               autor:
 *                 type: string
 *                 description: Nome do autor
 *                 example: "Sigmund Freud"
 *               url_capa:
 *                 type: string
 *                 description: URL da imagem de capa (opcional)
 *                 example: "https://example.com/capa.jpg"
 *               resumo:
 *                 type: string
 *                 description: Resumo do livro
 *                 example: "Este livro explora os conceitos fundamentais da psicologia moderna."
 *
 *     responses:
 *       201:
 *         description: Livro criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 psicologoId:
 *                   type: string
 *                 autor:
 *                   type: string
 *                 url_capa:
 *                   type: string
 *                 resumo:
 *                   type: string
 *
 *       400:
 *         description: Campos obrigatórios ausentes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Título, autor e resumo são obrigatórios"
 *
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro interno no servidor"
 */

export async function POST(req: Request) {
    try {
      const body = await req.json()
      const { name, psicologoId, autor, url_capa, resumo } = body;
      if (!name || !autor || !resumo ) {
        console.error("ou resumo ou autor ou titulo faltou")
        console.log(name, autor, resumo)
        return NextResponse.json(
          { error: 'Título, autor e resumo são obrigatórios' },
          { status: 400 }
        );
      }
      const novoLivro = await prisma.base_cientific.create({
        data: {
          name,
          psicologoId,
          autor,
          url_capa,
          resumo,
        },
      });
      return NextResponse.json(novoLivro, { status: 201 });
    } catch (error: any) {
      console.error('Erro ao criar livro:', error);
      return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
    }
  }
  

  
  //busca os livros de um psicologo
  /**
 * @swagger
 * /api/internal/upbook:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     summary: Lista livros científicos de um psicólogo
 *     description: Retorna todos os livros científicos associados a um psicólogo específico.
 *     tags:
 *       - Interno - Livros
 *     parameters:
 *       - in: query
 *         name: psicologoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do psicólogo
 *     responses:
 *       200:
 *         description: Lista de livros retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   psicologoId:
 *                     type: string
 *                   autor:
 *                     type: string
 *                   url_capa:
 *                     type: string
 *                   resumo:
 *                     type: string
 *       400:
 *         description: Parâmetro obrigatório ausente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Parâmetro 'psicologoId' é obrigatório"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro interno do servidor"
 */

  export async function GET(req: Request) {
    try {
      // Extrai psicologoId da query string
      const { searchParams } = new URL(req.url);
      const psicologoId = searchParams.get("psicologoId");
  
      if (!psicologoId) {
        return NextResponse.json(
          { error: "Parâmetro 'psicologoId' é obrigatório" },
          { status: 400 }
        );
      }
  
      // Busca no banco todos os livros com psicologoId
      const livros = await prisma.base_cientific.findMany({
        where: { psicologoId },
      });
  
      return NextResponse.json(livros, { status: 200 });
    } catch (error) {
  return NextResponse.json('error', { status: 500 });
    }
  }
  
/**
 * @swagger
 * /api/internal/upbook:
 *   delete:
 *     security:
 *       - BearerAuth: []
 *     summary: Deleta um livro científico pelo ID
 *     description: Remove um livro específico do banco de dados usando seu ID.
 *     tags:
 *       - Interno - Livros
 *     parameters:
 *       - in: query
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do livro a ser deletado
 *     responses:
 *       200:
 *         description: Livro deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Livro deletado com sucesso"
 *       400:
 *         description: Parâmetro obrigatório ausente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Parâmetro 'bookId' é obrigatório"
 *       404:
 *         description: Livro não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Livro não encontrado"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro interno no servidor"
 */

  export async function DELETE(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const bookId = searchParams.get("bookId");

      if (!bookId) {
        return NextResponse.json(
          { error: "Parâmetro 'bookId' é obrigatório" },
          { status: 400 }
        );
      }

      // Tenta deletar o livro pelo id
      const deleted = await prisma.base_cientific.delete({
        where: { id: bookId },
      });

      return NextResponse.json({ message: "Livro deletado com sucesso" }, { status: 200 });
    } catch (error: any) {
      // Se o livro não for encontrado, Prisma lança um erro
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Livro não encontrado" },
          { status: 404 }
        );
      }
      console.error("Erro ao deletar livro:", error);
      return NextResponse.json(
        { error: "Erro interno no servidor" },
        { status: 500 }
      );
    }
  }