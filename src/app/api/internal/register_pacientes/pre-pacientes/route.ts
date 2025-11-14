import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const psicologoId = searchParams.get("psicologoId");

    if (!psicologoId) {
      return NextResponse.json(
        { error: "ID do psicólogo é obrigatório" },
        { status: 400 }
      );
    }

    const prePacientes = await prisma.prePaciente.findMany({
      where: {
        habilitado: false,
        psicologoId: psicologoId,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        endereco: true,
        nascimento: true,
        idade: true,
        cpf: true,
        telefone: true,
        emergencia: true,
        generoOrientacao: true,
        estadoCivil: true,
        origemConhecimento: true,
        preocupacao: true,
        motivoAtendimento: true,
        experienciaAnterior: true,
        saudeFisica: true,
        detalhesSaudeFisica: true,
        medicamentos: true,
        diagnosticoMental: true,
        historicoFamiliar: true,
        rotina: true,
        sono: true,
        atividadeFisica: true,
        estresse: true,
        convivencia: true,
        relacaoFamiliar: true,
        apoioSocial: true,
        nivelFelicidade: true,
        ansiedade: true,
        pensamentosNegativos: true,
        objetivoTerapia: true,
        temasDelicados: true,
        estiloAtendimento: true,
        observacoesFinais: true,
        autorizacaoLGPD: true,
        habilitado: true, // ou false, conforme sua lógica
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(prePacientes, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao buscar pré-pacientes:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

