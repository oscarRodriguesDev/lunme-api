/**
 * Importa o objeto `NextResponse` do Next.js, utilizado para criar respostas HTTP personalizadas
 * em rotas do tipo API com suporte a middlewares e edge functions.
 *
 * Importa o `PrismaClient`, o cliente do ORM Prisma, utilizado para realizar operações no banco de dados.
 */

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";



const prisma = new PrismaClient();

/**
 * Gera um código único baseado na data, hora e timestamp atual.
 *
 * @param data - Data no formato string (ex: "20250406")
 * @param hora - Hora no formato string (ex: "1530")
 * @returns Uma string única no formato `COD<DATA><HORA><TIMESTAMP>`
 *
 * @example
 * const codigo = codeGen("20250406", "1530");
 * // Retorna algo como "COD2025040615301680803945000"
 */

function codeGen(data: string, hora: string): string {
  const timestamp = Date.now();  // Obtém o timestamp atual
  return `COD${data}${hora}${timestamp}`;
}




/**
 * @swagger
 * /api/internal/gen-meet:
 *   post:
 *     summary: Cria uma nova consulta
 *     description: Registra uma nova consulta associada a paciente e psicólogo.
 *     tags:
 *       - Interno - Agendamentos
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pacienteId
 *               - name
 *               - fantasy_name
 *               - psicologoId
 *               - data
 *               - hora
 *               - tipo_consulta
 *               - duracao
 *             properties:
 *               pacienteId:
 *                 type: string
 *                 example: "user_12345"
 *               name:
 *                 type: string
 *                 example: "João Silva"
 *               fantasy_name:
 *                 type: string
 *                 example: "Clínica Exemplo"
 *               psicologoId:
 *                 type: string
 *                 example: "psico_98765"
 *               data:
 *                 type: string
 *                 format: date
 *                 example: "2025-11-20"
 *               hora:
 *                 type: string
 *                 example: "14:30"
 *               tipo_consulta:
 *                 type: string
 *                 example: "Online"
 *               observacao:
 *                 type: string
 *                 example: "Consulta de avaliação inicial"
 *               recorrencia:
 *                 type: string
 *                 example: "Semanal"
 *               duracao:
 *                 type: number
 *                 example: 50
 *
 *     responses:
 *       201:
 *         description: Consulta criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "consulta_123456"
 *                 pacienteId:
 *                   type: string
 *                 name:
 *                   type: string
 *                 fantasy_name:
 *                   type: string
 *                 titulo:
 *                   type: string
 *                   example: "Consulta"
 *                 psicologoId:
 *                   type: string
 *                 data:
 *                   type: string
 *                 hora:
 *                   type: string
 *                 tipo_consulta:
 *                   type: string
 *                 observacao:
 *                   type: string
 *                 recorrencia:
 *                   type: string
 *                 code:
 *                   type: string
 *                 duracao:
 *                   type: number
 *
 *       500:
 *         description: Erro ao criar consulta.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao criar reunião"
 */

