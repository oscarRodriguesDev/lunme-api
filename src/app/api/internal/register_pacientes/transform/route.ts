// src/app/api/prepaciente/[id]/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/internal/register_pacientes/transform:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     summary: Busca um pré-paciente pelo ID
 *     description: Retorna as informações completas de um pré-paciente específico.
 *     tags:
 *       - Interno - Pré-Pacientes
 *     parameters:
 *       - in: query
 *         name: idpac
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do pré-paciente
 *         example: "prp_abc123"
 *
 *     responses:
 *       200:
 *         description: Pré-paciente encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: string, example: "prp_abc123" }
 *                 nome: { type: string, example: "João Silva" }
 *                 email: { type: string, example: "joao@mail.com" }
 *                 endereco: { type: string, example: "Rua Flores, 100" }
 *                 nascimento: { type: string, example: "1990-02-17" }
 *                 idade: { type: number, example: 34 }
 *                 cpf: { type: string, example: "12345678900" }
 *                 telefone: { type: string, example: "27999998888" }
 *                 emergencia: { type: string, example: "Maria - 27999997777" }
 *                 generoOrientacao: { type: string, example: "Masculino" }
 *                 estadoCivil: { type: string, example: "Solteiro" }
 *                 origemConhecimento: { type: string, example: "Indicação" }
 *                 preocupacao: { type: string, example: "Ansiedade" }
 *                 motivoAtendimento: { type: string, example: "Crises recorrentes" }
 *                 experienciaAnterior: { type: string, example: "Nunca fez terapia" }
 *                 saudeFisica: { type: string, example: "Boa" }
 *                 detalhesSaudeFisica: { type: string, example: "Sem observações" }
 *                 medicamentos: { type: string, example: "Nenhum" }
 *                 diagnosticoMental: { type: string, example: "Nenhum" }
 *                 historicoFamiliar: { type: string, example: "Ansiedade na mãe" }
 *                 rotina: { type: string, example: "Trabalho intenso" }
 *                 sono: { type: string, example: "Dorme 6h/dia" }
 *                 atividadeFisica: { type: string, example: "Sedentário" }
 *                 estresse: { type: string, example: "Alto" }
 *                 convivencia: { type: string, example: "Boa" }
 *                 relacaoFamiliar: { type: string, example: "Neutra" }
 *                 apoioSocial: { type: string, example: "Poucos amigos" }
 *                 nivelFelicidade: { type: number, example: 5 }
 *                 ansiedade: { type: number, example: 8 }
 *                 pensamentosNegativos: { type: string, example: "Frequentes" }
 *                 objetivoTerapia: { type: string, example: "Controle emocional" }
 *                 temasDelicados: { type: string, example: "Relacionamento" }
 *                 estiloAtendimento: { type: string, example: "Direto e acolhedor" }
 *                 observacoesFinais: { type: string, example: "Paciente retraído" }
 *                 autorizacaoLGPD: { type: boolean, example: true }
 *                 habilitado: { type: boolean, example: false }
 *                 psicologoId: { type: string, example: "psi_777aaa" }
 *                 createdAt: { type: string, example: "2025-01-10T10:15:00.000Z" }
 *                 updatedAt: { type: string, example: "2025-01-10T12:20:00.000Z" }
 *
 *       400:
 *         description: Parâmetro ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Parâmetro \"idpac\" ausente ou inválido"
 *
 *       404:
 *         description: Pré-paciente não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "PrePaciente não encontrado"
 *
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro interno no servidor"
 */

export async function GET(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const idpac = searchParams.get('idpac');
  
      // Validação
      if (!idpac || typeof idpac !== 'string') {
        return NextResponse.json({ error: 'Parâmetro "idpac" ausente ou inválido' }, { status: 400 });
      }
  
      // Busca no banco
      const prePaciente = await prisma.prePaciente.findUnique({
        where: { id: idpac },
      });
  
      if (!prePaciente) {
        return NextResponse.json({ error: 'PrePaciente não encontrado' }, { status: 404 });
      }
  
      return NextResponse.json(prePaciente, { status: 200 });
  
    } catch (error) {
      console.error('Erro ao buscar PrePaciente:', error);
      return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
    }
  }


/**
 * @swagger
 * /api/internal/register_pacientes/transform:
 *   delete:
 *     security:
 *       - BearerAuth: []
 *     summary: Remove um pré-paciente pelo ID
 *     description: Deleta permanentemente um registro de pré-paciente.
 *     tags:
 *       - Interno - Pré-Pacientes
 *
 *     parameters:
 *       - in: query
 *         name: idpac
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do pré-paciente a ser removido
 *         example: "prp_abc123"
 *
 *     responses:
 *       200:
 *         description: Pré-paciente deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "PrePaciente removido com sucesso"
 *
 *       400:
 *         description: Parâmetro inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Parâmetro \"idpac\" ausente ou inválido"
 *
 *       404:
 *         description: Pré-paciente não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "PrePaciente não encontrado"
 *
 *       500:
 *         description: Erro interno no servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro interno no servidor"
 */

  export async function DELETE(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const idpac = searchParams.get('idpac');

      // Validação
      if (!idpac || typeof idpac !== 'string') {
        return NextResponse.json({ error: 'Parâmetro "idpac" ausente ou inválido' }, { status: 400 });
      }

      // Verifica se o registro existe
      const prePaciente = await prisma.prePaciente.findUnique({
        where: { id: idpac },
      });

      if (!prePaciente) {
        return NextResponse.json({ error: 'PrePaciente não encontrado' }, { status: 404 });
      }

      // Deleta o registro
      await prisma.prePaciente.delete({
        where: { id: idpac },
      });

      return NextResponse.json({ 
        success: true, 
        message: 'PrePaciente removido com sucesso' 
      }, { status: 200 });

    } catch (error) {
      console.error('Erro ao deletar PrePaciente:', error);
      return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
    }
  }

