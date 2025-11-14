// src/app/api/prepaciente/[id]/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
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


  //deletar o pre-paciente
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

