import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/internal/products:
 *   post:
 *     summary: Cadastra um novo produto
 *     description: Cria um produto com código, título, descrição, preço, valor unitário e quantidade.
 *     tags:
 *       - Interno - Produtos
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codigo
 *               - titulo
 *               - preco
 *               - valorUn
 *               - quantidade
 *             properties:
 *               codigo:
 *                 type: string
 *                 example: "PROD001"
 *               titulo:
 *                 type: string
 *                 example: "Curso de Psicologia"
 *               descricao:
 *                 type: string
 *                 example: "Curso avançado de psicologia clínica"
 *               preco:
 *                 type: number
 *                 example: 150.0
 *               valorUn:
 *                 type: number
 *                 example: 150.0
 *               quantidade:
 *                 type: number
 *                 example: 10
 *
 *     responses:
 *       201:
 *         description: Produto cadastrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "prod_123456"
 *                 codigo:
 *                   type: string
 *                 titulo:
 *                   type: string
 *                 descricao:
 *                   type: string
 *                 preco:
 *                   type: number
 *                 valorUn:
 *                   type: number
 *                 quantidade:
 *                   type: number
 *
 *       400:
 *         description: Campos obrigatórios ausentes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Campos obrigatórios ausentes"
 *
 *       409:
 *         description: Código de produto já cadastrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Código de produto já cadastrado"
 *
 *       500:
 *         description: Erro interno ao cadastrar produto.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao cadastrar produto"
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
/**
 * @swagger
 * /api/internal/products:
 *   get:
 *     summary: Lista todos os produtos
 *     description: Retorna todos os produtos cadastrados, ordenados do mais recente para o mais antigo.
 *     tags:
 *       - Interno - Produtos
 *
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "prod_123456"
 *                   codigo:
 *                     type: string
 *                     example: "PROD001"
 *                   titulo:
 *                     type: string
 *                     example: "Curso de Psicologia"
 *                   descricao:
 *                     type: string
 *                     example: "Curso avançado de psicologia clínica"
 *                   preco:
 *                     type: number
 *                     example: 150.0
 *                   valorUn:
 *                     type: number
 *                     example: 150.0
 *                   quantidade:
 *                     type: number
 *                     example: 10
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *
 *       500:
 *         description: Erro interno ao listar produtos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao listar produtos"
 */

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
/**
 * @swagger
 * /api/internal/products:
 *   put:
 *     summary: Atualiza um produto existente
 *     description: Atualiza os dados de um produto cadastrado com base no ID fornecido.
 *     tags:
 *       - Interno - Produtos
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - codigo
 *               - titulo
 *               - descricao
 *               - preco
 *               - valorUn
 *               - quantidade
 *             properties:
 *               id:
 *                 type: string
 *                 example: "prod_123456"
 *               codigo:
 *                 type: string
 *                 example: "PROD001"
 *               titulo:
 *                 type: string
 *                 example: "Curso de Psicologia"
 *               descricao:
 *                 type: string
 *                 example: "Curso avançado de psicologia clínica"
 *               preco:
 *                 type: number
 *                 example: 150.0
 *               valorUn:
 *                 type: number
 *                 example: 150.0
 *               quantidade:
 *                 type: number
 *                 example: 10
 *
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 codigo:
 *                   type: string
 *                 titulo:
 *                   type: string
 *                 descricao:
 *                   type: string
 *                 preco:
 *                   type: number
 *                 valorUn:
 *                   type: number
 *                 quantidade:
 *                   type: number
 *
 *       400:
 *         description: Dados incompletos para atualização.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Envie todos os dados para edição do produto"
 *
 *       500:
 *         description: Erro interno ao atualizar produto.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao atualizar produto"
 */

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
/**
 * @swagger
 * /api/internal/products:
 *   delete:
 *     summary: Remove um produto
 *     description: Deleta um produto existente a partir do código informado como parâmetro de query.
 *     tags:
 *       - Interno - Produtos
 *
 *     parameters:
 *       - in: query
 *         name: codigo
 *         schema:
 *           type: string
 *         required: true
 *         description: Código do produto a ser deletado
 *
 *     responses:
 *       200:
 *         description: Produto removido com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *       400:
 *         description: Código do produto não fornecido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Código do produto é obrigatório"
 *
 *       500:
 *         description: Erro interno ao deletar produto.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao deletar produto"
 */

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
  