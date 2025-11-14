import OpenAI from "openai";
import { NextResponse } from "next/server";
import { avaliação } from "@/app/util/promptProntuario";


export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


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
