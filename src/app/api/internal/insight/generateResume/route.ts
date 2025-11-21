import OpenAI from "openai";
import { NextResponse } from "next/server";
import { resumeBook } from "@/app/util/resumebook";
import { useCredit } from "@/hooks/useCredits";

//export const runtime = 'edge';
export const runtime = 'nodejs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});



/**
 * @swagger
 * /api/internal/insight/generateResume:
 *   post:
 *     summary: Gera um resumo de livro usando IA
 *     description: Recebe o título e o autor do livro, gera um prompt e retorna um resumo criado pela IA.
 *     tags:
 *       - Interno - IA / Livros
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário que consumirá crédito
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Título do livro
 *                 example: "O Poder do Hábito"
 *               autor:
 *                 type: string
 *                 description: Autor do livro
 *                 example: "Charles Duhigg"
 *             required:
 *               - titulo
 *               - autor
 *     responses:
 *       200:
 *         description: Resumo gerado pela IA
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   example: "O livro explica como os hábitos funcionam e como podem ser transformados..."
 *       400:
 *         description: Erro por dados ausentes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Título e autor são obrigatórios."
 *       500:
 *         description: Erro interno ao gerar resposta
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
  
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") as string;


 const { titulo, autor } = await req.json();
  if (!titulo || !autor) {
    return NextResponse.json({ error: "Título e autor são obrigatórios." }, { status: 400 });
  }
  const prompt = resumeBook(titulo, autor);
  try {
    const completion = await openai.chat.completions.create({
    /*   model: "gpt-4o-mini", */
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
       max_tokens: 2000
    });
    const content = completion.choices[0]?.message?.content || "Sem resposta.";
    await useCredit(userId,1);
    return NextResponse.json({ result: content });

  } catch (error: any) {
    return NextResponse.json({ error: "Erro ao gerar resposta do modelo." }, { status: 500 });
  } 
}


