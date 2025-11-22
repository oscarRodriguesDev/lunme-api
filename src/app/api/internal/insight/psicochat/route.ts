import OpenAI from "openai";
import { NextResponse } from "next/server";
import { generate } from "@/app/util/GenericPrompts";
import { useCredit } from "@/hooks/useCredits";


//export const runtime = 'edge';
export const runtime = 'nodejs';


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


/**
 * @swagger
 * /api/internal/insight/psicochat:
 *   post:
 *     security:
 *       - BearerAuth: []
 *     summary: Gera texto clínico baseado na transcrição e informações do paciente usando IA
 *     description: "Recebe transcrição, modelo, nome do psicólogo, CRP e nome do paciente. Gera texto estruturado com base no modelo informado."
 *     tags:
 *       - Interno - IA / Documentos Clínicos
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID do usuário responsável pela geração e consumo de créditos"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: "Transcrição recebida (texto base)"
 *                 example: "Paciente relata ansiedade frequente e dificuldade para dormir..."
 *               prompt:
 *                 type: string
 *                 description: "Modelo de documento desejado, por exemplo: relatório, evolução, anamnese"
 *                 example: "modelo_evolucao"
 *               nomePaciente:
 *                 type: string
 *                 description: "Nome do paciente"
 *                 example: "João Silva"
 *               nomePsicologo:
 *                 type: string
 *                 description: "Nome do psicólogo"
 *                 example: "Dra. Ana Souza"
 *               crpPsicologo:
 *                 type: string
 *                 description: "Número do CRP do psicólogo"
 *                 example: "CRP-12/12345"
 *             required:
 *               - message
 *               - prompt
 *               - nomePaciente
 *               - nomePsicologo
 *               - crpPsicologo
 *     responses:
 *       200:
 *         description: "Texto clínico gerado com sucesso"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 *                   example: "Paciente apresentou evolução positiva..."
 *       400:
 *         description: "Erro por parâmetros insuficientes ou créditos indisponíveis"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Creditos insuficientes ou invalidos, favor verificar seu saldo."
 *       500:
 *         description: "Erro interno ao gerar o texto com IA"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao gerar resposta do modelo."
 */

export async function POST(req: Request): Promise<NextResponse<{ error: string; }> | NextResponse<{ response: string; }>> {
  //var retorno = ''

  const { searchParams } = new URL(req.url);
  // const model = searchParams.get('prompt'); //parametnro
  const userId = searchParams.get("userId") as string;


  const {
    message: transcription,
    prompt: model,
    nomePaciente: nomePaciente,
    nomePsicologo: nomePsicologo,
    crpPsicologo: crpPsicologo


  } = await req.json();


  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split('T')[0];


  const prompt = generate(transcription, String(model), nomePsicologo, crpPsicologo,nomePaciente);

  if (!transcription) {
    return NextResponse.json({ error: "Mensagem não fornecida." }, { status: 400 });
  }
  const promptMessage = `
    ${prompt} 
`



  console.log("Prompt:", promptMessage);
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2000
    });

    const content = completion.choices[0]?.message?.content || "Sem resposta.";
    try{

      await useCredit(userId, 1)
    }catch(err){
      return NextResponse.json({ error: "Creditos insuficientes ou invalidos, favor verificar seu saldo: " + err }, { status: 400 });
    }
  
    return NextResponse.json({ response: content });

  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ error: "Erro ao gerar resposta do modelo." }, { status: 500 });
  }
}

