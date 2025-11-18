import { NextResponse } from "next/server";


/**
 * @swagger
 * /api/logout:
 *   get:
 *     summary: Realiza logout do usuário
 *     description: Retorna uma confirmação de logout. O cliente deve remover o token JWT manualmente.
 *     tags:
 *       - Autenticação
 *
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso.
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
 *                   example: "Logout realizado com sucesso"
 *                 aviso:
 *                   type: string
 *                   example: "Lembre-se de remover o token JWT do armazenamento do cliente (localStorage, cookies, etc.) para completar o logout."
 */

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Logout realizado com sucesso",
    aviso: "Lembre-se de remover o token JWT do armazenamento do cliente (localStorage, cookies, etc.) para completar o logout."
  });
}

