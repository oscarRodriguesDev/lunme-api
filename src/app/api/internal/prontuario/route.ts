// app/api/prontuario/[pacienteId]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
interface Params {
  params: {
    pacienteId: string;
  };
}

const prisma = new PrismaClient();


/**
 * @swagger
 * /api/internal/prontuario:
 *   get:
 *     summary: Retorna o prontuário de um paciente
 *     description: Busca um prontuário usando o pacienteId informado na URL.
 *     tags:
 *       - Interno - Prontuário
 *     parameters:
 *       - in: query
 *         name: pacienteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do paciente associado ao prontuário
 *     responses:
 *       200:
 *         description: Prontuário encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: pacienteId não informado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "ID do paciente não informado"
 *       404:
 *         description: Prontuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Prontuário não encontrado"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro interno do servidor"
 */

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pacienteId = searchParams.get("pacienteId");

  if (!pacienteId) {
    return NextResponse.json({ error: "ID do paciente não informado" }, { status: 400 });
  }

  try {
    const prontuario = await prisma.prontuario.findUnique({
      where: {
        pacienteId: pacienteId,
      },
    });

    if (!prontuario) {
      return NextResponse.json({ error: "Prontuário não encontrado" }, { status: 404 });
    }

    return NextResponse.json(prontuario);
  } catch (error) {
    console.error("Erro ao buscar prontuário:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}



/**
 * @swagger
 * /api/internal/prontuario:
 *   post:
 *     summary: Cria um prontuário para um paciente
 *     description: Registra um novo prontuário vinculado a um paciente. Cada paciente só pode ter um prontuário.
 *     tags:
 *       - Interno - Prontuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pacienteId
 *             properties:
 *               pacienteId:
 *                 type: string
 *                 example: "cltxyz12345"
 *               queixaPrincipal:
 *                 type: string
 *                 example: "Ansiedade constante e dificuldade para dormir."
 *               historico:
 *                 type: string
 *                 example: "Paciente relata histórico de ansiedade desde a adolescência."
 *               conduta:
 *                 type: string
 *                 example: "Aplicação de técnicas de respiração e exercícios cognitivos."
 *               transcription:
 *                 type: string
 *                 example: "Transcrição da última sessão..."
 *               evolucao:
 *                 type: string
 *                 example: "Paciente apresentou melhora após técnicas aplicadas."
 *     responses:
 *       201:
 *         description: Prontuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Dados ausentes — pacienteId é obrigatório
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "ID do paciente é obrigatório"
 *       409:
 *         description: O paciente já possui prontuário registrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Paciente já possui prontuário"
 *       500:
 *         description: Erro interno ao criar prontuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro interno ao criar prontuário"
 */

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      pacienteId,
      queixaPrincipal,
      historico,
      conduta,
      transcription,
      evolucao,
    } = body;

    if (!pacienteId) {
      return NextResponse.json({ error: "ID do paciente é obrigatório" }, { status: 400 });
    }

    // Verifica se já existe um prontuário (caso sua regra seja 1:1)
    const prontuarioExistente = await prisma.prontuario.findUnique({
      where: { pacienteId },
    });

    if (prontuarioExistente) {
      return NextResponse.json(
        { error: "Paciente já possui prontuário" },
        { status: 409 }
      );
    }

    const novoProntuario = await prisma.prontuario.create({
      data: {
        pacienteId,
        queixaPrincipal,
        historico,
        conduta,
        transcription,
        evolucao,
      },
    });

    return NextResponse.json(novoProntuario, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao criar prontuário:", error);
    return NextResponse.json(
      { error: "Erro interno ao criar prontuário", details: error.message },
      { status: 500 }
    );
  }
}



/**
 * @swagger
 * /api/internal/prontuario:
 *   put:
 *     summary: Atualiza o prontuário de um paciente
 *     description: Atualiza os campos do prontuário existente. Caso um campo não seja enviado, o valor atual é mantido. O campo "evolucao" é concatenado ao valor anterior.
 *     tags:
 *       - Interno - Prontuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pacienteId
 *             properties:
 *               pacienteId:
 *                 type: string
 *                 example: "cltxyz12345"
 *               queixaPrincipal:
 *                 type: string
 *                 example: "Paciente relata melhora nos sintomas de ansiedade."
 *               historico:
 *                 type: string
 *                 example: "Histórico atualizado conforme sessão mais recente."
 *               conduta:
 *                 type: string
 *                 example: "Aplicação de nova técnica cognitiva."
 *               transcription:
 *                 type: string
 *                 example: "Transcrição atualizada da sessão."
 *               evolucao:
 *                 type: string
 *                 example: "Paciente demonstrou maior controle emocional na sessão."
 *     responses:
 *       200:
 *         description: Prontuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Erro – pacienteId não enviado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "ID do paciente é obrigatório"
 *       404:
 *         description: Prontuário não encontrado para o paciente informado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Prontuário não encontrado para o paciente"
 *       500:
 *         description: Erro interno ao atualizar prontuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro interno ao atualizar prontuário"
 */

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const {
      pacienteId,
      queixaPrincipal,
      historico,
      conduta,
      transcription,
      evolucao,
    } = body;

    if (!pacienteId) {
      return NextResponse.json({ error: "ID do paciente é obrigatório" }, { status: 400 });
    }

    const prontuarioExistente = await prisma.prontuario.findUnique({
      where: { pacienteId },
    });

    if (!prontuarioExistente) {
      return NextResponse.json(
        { error: "Prontuário não encontrado para o paciente" },
        { status: 404 }
      );
    }

    const camposAtualizados: any = {
      queixaPrincipal: queixaPrincipal ?? prontuarioExistente.queixaPrincipal,
      historico: historico ?? prontuarioExistente.historico,
      conduta: conduta ?? prontuarioExistente.conduta,
      evolucao: evolucao
        ? (prontuarioExistente.evolucao || '')  + evolucao
        : prontuarioExistente.evolucao,
      transcription: transcription ?? prontuarioExistente.transcription
    };

    const prontuarioAtualizado = await prisma.prontuario.update({
      where: { pacienteId },
      data: camposAtualizados,
    });

    return NextResponse.json(prontuarioAtualizado, { status: 200 });

  } catch (error: any) {
    console.error("Erro ao atualizar prontuário:", error);
    return NextResponse.json(
      { error: "Erro interno ao atualizar prontuário", details: error.message },
      { status: 500 }
    );
  }
}
