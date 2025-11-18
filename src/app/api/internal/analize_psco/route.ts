
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from 'nodemailer';
import cryptoRandomString from 'crypto-random-string';
import bcrypt from 'bcrypt';


const prisma = new PrismaClient();



export async function GET(req: Request) {
  try {
    // Busca todos os pré-psicólogos no banco
    const prePsicologos = await prisma.prePsicologo.findMany();

    return NextResponse.json({ data: prePsicologos }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor!" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cpf, cfp, crp, nome, rg, email, data_nasc, celular, telefone, lastname } = body;

    if (!cpf || !crp || !nome || !rg || !email || !data_nasc || !celular || !telefone || !lastname) {
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
        habilitado: false
      },
    });
    //retorno caso sucesso
    return NextResponse.json({ message: "Pré-cadastro realizado com sucesso!", data: newPrePsicologo }, { status: 201 });

  } catch (error: any) {
    // Tratamento para erro de duplicação de CPF ou CFP
    if (error.code === "P2002") {
      return NextResponse.json({ error: "CPF ou CFP já cadastrado!" }, { status: 409 });
    }
    return NextResponse.json({ error: "Erro interno do servidor!" }, { status: 500 });
  }
}



async function notificar(email: string, nome: string, email_system: string, senha: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_RESPONSE,
      pass: process.env.KEY_EMAIL_RESPONSE,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_RESPONSE, // trocar esse email urgente
    to: email,
    subject: 'Cadastro Habilitado no Lunme',
    text: `Prezado(a) ${nome},\n\n
  É com prazer que informamos que seu cadastro como psicólogo foi habilitado com sucesso na plataforma Lunme.\n\n
  Abaixo, seguem seus dados de acesso para completar seu cadastro e iniciar sua jornada na plataforma:\n\n
  Email: "${email_system}"\n
  Senha: ${senha}\n\n
  Para sua segurança, recomendamos que, ao acessar a plataforma pela primeira vez, você altere sua senha. Isso garantirá a proteção do seu acesso e dados.\n\n
  Caso tenha alguma dúvida ou necessite de suporte, não hesite em nos contatar.\n\n
  Atenciosamente,\n
  Equipe Lunme`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
  }
}



async function reproveNotify(email: string, nome: string, email_system: string, senha: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_RESPONSE,
      pass: process.env.KEY_EMAIL_RESPONSE,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_RESPONSE,
    to: email,
    subject: 'Cadastro não aprovado - Lunme',
    text: `Prezado(a) ${nome},\n\n
  Após análise das informações fornecidas no seu cadastro como psicólogo(a) na plataforma Lunme, infelizmente não foi possível aprová-lo neste momento.\n\n
  O motivo mais comum para a não aprovação está relacionado a dados incompletos ou inconsistentes. Recomendamos que você revise atentamente os dados informados (como nome completo, CPF, CRP, data de nascimento e informações de contato) e tente novamente o envio do cadastro.\n\n
  Estamos à disposição para esclarecer qualquer dúvida ou auxiliar no processo de regularização do seu cadastro.\n\n
  Agradecemos seu interesse em fazer parte da Lunme.\n\n
  Atenciosamente,\n
  Equipe Lunme`
  };
  
  try {
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
  }
}



function gerarSenhaAleatoria(tamanho: number = 8): string {
  const senha = cryptoRandomString({ length: tamanho, type: 'alphanumeric' });
  return senha
}



