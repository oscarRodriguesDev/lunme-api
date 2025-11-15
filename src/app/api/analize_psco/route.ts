import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


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









