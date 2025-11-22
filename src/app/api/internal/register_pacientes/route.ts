import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Paciente } from "../../../../../types/paciente";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/internal/register_pacientes:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     summary: Lista todos os pacientes vinculados a um psicólogo
 *     description: Retorna todos os pacientes associados ao psicólogo informado via query string.
 *     tags:
 *       - Interno - Pacientes
 *     parameters:
 *       - in: query
 *         name: psicologoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do psicólogo
 *         example: "user_123"
 *     responses:
 *       200:
 *         description: Lista de pacientes retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   nome:
 *                     type: string
 *                   fantasy_name:
 *                     type: string
 *                   idade:
 *                     type: number
 *                   telefone:
 *                     type: string
 *                   cidade:
 *                     type: string
 *                   estado:
 *                     type: string
 *                   convenio:
 *                     type: string
 *                   cpf:
 *                     type: string
 *                   sexo:
 *                     type: string
 *                   cep:
 *                     type: string
 *                   bairro:
 *                     type: string
 *                   numero:
 *                     type: string
 *                   pais:
 *                     type: string
 *                   complemento:
 *                     type: string
 *                   email:
 *                     type: string
 *                   rg:
 *                     type: string
 *                   sintomas:
 *                     type: string
 *                   rua:
 *                     type: string
 *       400:
 *         description: Falta de parâmetros obrigatórios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "ID do psicólogo é obrigatório"
 *       500:
 *         description: Erro interno ao buscar pacientes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao buscar pacientes"
 */

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const psicologoId = searchParams.get('psicologoId');

    if (!psicologoId) {
      return NextResponse.json(
        { error: "ID do psicólogo é obrigatório" },
        { status: 400 }
      );
    }

    const pacientes = await prisma.paciente.findMany({
      where: {
        psicologoId: psicologoId
      },
      select: {
        id: true,
        nome: true,
        fantasy_name: true,
        idade: true,
        telefone: true,
        cidade: true,
        estado: true,
        convenio: true,
        cpf: true,
        sexo: true,
        cep: true,
        bairro: true,
        numero: true,
        pais: true,
        complemento: true,
        email: true,
        rg: true,
        sintomas: true,
        rua: true,
        


      }
    });

    return NextResponse.json(pacientes, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro ao buscar pacientes" },
      { status: 500 }
    );
  }
}


async function salvarProntuarioInicial(pacienteId: string, sintomas: string) {
  try {
    // Verifica se já existe um prontuário para este paciente
    const prontuarioExistente = await prisma.prontuario.findUnique({
      where: { pacienteId }
    });

    if (prontuarioExistente) {
      return prontuarioExistente;
    }

    // Cria um prontuário inicial baseado nos sintomas
    const prontuario = await prisma.prontuario.create({
      data: {
        pacienteId,
        queixaPrincipal: sintomas,
        historico: "Histórico inicial baseado nos sintomas informados",
        conduta: "Aguardando primeira consulta",
        evolucao: "Paciente recém cadastrado"
      }
    });

    return prontuario;
  } catch (error: any) {
    console.error("Erro ao criar prontuário inicial:", error);
    throw error;
  }
}


/**
 * @swagger
 * /api/internal/register_pacientes:
 *   post:
 *     security:
 *       - BearerAuth: []
 *     summary: Cria um novo paciente e gera automaticamente o prontuário inicial
 *     description: Cria um paciente no sistema e já vincula um prontuário com dados iniciais.
 *     tags:
 *       - Interno - Pacientes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - fantasy_name
 *               - sintomas
 *               - telefone
 *               - convenio
 *               - cpf
 *               - sexo
 *               - cep
 *               - cidade
 *               - bairro
 *               - rua
 *               - numero
 *               - pais
 *               - estado
 *               - email
 *               - rg
 *               - psicologoId
 *             properties:
 *               nome:
 *                 type: string
 *               fantasy_name:
 *                 type: string
 *               idade:
 *                 type: number
 *                 nullable: true
 *               sintomas:
 *                 type: string
 *               telefone:
 *                 type: string
 *               convenio:
 *                 type: string
 *               cpf:
 *                 type: string
 *               sexo:
 *                 type: string
 *               cep:
 *                 type: string
 *               cidade:
 *                 type: string
 *               bairro:
 *                 type: string
 *               rua:
 *                 type: string
 *               numero:
 *                 type: string
 *               pais:
 *                 type: string
 *               complemento:
 *                 type: string
 *                 nullable: true
 *               estado:
 *                 type: string
 *               email:
 *                 type: string
 *               rg:
 *                 type: string
 *               psicologoId:
 *                 type: string
 *               resumo_anmp:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Paciente criado com sucesso junto ao prontuário inicial
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: "Paciente e prontuário criados com sucesso"
 *                 data:
 *                   id: "pac_abc123"
 *                   nome: "Maria Souza"
 *                   cpf: "12345678900"
 *                   psicologoId: "user_123"
 *                   prontuario:
 *                     id: "pront_1"
 *                     queixaPrincipal: "Ansiedade constante"
 *                     historico: "Prontuário inicial criado automaticamente."
 *                     conduta: null
 *                     evolucao: null
 *       400:
 *         description: Erro de validação — campos obrigatórios ausentes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Todos os campos obrigatórios devem ser preenchidos"
 *       500:
 *         description: Erro interno ao criar paciente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao processar a requisição"
 */

