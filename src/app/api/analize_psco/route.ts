import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/analise_psco:
 *   post:
 *     summary: Realiza o pré-cadastro de um psicólogo
 *     description: >
 *       Registra um psicólogo em estado preliminar (não habilitado) no sistema,
 *       armazenando todos os dados pessoais e profissionais necessários para análise interna.
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
 *               cfp:
 *                 type: string
 *                 description: Campo opcional adicional
 *               crp:
 *                 type: string
 *               nome:
 *                 type: string
 *               lastname:
 *                 type: string
 *               rg:
 *                 type: string
 *               email:
 *                 type: string
 *               data_nasc:
 *                 type: string
 *                 format: date
 *               celular:
 *                 type: string
 *               telefone:
 *                 type: string
 *           example:
 *             cpf: "12345678900"
 *             cfp: "00011122233"
 *             crp: "08/123456"
 *             nome: "Maria"
 *             lastname: "Souza"
 *             rg: "12345678"
 *             email: "maria@example.com"
 *             data_nasc: "1990-05-12"
 *             celular: "27999999999"
 *             telefone: "2733333333"
 *     responses:
 *       201:
 *         description: Pré-cadastro realizado com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               message: "Pré-cadastro realizado com sucesso!"
 *               data:
 *                 id: "uuid-gerado"
 *                 cpf: "12345678900"
 *                 crp: "08/123456"
 *                 habilitado: false
 *       400:
 *         description: Campos obrigatórios ausentes.
 *         content:
 *           application/json:
 *             example:
 *               error: "Todos os campos são obrigatórios!"
 *       409:
 *         description: Conflito — CPF ou CFP já cadastrados.
 *         content:
 *           application/json:
 *             example:
 *               error: "CPF ou CFP já cadastrado!"
 *       500:
 *         description: Erro interno do servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: "Erro interno do servidor!"
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









