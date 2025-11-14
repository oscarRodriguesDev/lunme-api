import OpenAI from "openai";
import { NextResponse } from "next/server";
import { resumeBook } from "@/app/util/resumebook";
import { useCredit } from "@/hooks/useCredits";

//export const runtime = 'edge';
export const runtime = 'nodejs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});



// Rota para gerar resumo pelo gpt
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