export async function POST(req: Request) {
  const titulo = 'Consulta';
  try {
    const {
      pacienteId,
      name,
      fantasy_name,
      psicologoId,
      data,
      hora,
      tipo_consulta,
      observacao,
      recorrencia,
      duracao,
      
    } = await req.json();

    const code = codeGen(data, hora);
    const novaConsulta = await prisma.consulta.create({
      data: {
        pacienteId,
        name,
        fantasy_name,
        titulo,
        psicologoId,
        data,
        hora,
        tipo_consulta,
        observacao,
        recorrencia,
        code,
        duracao,
        
      },
    });

    return NextResponse.json(novaConsulta, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar reunião" }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/internal/gen-meet:
 *   get:
 *     summary: Lista todas as consultas de um psicólogo
 *     description: |
 *       Retorna todas as consultas associadas a um psicólogo específico.  
 *       Caso não existam consultas, retorna um exemplo de consulta fictícia para exibição.
 *     tags:
 *      - Interno - Agendamentos
 *
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do psicólogo cujas consultas serão listadas.
 *
 *     responses:
 *       200:
 *         description: Consultas retornadas com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "consulta_12345"
 *                   pacienteId:
 *                     type: string
 *                     nullable: true
 *                   fantasy_name:
 *                     type: string
 *                     example: "Este agendamento é apenas um exemplo"
 *                   name:
 *                     type: string
 *                     example: "Consulta Demonstrativa"
 *                   titulo:
 *                     type: string
 *                     example: "Sessão de Demonstração"
 *                   psicologoId:
 *                     type: string
 *                   data:
 *                     type: string
 *                     format: date
 *                     example: "2025-11-20"
 *                   hora:
 *                     type: string
 *                     example: "10:00"
 *                   tipo_consulta:
 *                     type: string
 *                     example: "online"
 *                   observacao:
 *                     type: string
 *                     example: "Esta é uma consulta fictícia para fins de exibição."
 *                   recorrencia:
 *                     type: string
 *                     nullable: true
 *                   code:
 *                     type: string
 *                     example: "fake-code"
 *                   duracao:
 *                     type: string
 *                     example: "50min"
 *
 *       400:
 *         description: ID do psicólogo não informado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "ID do psicólogo é obrigatório"
 *
 *       500:
 *         description: Erro ao buscar reuniões.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao buscar reuniões"
 */

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idPsicologo = searchParams.get("id");

    if (!idPsicologo) {
      return NextResponse.json(
        { error: "ID do psicólogo é obrigatório" },
        { status: 400 }
      );
    }

    const consultas = await prisma.consulta.findMany({
      where: {
        psicologoId: idPsicologo,
      },
    });

    if (consultas.length === 0) {
      const fakeConsulta = {
        id: "fake-id",
        pacienteId: null,
        fantasy_name: "Este agendamento é apenas um exemplo",
        name: "Consulta Demonstrativa",
        titulo: "Sessão de Demonstração",
        psicologoId: idPsicologo,
        data: new Date().toISOString().split("T")[0], // data atual
        hora: "10:00",
        tipo_consulta: "online",
        observacao: "Esta é uma consulta fictícia para fins de exibição.",
        recorrencia: null,
        code: "fake-code",
        duracao: "50min",
      };

      return NextResponse.json([fakeConsulta], { status: 200 });
    }

    return NextResponse.json(consultas, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar reuniões" },
      { status: 500 }
    );
  }
}




/**
 * @swagger
 * /api/internal/gen-meet:
 *   put:
 *     summary: Atualiza os dados de uma consulta
 *     description: Permite atualizar qualquer campo de uma consulta existente, exceto o ID.
 *     tags:
 *      - Interno - Agendamentos
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 example: "consulta_12345"
 *               pacienteId:
 *                 type: string
 *                 example: "user_12345"
 *               name:
 *                 type: string
 *                 example: "João Silva"
 *               fantasy_name:
 *                 type: string
 *                 example: "Clínica Exemplo"
 *               psicologoId:
 *                 type: string
 *                 example: "psico_98765"
 *               data:
 *                 type: string
 *                 format: date
 *                 example: "2025-11-20"
 *               hora:
 *                 type: string
 *                 example: "14:30"
 *               tipo_consulta:
 *                 type: string
 *                 example: "Online"
 *               observacao:
 *                 type: string
 *                 example: "Consulta de avaliação inicial"
 *               recorrencia:
 *                 type: string
 *                 example: "Semanal"
 *               duracao:
 *                 type: number
 *                 example: 50
 *
 *     responses:
 *       200:
 *         description: Consulta atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 pacienteId:
 *                   type: string
 *                 name:
 *                   type: string
 *                 fantasy_name:
 *                   type: string
 *                 psicologoId:
 *                   type: string
 *                 data:
 *                   type: string
 *                 hora:
 *                   type: string
 *                 tipo_consulta:
 *                   type: string
 *                 observacao:
 *                   type: string
 *                 recorrencia:
 *                   type: string
 *                 code:
 *                   type: string
 *                 duracao:
 *                   type: number
 *
 *       500:
 *         description: Erro ao atualizar a consulta.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao atualizar reunião"
 */

export async function PUT(req: Request) {


  try {
    const { id, ...dadosAtualizados } = await req.json();

    const consultaAtualizada = await prisma.consulta.update({
      where: { id },
      data: dadosAtualizados,
    });

    return NextResponse.json(consultaAtualizada, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar reunião" }, { status: 500 });
  }
}


/**
 * @swagger
 * /api/internal/gen-meet:
 *   delete:
 *     summary: Exclui uma consulta existente
 *     description: Remove do banco de dados uma consulta específica pelo seu ID.
 *     tags:
 *       - Interno - Consultas
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 example: "consulta_12345"
 *
 *     responses:
 *       200:
 *         description: Consulta deletada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reunião deletada com sucesso"
 *
 *       500:
 *         description: Erro ao deletar a consulta.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao deletar reunião"
 */

export async function DELETE(req: Request) {


  try {
    const { id } = await req.json();

    await prisma.consulta.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Reunião deletada com sucesso" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao deletar reunião" }, { status: 500 });
  }
}
