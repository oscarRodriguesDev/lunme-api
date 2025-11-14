import OpenAI from "openai";
import { NextResponse } from "next/server";
import { generateAnamnese } from "@/app/util/Anamnese";
import { useCredit } from "@/hooks/useCredits";


 
//export const runtime = 'edge';
export const runtime = 'nodejs';


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


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