async function efetivarPsicologo(nome: string, lastname: string, email_confirm: string, cpf: string, cfp: string, crp: string, telefone: string, celular: string, data_nasc: string) {
  let cname = `${nome.replace(/\s+/g, "")}.${lastname.replace(/\s+/g, "")}`
  cname = cname.toLowerCase()
  const senha = gerarSenhaAleatoria().toLowerCase()
  const hashedPassword = await bcrypt.hash(senha, 10);

  const first_acess = false

  /**
 * Calcula a idade com base em uma data de nascimento fornecida.
 * 
 * @param {string} data - Data de nascimento no formato "mm/dd/aaaa" ou "aaaa-mm-dd".
 * @returns {number} - Retorna a idade em anos completos.
 * 
 */
  const defIdade = (data: string) => Math.floor((new Date().getTime() - new Date(data).getTime()) / (365.25 * 24 * 60 * 60 * 1000));

  const psicologo = await prisma.user.create({
    data: {
      name: nome,
      lastname: lastname,
      email: `${cname}@lunme.com.br`,
      email_confirm: email_confirm,
      password: hashedPassword,
      role: 'PSYCHOLOGIST',
      cpf: cpf,
      cfp: cfp,
      crp: crp,
      telefone: telefone,
      celular: celular,
      idade: String(defIdade(data_nasc)), //passamos a idade para o objeto a ser salvo
      first_acess: true, //primeiro acesso definido


    }
  });

  try {
    /*  Enviando a requisição POST para outro endpoint */
    const apiUrl = `${process.env.NEXTAUTH_URL}/api/register_admins`
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(psicologo)
    });

    if (!psicologo.email_confirm) {
      return NextResponse.json(
        { error: "E-mail de confirmação é obrigatório para notificar o psicólogo." },
        { status: 400 }
      );
    }

    const data = await response.json();
    /* Aqui estamos efetivando o psicologo caso seu cadastro seja aprovado */
    await notificar(email_confirm, nome, psicologo.email, senha)
    return data;
  } catch (error) {

    throw error;
  }
}



export async function PUT(req: Request) {
  try {
    const { cpf } = await req.json();
    if (!cpf) {
      return NextResponse.json({ error: "CPF é obrigatório" }, { status: 400 });
    }

    //busca o psicologo que vai ser autorizado
    const prePsicologo = await prisma.prePsicologo.findUnique({
      where: { cpf },
    });

    if (!prePsicologo) {
      return NextResponse.json({ error: "Psicólogo não encontrado" }, { status: 404 });
    }

    // Atualiza o campo 'habilitado' para 'true' no banco
    const updatedPsicologo = await prisma.prePsicologo.update({
      where: { cpf },
      data: { habilitado: true },
    });

    //garante que o sobrenome do psicólogo é obrigatório
    if (!updatedPsicologo.lastname) {
      return NextResponse.json({ error: "Sobrenome do psicólogo é obrigatório" }, { status: 400 });
    }
    // Efetiva o psicólogo no sistema e envia e-mail de notificação
    await efetivarPsicologo(
      updatedPsicologo.nome,
      updatedPsicologo.lastname,
      updatedPsicologo.email,
      updatedPsicologo.cfp,
      updatedPsicologo.cfp,
      updatedPsicologo.crp,
      updatedPsicologo.telefone,
      updatedPsicologo.celular,
      updatedPsicologo.data_nasc,

    );

    // Retorna todos os dados disponíveis do psicólogo após habilitação
    return NextResponse.json({
      message: "Psicólogo habilitado com sucesso",
      data: updatedPsicologo,
    }, { status: 200 });

  } catch (error: any) {

    return NextResponse.json({ error: "Erro interno do servidor!" }, { status: 500 });
  }
}




export async function DELETE(req: Request) {
  try {
    const { cpf } = await req.json();

    if (!cpf) {
      return NextResponse.json({ error: "CPF é obrigatório" }, { status: 400 });
    }

    // Verifica se o psicólogo existe
    const psicologo = await prisma.prePsicologo.findUnique({
      where: { cpf },
    });

    if (!psicologo) {
      return NextResponse.json({ error: "Psicólogo não encontrado" }, { status: 404 });
    }

    // Notifica o psicólogo antes de deletar se ele estiver com status habilitado como false
    if (!psicologo.habilitado) {
    await reproveNotify(
      psicologo.email,
      psicologo.nome,
      psicologo.email, // email_system (caso queira mudar, pode adaptar)
      "Obrigado por entrar em contato" // pode ser "" ou algo simbólico, não será usada nesse caso
    );
  }

    // Deleta o registro do psicólogo 
  await prisma.prePsicologo.delete({
      where: { cpf },
    });

    return NextResponse.json({
      message: "Psicólogo removido com sucesso",
      deletedCpf: cpf,
    }, { status: 200 });

  } catch (error) {
    console.error("Erro ao deletar psicólogo:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}