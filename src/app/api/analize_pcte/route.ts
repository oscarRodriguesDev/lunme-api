
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();


/**
 * @swagger
 * /api/analise_pcte:
 *   post:
 *     summary: Cria um pré-cadastro de anamnese
 *     description: >
 *       Recebe todas as informações iniciais fornecidas pelo paciente e cria um registro
 *       de pré-anamnese vinculado a um psicólogo responsável.
 *     tags:
 *       - Anamnese
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - idade
 *               - cpf
 *               - preocupacao
 *               - motivoAtendimento
 *               - psicologoId
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               idade:
 *                 type: integer
 *               cpf:
 *                 type: string
 *               telefone:
 *                 type: string
 *               origemConhecimento:
 *                 type: string
 *               preocupacao:
 *                 type: string
 *               motivoAtendimento:
 *                 type: string
 *               experienciaAnterior:
 *                 type: string
 *               saudeFisica:
 *                 type: string
 *               detalhesSaudeFisica:
 *                 type: string
 *               medicamentos:
 *                 type: string
 *               diagnosticoMental:
 *                 type: string
 *               historicoFamiliar:
 *                 type: string
 *               rotina:
 *                 type: string
 *               sono:
 *                 type: string
 *               atividadeFisica:
 *                 type: string
 *               estresse:
 *                 type: string
 *               convivencia:
 *                 type: string
 *               relacaoFamiliar:
 *                 type: string
 *               apoioSocial:
 *                 type: string
 *               nivelFelicidade:
 *                 type: string
 *               ansiedade:
 *                 type: string
 *               pensamentosNegativos:
 *                 type: string
 *               objetivoTerapia:
 *                 type: string
 *               temasDelicados:
 *                 type: string
 *               estiloAtendimento:
 *                 type: string
 *               observacoesFinais:
 *                 type: string
 *               autorizacaoLGPD:
 *                 type: boolean
 *               psicologoId:
 *                 type: string
 *           example:
 *             nome: "João da Silva"
 *             email: "joao@email.com"
 *             idade: 28
 *             cpf: "12345678900"
 *             telefone: "27999999999"
 *             origemConhecimento: "Instagram"
 *             preocupacao: "Ansiedade e estresse"
 *             motivoAtendimento: "Quero ajuda profissional"
 *             experienciaAnterior: "Nenhuma"
 *             saudeFisica: "Boa"
 *             detalhesSaudeFisica: ""
 *             medicamentos: ""
 *             diagnosticoMental: ""
 *             historicoFamiliar: ""
 *             rotina: "Trabalho e estudo"
 *             sono: "Irregular"
 *             atividadeFisica: "Raramente"
 *             estresse: "Alto"
 *             convivencia: "Boa"
 *             relacaoFamiliar: "Boa"
 *             apoioSocial: "Moderado"
 *             nivelFelicidade: "Médio"
 *             ansiedade: "Alta"
 *             pensamentosNegativos: "Ocasional"
 *             objetivoTerapia: "Melhorar saúde emocional"
 *             temasDelicados: "Nenhum"
 *             estiloAtendimento: "Empático"
 *             observacoesFinais: ""
 *             autorizacaoLGPD: true
 *             psicologoId: "uuid-do-psicologo"
 *     responses:
 *       201:
 *         description: Pré-cadastro criado com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               message: "Pré-cadastro de anamnese realizado com sucesso!"
 *               data:
 *                 id: "uuid-gerado"
 *                 nome: "João da Silva"
 *                 cpf: "12345678900"
 *                 habilitado: false
 *       400:
 *         description: Campos obrigatórios ausentes.
 *         content:
 *           application/json:
 *             example:
 *               error: "Todos os campos são obrigatórios!"
 *       409:
 *         description: CPF já está cadastrado.
 *         content:
 *           application/json:
 *             example:
 *               error: "CPF já cadastrado!"
 *       500:
 *         description: Erro interno no servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: "Erro interno do servidor."
 */

export async function POST(req: Request) {
  try {
    const body = await req.json();
  
    const {
      nome,
      email,
      idade,
      cpf,
      telefone,
      origemConhecimento,
      preocupacao,
      motivoAtendimento,
      experienciaAnterior,
      saudeFisica,
      detalhesSaudeFisica,
      medicamentos,
      diagnosticoMental,
      historicoFamiliar,
      rotina,
      sono,
      atividadeFisica,
      estresse,
      convivencia,
      relacaoFamiliar,
      apoioSocial,
      nivelFelicidade,
      ansiedade,
      pensamentosNegativos,
      objetivoTerapia,
      temasDelicados,
      estiloAtendimento,
      observacoesFinais,
      autorizacaoLGPD,
      psicologoId,
   
    } = body;

    // Validação simples dos campos obrigatórios (pode ser mais elaborado)
    if (
      !nome||
      !email||
      !idade||
      !cpf||
      !preocupacao||
      !motivoAtendimento||
      !psicologoId
    
    
    ) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios!" },
        { status: 400 }
      );
    }

    const prePaciente = await prisma.prePaciente.create({
      data: {
        nome,
        email,
        idade,
        cpf,
        telefone,
        origemConhecimento,
        preocupacao,
        motivoAtendimento,
        experienciaAnterior,
        saudeFisica,
        detalhesSaudeFisica,
        medicamentos,
        diagnosticoMental,
        historicoFamiliar,
        rotina,
        sono,
        atividadeFisica,
        estresse,
        convivencia,
        relacaoFamiliar,
        apoioSocial,
        nivelFelicidade,
        ansiedade,
        pensamentosNegativos,
        objetivoTerapia,
        temasDelicados,
        estiloAtendimento,
        observacoesFinais,
        autorizacaoLGPD,
        habilitado: false,
        psicologoId, 
       
      },
    });

    return NextResponse.json(
      { message: "Pré-cadastro de anamnese realizado com sucesso!", data: prePaciente },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erro ao cadastrar anamnese:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "CPF já cadastrado!" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}









