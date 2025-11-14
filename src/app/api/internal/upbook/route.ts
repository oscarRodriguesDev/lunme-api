import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"



interface Livro {
  id: string
  resumo: string
}




const prisma = new PrismaClient()

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