import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Paciente } from "../../../../../types/paciente";

const prisma = new PrismaClient();


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




//edição de pacientes
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
