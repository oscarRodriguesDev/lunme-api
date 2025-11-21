import OpenAI from "openai";
import { NextResponse } from "next/server";
import { avaliação } from "@/app/util/promptProntuario";


export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});



/**
 * @swagger
 * /api/internal/prontuario/analise-paciente:
 *   post:
 *     summary: Gera uma avaliação baseada no prompt enviado
 *     description: Recebe um prompt, concatena com instruções internas e envia ao modelo de IA para gerar uma avaliação estruturada.
 *     tags:
 *       - Interno - Avaliações
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prompt
 *             properties:
 *               prompt:
 *                 type: string
 *                 example: "Paciente demonstra sinais de melhora no tratamento."
 *     responses:
 *       200:
 *         description: Avaliação gerada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   example: "Avaliação detalhada gerada pelo modelo."
 *       400:
 *         description: Erro — campo prompt não enviado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Título e autor são obrigatórios."
 *       500:
 *         description: Erro interno ao gerar resposta do modelo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao gerar resposta do modelo."
 */

export async function POST(req: Request) {
    const { prompt } = await req.json();
   const instrucao = `${avaliação}${prompt}` 
  if (!prompt) {
    return NextResponse.json({ error: "Título e autor são obrigatórios." }, { status: 400 });
  }
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: instrucao }],
      temperature: 0.2,
       max_tokens: 2000
    });

    const content = completion.choices[0]?.message?.content || "Sem resposta.";
  
   
    return NextResponse.json({ result: content });

  } catch (error: any) {
    return NextResponse.json({ error: "Erro ao gerar resposta do modelo." }, { status: 500 });
  } 
}
