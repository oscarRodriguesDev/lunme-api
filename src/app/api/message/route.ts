import { NextResponse } from 'next/server';




const transcriptionStorage: Record<string, Set<string>> = {};


/**
 * @swagger
 * /api/message:
 *   get:
 *     summary: Recupera mensagens transcritas de uma sala
 *     description: Retorna a transcrição completa armazenada temporariamente para a sala informada.
 *     tags:
 *       - Transcrição
 *
 *     parameters:
 *       - in: query
 *         name: sala
 *         required: true
 *         description: Identificador único da sala onde as mensagens foram armazenadas.
 *         schema:
 *           type: string
 *         example: "sala_12345"
 *
 *     responses:
 *       200:
 *         description: Transcrição retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transcript:
 *                   type: string
 *                   example: "Olá, tudo bem?\nPodemos começar a consulta agora."
 *
 *       400:
 *         description: Parâmetro obrigatório ausente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Parâmetro \"sala\" é obrigatório."
 *
 *       500:
 *         description: Erro interno no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro interno do servidor."
 */


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sala = searchParams.get('sala');

    if (!sala) {
      return NextResponse.json({ message: 'Parâmetro "sala" é obrigatório.' }, { status: 400 });
    }

    const salaTranscripts = transcriptionStorage[sala];

    if (!salaTranscripts || salaTranscripts.size === 0) {
      return NextResponse.json({ transcript: '' }, { status: 200 });
    }

    const fullTranscription = Array.from(salaTranscripts).join("\n");
    return NextResponse.json({ transcript: fullTranscription }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}


/**
 * @swagger
 * /api/message:
 *   post:
 *     summary: Adiciona um trecho de transcrição a uma sala
 *     description: Recebe texto transcrito e armazena temporariamente no servidor dentro da sala indicada.
 *     tags:
 *       - Transcrição
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sala
 *               - transcript
 *             properties:
 *               sala:
 *                 type: string
 *                 description: Identificador único da sala.
 *                 example: "sala_12345"
 *               transcript:
 *                 type: string
 *                 description: Trecho de texto transcrito que será armazenado.
 *                 example: "O paciente relatou melhora desde a última sessão."
 *
 *     responses:
 *       201:
 *         description: Transcrição adicionada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Transcrição salva com sucesso."
 *                 transcript:
 *                   type: string
 *                   example: "O paciente relatou melhora desde a última sessão."
 *
 *       400:
 *         description: Dados inválidos enviados ao servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Dados inválidos. Informe \"sala\" e \"transcript\"."
 *
 *       500:
 *         description: Erro interno ao processar a requisição.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro interno do servidor."
 */


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sala, transcript } = body;

    if (!sala || typeof transcript !== 'string' || transcript.trim() === '') {
      return NextResponse.json({ message: 'Dados inválidos. Informe "sala" e "transcript".' }, { status: 400 });
    }

    if (!transcriptionStorage[sala]) {
      transcriptionStorage[sala] = new Set();
    }

    transcriptionStorage[sala].add(transcript);

    return NextResponse.json({ message: 'Transcrição salva com sucesso.', transcript }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}