export async function POST(req: Request) {
  try {
    const body: any = await req.json();

    const {
      nome,
      fantasy_name,
      idade,
      sintomas,
      telefone,
      convenio,
      cpf,
      sexo,
      cep,
      cidade,
      bairro,
      rua,
      numero,
      pais,
      complemento,
      estado,
      email,
      rg,
      psicologoId,
      resumo_anmp
    } = body;

    // Validação dos campos obrigatórios
    if (
      !nome || !fantasy_name || !sintomas || !telefone || !convenio || !cpf || !sexo || !cep ||
      !cidade || !bairro || !rua || !numero || !pais || !estado || !email || !rg || !psicologoId
    ) {
      return NextResponse.json(
        { error: "Todos os campos obrigatórios devem ser preenchidos" },
        { status: 400 }
      );
    }

    // Criando paciente com prontuário aninhado
    const novoPaciente = await prisma.paciente.create({
      data: {
        nome,
        fantasy_name,
        idade,
        sintomas,
        telefone,
        convenio,
        cpf,
        sexo,
        cep,
        cidade,
        bairro,
        rua,
        numero,
        pais,
        complemento,
        estado,
        email,
        rg,
        psicologoId,
        resumo_anmp,

        prontuario: {
          create: {
            queixaPrincipal: sintomas,
            historico: "Prontuário inicial criado automaticamente.",
            conduta: null,
            evolucao: null
          }
        }
      },
      include: {
        prontuario: true
      }
    });

    return NextResponse.json(
      { message: "Paciente e prontuário criados com sucesso", data: novoPaciente },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erro ao processar requisição:", error);
    return NextResponse.json(
      { error: "Erro ao processar a requisição", details: error.message },
      { status: 500 }
    );
  }
}



/**
 * @swagger
 * /api/internal/register_pacientes:
 *   delete:
 *     security:
 *       - BearerAuth: []
 *     summary: Remove um paciente e seu prontuário vinculado
 *     description: Deleta um paciente pelo ID. Caso exista um prontuário associado, ele será removido automaticamente.
 *     tags:
 *       - Interno - Pacientes
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do paciente a ser deletado
 *     responses:
 *       200:
 *         description: Paciente removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: "Paciente deletado com sucesso"
 *       400:
 *         description: Erro — ID não informado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "ID do paciente é obrigatório"
 *       404:
 *         description: Paciente não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Paciente não encontrado"
 *       500:
 *         description: Erro interno ao deletar paciente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao deletar paciente"
 *                 details:
 *                   type: string
 */

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: "ID do paciente é obrigatório" },
        { status: 400 }
      );
    }

    // Verifica se o paciente existe
    const paciente = await prisma.paciente.findUnique({
      where: { id },
      include: {
        prontuario: true
      }
    });

    if (!paciente) {
      return NextResponse.json(
        { error: "Paciente não encontrado" },
        { status: 404 }
      );
    }

    // Deleta o prontuário primeiro (se existir) devido à relação
    if (paciente.prontuario) {
      await prisma.prontuario.delete({
        where: { id: paciente.prontuario.id }
      });
    }

    // Deleta o paciente
    await prisma.paciente.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: "Paciente deletado com sucesso" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erro ao deletar paciente:", error);
    return NextResponse.json(
      { error: "Erro ao deletar paciente", details: error.message },
      { status: 500 }
    );
  }
}




/**
 * @swagger
 * /api/internal/register_pacientes:
 *   put:
 *     security:
 *       - BearerAuth: []
 *     summary: Atualiza os dados de um paciente
 *     description: Atualiza qualquer campo do paciente a partir do ID informado. Apenas os campos enviados no corpo serão alterados.
 *     tags:
 *       - Interno - Pacientes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "clu1x0a9g0001z0t7i1s2abc"
 *               nome:
 *                 type: string
 *                 example: "João da Silva"
 *               fantasy_name:
 *                 type: string
 *                 example: "João S."
 *               idade:
 *                 type: number
 *                 example: 32
 *               telefone:
 *                 type: string
 *                 example: "27999998888"
 *               sintomas:
 *                 type: string
 *                 example: "Ansiedade e insônia"
 *               convenio:
 *                 type: string
 *                 example: "SulAmérica"
 *               cpf:
 *                 type: string
 *                 example: "12345678900"
 *               sexo:
 *                 type: string
 *                 example: "Masculino"
 *               cidade:
 *                 type: string
 *                 example: "Vitória"
 *               estado:
 *                 type: string
 *                 example: "ES"
 *               email:
 *                 type: string
 *                 example: "joao@email.com"
 *               rg:
 *                 type: string
 *                 example: "11223344"
 *               resumo_anmp:
 *                 type: string
 *                 example: "Paciente demonstra sinais leves de ansiedade."
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: Paciente atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 id: "clu1x0a9g0001z0t7i1s2abc"
 *                 nome: "João da Silva"
 *                 telefone: "27999998888"
 *                 cidade: "Vitória"
 *       400:
 *         description: Erro — ID não informado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "ID do paciente é obrigatório"
 *       404:
 *         description: Paciente não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Paciente não encontrado"
 *       500:
 *         description: Erro interno ao atualizar paciente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao atualizar paciente"
 *                 details:
 *                   type: string
 */

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { error: "ID do paciente é obrigatório" },
        { status: 400 }
      );
    }

    // Verifica se o paciente existe
    const paciente = await prisma.paciente.findUnique({
      where: { id },
    });

    if (!paciente) {
      return NextResponse.json(
        { error: "Paciente não encontrado" },
        { status: 404 }
      );
    }

    // Atualiza os dados do paciente
    const updatedPaciente = await prisma.paciente.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedPaciente, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro ao atualizar paciente", details: error.message },
      { status: 500 }
    );
  }
}
