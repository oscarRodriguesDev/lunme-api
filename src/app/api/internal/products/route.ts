import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
/* 
// Criar um novo produto
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { codigo, titulo, descricao, preco, valorUn, quantidade } = body;

    if (!codigo || !titulo || !descricao || preco == null || valorUn == null || quantidade == null) {
        console.log(body);
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    // Verifica se já existe produto com o mesmo código
    const exists = await prisma.produto.findUnique({ where: { codigo } });
    if (exists) {
      return NextResponse.json({ error: "Código de produto já cadastrado" }, { status: 409 });
    }

    const produto = await prisma.produto.create({
      data: {
        codigo,
        titulo,
        descricao,
        preco,
        valorUn,
        quantidade,
      },
    });

    return NextResponse.json(produto, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

 */



export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { codigo, titulo, descricao, preco, valorUn, quantidade } = body;

    // Checagem de campos obrigatórios (descricao pode ser opcional)
    if (
      !codigo ||
      !titulo ||
      preco === undefined ||
      valorUn === undefined ||
      quantidade === undefined
    ) {
      return NextResponse.json(
        { error: "Campos obrigatórios ausentes" },
        { status: 400 }
      );
    }

    // Verifica se já existe produto com o mesmo código
    const exists = await prisma.produto.findUnique({ where: { codigo } });
    if (exists) {
      return NextResponse.json(
        { error: "Código de produto já cadastrado" },
        { status: 409 }
      );
    }

    // Cria o produto
    const produto = await prisma.produto.create({
      data: {
        codigo,
        titulo,
        descricao: descricao ?? "",
        preco: Number(preco),
        valorUn: Number(valorUn),
        quantidade: Number(quantidade),
      },
    });

    return NextResponse.json(produto, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error?.message || "Erro ao cadastrar produto" },
      { status: 500 }
    );
  }
}


// Recuperar todos os produtos
export async function GET() {
  try {
    const produtos = await prisma.produto.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Opcional: formatar os dados se precisar
    const produtosFormatados = produtos.map((p) => ({
      id: p.id,
      codigo: p.codigo,
      titulo: p.titulo,
      descricao: p.descricao,
      preco: Number(p.preco),
      valorUn: Number(p.valorUn),
      quantidade: Number(p.quantidade),
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return NextResponse.json(produtosFormatados, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}




// Editar um produto existente
export async function PUT(req: Request) {
    try {
      const body = await req.json();
      const { id, codigo, titulo, descricao, preco, valorUn, quantidade } = body;
  
      if (
        !id ||
        !codigo ||
        !titulo ||
        !descricao ||
        preco === undefined ||
        valorUn === undefined ||
        quantidade === undefined
      ) {
        console.log(body);
        return NextResponse.json(
          { error: "Envie todos os dados para edição do produto" },
          { status: 400 }
        );
      }
  
      const produto = await prisma.produto.update({
        where: { id },
        data: {
          codigo,
          titulo,
          descricao,
          preco,
          valorUn,
          quantidade,
        },
      });
  
      return NextResponse.json(produto, { status: 200 });
    } catch (err: any) {
      console.error(err);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }


// Deletar um produto
export async function DELETE(req: Request) {
    try {
      const url = new URL(req.url);
      const codigo = url.searchParams.get("codigo");
  
      if (!codigo) {
        return NextResponse.json({ error: "Código do produto é obrigatório" }, { status: 400 });
      }
  
      await prisma.produto.delete({
        where: { codigo },
      });
  
      return NextResponse.json({ success: true });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }
  