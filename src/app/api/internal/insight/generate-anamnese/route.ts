import OpenAI from "openai";
import { NextResponse } from "next/server";
import { generateAnamnese } from "@/app/util/Anamnese";
import { useCredit } from "@/hooks/useCredits";


 
//export const runtime = 'edge';
export const runtime = 'nodejs';


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * @swagger
 * /api/internal/insight/generate-anamnese:
 *   post:
 *     summary: Gera uma análise de anamnese usando IA
 *     description: Recebe respostas do usuário, gera um prompt para análise psicológica e retorna a resposta do modelo de IA.
 *     tags:
 *       - Interno - IA / Anamnese
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário que irá consumir crédito
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: object
 *                 description: Objeto contendo as respostas fornecidas pelo paciente
 *                 example:
 *                   pergunta1: "Tenho dificuldades para dormir"
 *                   pergunta2: "Ando muito ansioso"
 *             required:
 *               - message
 *     responses:
 *       200:
 *         description: Resposta gerada pela IA
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 *                   example: "Com base nas informações, é possível observar sinais de ansiedade..."
 *       400:
 *         description: Erro de requisição (dados ausentes)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Mensagem não fornecida."
 *       500:
 *         description: Erro interno ao gerar a resposta
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
  const { message: responses } = await req.json();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") as string;
  if (!responses) {
    return NextResponse.json({ error: "Mensagem não fornecida." }, { status: 400 });
  }
  const promptMessage = `${generateAnamnese(responses)} `;
   try {
    const completion = await openai.chat.completions.create({
        /*   model: "gpt-4o-mini", */
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: promptMessage }],
      temperature: 0.2,
       max_tokens: 2000
    });
    const content = completion.choices[0]?.message?.content || "Sem resposta.";
    await useCredit(userId,1)
    return NextResponse.json({ response: content });
  } catch (error: any) {
    return NextResponse.json({ error: "Erro ao gerar resposta do modelo." }, { status: 500 });
  }  
}


