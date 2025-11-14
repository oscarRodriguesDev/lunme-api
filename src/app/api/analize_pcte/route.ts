
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();


/**
 * @swagger
 * /api/pre-pacientes:
 *   post:
 *     summary: Pré-cadastro de anamnese do paciente
 *     description: Registra um novo pré-cadastro de paciente, incluindo informações de anamnese. O paciente não é habilitado automaticamente.
 *     tags:
 *       - Pacientes
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
 *                 example: "Maria"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "maria@email.com"
 *               idade:
 *                 type: integer
 *                 example: 32
 *               cpf:
 *                 type: string
 *                 example: "12345678900"
 *               telefone:
 *                 type: string
 *                 example: "(11) 98888-7777"
 *               origemConhecimento:
 *                 type: string
 *                 example: "Indicação de amigo"
 *               preocupacao:
 *                 type: string
 *                 example: "Ansiedade constante"
 *               motivoAtendimento:
 *                 type: string
 *                 example: "Dificuldades no trabalho"
 *               experienciaAnterior:
 *                 type: string
 *                 example: "Já fez terapia há 2 anos"
 *               saudeFisica:
 *                 type: string
 *                 example: "Boa"
 *               detalhesSaudeFisica:
 *                 type: string
 *                 example: "Hipertensão controlada"
 *               medicamentos:
 *                 type: string
 *                 example: "Ansiolítico"
 *               diagnosticoMental:
 *                 type: string
 *                 example: "Transtorno de ansiedade"
 *               historicoFamiliar:
 *                 type: string
 *                 example: "Histórico de depressão na família"
 *               rotina:
 *                 type: string
 *                 example: "Trabalha 8h/dia, cuida da casa"
 *               sono:
 *                 type: string
 *                 example: "Sono irregular"
 *               atividadeFisica:
 *                 type: string
 *                 example: "Caminhada 3x por semana"
 *               estresse:
 *                 type: string
 *                 example: "Alto"
 *               convivencia:
 *                 type: string
 *                 example: "Mora com os pais"
 *               relacaoFamiliar:
 *                 type: string
 *                 example: "Boa relação com a mãe, conflituosa com o pai"
 *               apoioSocial:
 *                 type: string
 *                 example: "Amigos próximos"
 *               nivelFelicidade:
 *                 type: integer
 *                 description: Nível de felicidade (0-10)
 *                 example: 6
 *               ansiedade:
 *                 type: string
 *                 example: "Crises semanais"
 *               pensamentosNegativos:
 *                 type: string
 *                 example: "Sensação de incapacidade frequente"
 *               objetivoTerapia:
 *                 type: string
 *                 example: "Aprender a lidar com ansiedade"
 *               temasDelicados:
 *                 type: string
 *                 example: "Relacionamentos abusivos"
 *               estiloAtendimento:
 *                 type: string
 *                 example: "Prefere abordagem acolhedora"
 *               observacoesFinais:
 *                 type: string
 *                 example: "Paciente motivada para tratamento"
 *               autorizacaoLGPD:
 *                 type: boolean
 *                 example: true
 *               psicologoId:
 *                 type: string
 *                 description: ID do psicólogo responsável
 *                 example: "clv123456789"
 *     responses:
 *       201:
 *         description: Pré-cadastro de anamnese realizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Pré-cadastro de anamnese realizado com sucesso!"
 *                 data:
 *                   type: object
 *                   description: Dados do paciente pré-cadastrado
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
 *         description: Conflito — CPF já cadastrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "CPF já cadastrado!"
 *       500:
 *         description: Erro interno do servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro interno do servidor."
 */

export async function POST(req: Request) {
  try {
    const body = await req.json();
   

    // Extrai todos os campos da anamnese
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









