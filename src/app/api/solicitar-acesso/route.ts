
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();


/**
 * @swagger
 * /api/sua-rota:
 *   post:
 *     summary: Realiza o pré-cadastro de um psicólogo
 *     description: Cria um registro preliminar de psicólogo no sistema antes da habilitação completa.
 *     tags:
 *       - Psicólogos
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cpf
 *               - cfp
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
 *                 example: "000000"
 *               crp:
 *                 type: string
 *                 example: "08/000000"
 *               nome:
 *                 type: string
 *                 example: "João"
 *               lastname:
 *                 type: string
 *                 example: "Silva"
 *               rg:
 *                 type: string
 *                 example: "12345678-9"
 *               email:
 *                 type: string
 *                 example: "joao@email.com"
 *               data_nasc:
 *                 type: string
 *                 format: date
 *                 example: "1990-05-20"
 *               celular:
 *                 type: string
 *                 example: "27999999999"
 *               telefone:
 *                 type: string
 *                 example: "2733333333"
 *
 *     responses:
 *       201:
 *         description: Pré-cadastro criado com sucesso.
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
 *                   description: Dados cadastrados do psicólogo.
 *
 *       400:
 *         description: Algum campo obrigatório não foi enviado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Todos os campos são obrigatórios!"
 *
 *       409:
 *         description: CPF ou CRP já cadastrados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "CPF ou CRP já cadastrado!"
 *
 *       500:
 *         description: Erro interno no servidor.
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

    // Tratamento para erro de duplicação de CPF ou CFP
    if (error.code === "P2002") {
      return NextResponse.json({ error: "CPF ou CRP já cadastrado!" }, { status: 409 });
    }

    return NextResponse.json({ error: "Erro interno do servidor!" }, { status: 500 });
  }
}












