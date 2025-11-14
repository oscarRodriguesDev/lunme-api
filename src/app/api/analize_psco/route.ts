import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


/**
 * @swagger
 * /api/pre-psicologos:
 *   post:
 *     summary: Pré-cadastro de psicólogo
 *     description: Realiza o pré-cadastro de um psicólogo no sistema. O psicólogo ainda não estará habilitado até que seja aprovado por um administrador.
 *     tags:
 *       - Psicólogos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cpf
 *               - crp
 *               - nome
 *               - lastname
 *               - rg
 *               - email
 *               - data_nasc
 *               - celular
 *               - telefone
 *             properties:
 *               cpf:
 *                 type: string
 *                 example: "12345678900"
 *               cfp:
 *                 type: string
 *                 example: "CFP123456"
 *               crp:
 *                 type: string
 *                 example: "CRP12345"
 *               nome:
 *                 type: string
 *                 example: "João"
 *               lastname:
 *                 type: string
 *                 example: "Silva"
 *               rg:
 *                 type: string
 *                 example: "1234567"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "joao.silva@email.com"
 *               data_nasc:
 *                 type: string
 *                 format: date
 *                 example: "1990-05-20"
 *               celular:
 *                 type: string
 *                 example: "(11) 99999-9999"
 *               telefone:
 *                 type: string
 *                 example: "(11) 2222-3333"
 *     responses:
 *       201:
 *         description: Pré-cadastro realizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Pré-cadastro realizado com sucesso!"
 *                 data:
 *                   type: object
 *                   description: Dados do psicólogo pré-cadastrado
 *       400:
 *         description: Falha de validação — campos obrigatórios ausentes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Todos os campos são obrigatórios!"
 *       409:
 *         description: Conflito — CPF ou CFP já cadastrados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "CPF ou CFP já cadastrado!"
 *       500:
 *         description: Erro interno do servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro interno do servidor!"
 */


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cpf, cfp, crp, nome, rg, email, data_nasc, celular, telefone,lastname } = body;

    if (!cpf || !crp || !nome || !rg || !email || !data_nasc || !celular || !telefone||!lastname) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios!" }, { status: 400 });
    }
    const newPrePsicologo = await prisma.prePsicologo.create({
      data: {
        cpf,
        cfp,
        crp,
        nome,
        lastname,
        rg,
        email,
        data_nasc,
        celular,
        telefone,
        //habilitado define que o psicologo ainda não foi habilitado no sistema
       habilitado:false
      },
    });
    //retorno caso sucesso
    return NextResponse.json({ message: "Pré-cadastro realizado com sucesso!", data: newPrePsicologo }, { status: 201 });

  } catch (error: any) {
    //aqui tem que manter o console
    console.error("Erro ao cadastrar:", error);

    // Tratamento para erro de duplicação de CPF ou CFP
    if (error.code === "P2002") {
      return NextResponse.json({ error: "CPF ou CFP já cadastrado!" }, { status: 409 });
    }

    return NextResponse.json({ error: "Erro interno do servidor!" }, { status: 500 });
  }
}









