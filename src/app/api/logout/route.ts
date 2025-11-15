import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Logout realizado com sucesso",
    aviso: "Lembre-se de remover o token JWT do armazenamento do cliente (localStorage, cookies, etc.) para completar o logout."
  });
}

// no front toda a interação com serviços de login/logout deve ser feita dentro da pasta api