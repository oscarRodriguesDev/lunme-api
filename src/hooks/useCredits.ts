import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//recebe a quantidade de creditos do usuario
export async function getUserCredits(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { creditos: true },
  });
  return Number(user?.creditos) || 0;
}

//debita os creditos do usuario
export async function useCredit(
  userId: string,
  qtd: number = 1
): Promise<{ success: boolean; remaining: number }> {
  // Busca usuário e créditos atuais
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { creditos: true },
  });

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  const currentCredits = Number(user.creditos) || 0;

  if (currentCredits < qtd) {
    console.log("Créditos insuficientes.");
    throw new Error("Créditos insuficientes.");
  }

  const newCredits = currentCredits - qtd;

  // Atualiza saldo (convertendo de volta para string)
  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      creditos: String(newCredits), // ✅ volta para string
    },
    select: { creditos: true },
  });

  return { success: true, remaining: Number(updated.creditos) || 0 };
}
