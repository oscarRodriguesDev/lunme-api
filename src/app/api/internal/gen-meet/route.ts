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
 * Cria uma nova consulta no banco de dados.
 *
 * Esta função espera um corpo JSON contendo os seguintes campos:
 * - `pacienteId`: ID do paciente associado à consulta
 * - `name`: Nome do paciente
 * - `fantasy_name`: Nome fantasia do paciente
 * - `psicologoId`: ID do psicólogo associado à consulta
 * - `data`: Data da consulta no formato string (ex: "20250406")
 * - `hora`: Hora da consulta no formato string (ex: "1530")
 * - `tipo_consulta`: Tipo de consulta (ex: "terapia")
 * - `observacao`: Observação adicional sobre a consulta
 * - `recorrencia`: Indica se a consulta é recorrente (ex: "sim" ou "não")
 * - `duracao`: Duração da consulta em minutos
 *
 * @returns JSON com a consulta criada e o status 201 (Created).
 *  
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
 * Recupera todas as consultas do banco de dados.
 *
 * @returns Lista de consultas em formato JSON.
 *
 * @throws Retorna erro 500 se a consulta ao banco de dados falhar.
 *
 * @example
 * // Requisição GET para /api/consultas retorna:
 * [
 *   { id: 1, data: '2025-04-06T10:00:00Z', pacienteId: '123', psicologoId: '456' },
 *   ...
 * ]
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
 * Atualiza uma consulta existente no banco de dados.
 *
 * Esta função espera um corpo JSON contendo os seguintes campos:
 * - `id`: ID da consulta a ser atualizada
 * - `dadosAtualizados`: Objeto contendo os novos dados da consulta
 * 
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
 * Deleta uma consulta existente no banco de dados.
 *
 * Esta função espera um corpo JSON contendo o ID da consulta a ser deletada.
 *
 * @returns JSON com a mensagem de sucesso ou erro.
 *
 * @throws Retorna erro 500 se a consulta ao banco de dados falhar.
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
