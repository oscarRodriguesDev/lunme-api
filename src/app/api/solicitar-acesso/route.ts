
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();



/**
 * @swagger
 * /api/pre-psicologo:
 *   post:
 *     summary: Realiza o pré-cadastro de um psicólogo
 *     description: Cria um registro de pré-cadastro para psicólogos. Todos os campos são obrigatórios.
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
 *                 description: CPF do psicólogo
 *                 example: "123.456.789-00"
 *               cfp:
 *                 type: string
 *                 description: CFP do psicólogo
 *                 example: "123456"
 *               crp:
 *                 type: string
 *                 description: CRP do psicólogo
 *                 example: "CRP-12/3456"
 *               nome:
 *                 type: string
 *                 description: Nome do psicólogo
 *                 example: "João"
 *               lastname:
 *                 type: string
 *                 description: Sobrenome do psicólogo
 *                 example: "Silva"
 *               rg:
 *                 type: string
 *                 description: RG do psicólogo
 *                 example: "12.345.678-9"
 *               email:
 *                 type: string
 *                 description: E-mail do psicólogo
 *                 example: "joao.silva@email.com"
 *               data_nasc:
 *                 type: string
 *                 format: date
 *                 description: Data de nascimento do psicólogo
 *                 example: "1980-05-15"
 *               celular:
 *                 type: string
 *                 description: Número de celular
 *                 example: "+55 11 91234-5678"
 *               telefone:
 *                 type: string
 *                 description: Número de telefone fixo
 *                 example: "+55 11 3456-7890"
 *     responses:
 *       201:
 *         description: Pré-cadastro realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Pré-cadastro realizado com sucesso!
 *                 data:
 *                   type: object
 *       400:
 *         description: Campos obrigatórios ausentes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Todos os campos são obrigatórios!
 *       409:
 *         description: CPF ou CRP já cadastrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: CPF ou CRP já cadastrado!
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro interno do servidor!
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












