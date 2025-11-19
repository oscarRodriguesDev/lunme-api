import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();




export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const psicologoId = url.searchParams.get('psicologoId');
  const token = url.searchParams.get('token');

  if (!psicologoId || !token) {
    return NextResponse.json({ error: 'Parâmetros ausentes' }, { status: 400 });
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '0.0.0.0';

  const registro = await prisma.acessoAnamneseTemp.findUnique({
    where: { token },
  });

  const agora = new Date();

  if (!registro) {
    await prisma.acessoAnamneseTemp.create({
      data: { token, ip, acessado_em: agora },
    });
    return NextResponse.json({ autorizado: true });
  }

  if (!registro.acessado_em) {
    await prisma.acessoAnamneseTemp.update({
      where: { token },
      data: { ip, acessado_em: agora },
    });
    return NextResponse.json({ autorizado: true });
  }

  const acessadoEm = new Date(registro.acessado_em).getTime();
  const tempoPassado = Date.now() - acessadoEm;
  const valido = tempoPassado <= 30 * 60 * 1000;

  if (registro.ip === ip && valido) {
    return NextResponse.json({ autorizado: true });
  } else {
    return NextResponse.json({ autorizado: false }, { status: 403 });
  }
}
