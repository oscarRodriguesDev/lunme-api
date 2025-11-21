import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/internal/register_pacientes/pre-pacientes:
 *   get:
 *     summary: Lista pré-pacientes ainda não habilitados de um psicólogo
 *     description: Retorna todos os registros de pré-pacientes vinculados ao psicólogo informado, filtrando apenas os não habilitados.
 *     tags:
 *       - Interno - Pré-Pacientes
 *     parameters:
 *       - in: query
 *         name: psicologoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do psicólogo responsável
 *         example: "clu1x0a9g0001z0t7i1s2abc"
 *     responses:
 *       200:
 *         description: Lista de pré-pacientes retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id: { type: string, example: "prp_123" }
 *                   nome: { type: string, example: "Maria Oliveira" }
 *                   email: { type: string, example: "maria@email.com" }
 *                   endereco: { type: string, example: "Rua das Flores, 123" }
 *                   nascimento: { type: string, example: "1995-08-12" }
 *                   idade: { type: number, example: 29 }
 *                   cpf: { type: string, example: "12345678900" }
 *                   telefone: { type: string, example: "27999998888" }
 *                   emergencia: { type: string, example: "Mãe - 27988887777" }
 *                   generoOrientacao: { type: string, example: "Feminino" }
 *                   estadoCivil: { type: string, example: "Solteira" }
 *                   origemConhecimento: { type: string, example: "Instagram" }
 *                   preocupacao: { type: string, example: "Ansiedade constante" }
 *                   motivoAtendimento: { type: string, example: "Crises de ansiedade" }
 *                   experienciaAnterior: { type: string, example: "Já fez terapia 1 ano" }
 *                   saudeFisica: { type: string, example: "Boa" }
 *                   detalhesSaudeFisica: { type: string, example: "Sem condições graves" }
 *                   medicamentos: { type: string, example: "Nenhum" }
 *                   diagnosticoMental: { type: string, example: "Não possui" }
 *                   historicoFamiliar: { type: string, example: "Histórico de ansiedade na família" }
 *                   rotina: { type: string, example: "Trabalho intenso, pouco lazer" }
 *                   sono: { type: string, example: "Dorme 5h por noite" }
 *                   atividadeFisica: { type: string, example: "Raramente" }
 *                   estresse: { type: string, example: "Alto" }
 *                   convivencia: { type: string, example: "Boa" }
 *                   relacaoFamiliar: { type: string, example: "Distante" }
 *                   apoioSocial: { type: string, example: "Poucos amigos" }
 *                   nivelFelicidade: { type: number, example: 4 }
 *                   ansiedade: { type: number, example: 8 }
 *                   pensamentosNegativos: { type: string, example: "Constantes" }
 *                   objetivoTerapia: { type: string, example: "Melhorar crises de ansiedade" }
 *                   temasDelicados: { type: string, example: "Relacionamentos" }
 *                   estiloAtendimento: { type: string, example: "Acolhedor" }
 *                   observacoesFinais: { type: string, example: "Paciente muito retraída" }
 *                   autorizacaoLGPD: { type: boolean, example: true }
 *                   habilitado: { type: boolean, example: false }
 *                   createdAt: { type: string, example: "2025-01-10T12:34:56.000Z" }
 *                   updatedAt: { type: string, example: "2025-01-10T14:21:00.000Z" }
 *
 *       400:
 *         description: ID do psicólogo não informado
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
 *         description: Erro interno ao buscar pré-pacientes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error: { type: string, example: "Erro interno do servidor" }
 */

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

