import { NextResponse } from 'next/server';

let peerStorage: Record<string, string> = {}; // Armazena temporariamente os peerIds



/**
 * @swagger
 * /api/save_peer:
 *   get:
 *     summary: Recupera o peerId associado a um iddinamico
 *     description: Retorna o peerId salvo no peerStorage a partir de um identificador dinâmico usado nas conexões P2P.
 *     tags:
 *       - Peer
 *     parameters:
 *       - in: query
 *         name: iddinamico
 *         required: true
 *         schema:
 *           type: string
 *         description: ID dinâmico usado para mapear um peerId no servidor.
 *     responses:
 *       200:
 *         description: PeerId encontrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 peerId:
 *                   type: string
 *                   description: Peer ID vinculado ao iddinamico.
 *                 id:
 *                   type: string
 *                   description: Mesmo iddinamico fornecido.
 *             example:
 *               peerId: "peer-1287312-xas"
 *               id: "abc123"
 *       400:
 *         description: Parâmetro iddinamico não fornecido.
 *         content:
 *           application/json:
 *             example:
 *               message: "Falta o parâmetro iddinamico."
 *       404:
 *         description: Nenhum peerId encontrado.
 *         content:
 *           application/json:
 *             example:
 *               message: "Nenhum peerId encontrado para o iddinamico fornecido."
 *       500:
 *         description: Erro interno no servidor.
 *         content:
 *           application/json:
 *             example:
 *               message: "Erro interno do servidor."
 */

export async function GET(req: Request) {
  interface peerProps {
    peerId: string;
    id: string | any;
  }

  try {
    // Extrair o iddinamico da URL
    const url = new URL(req.url);
    const iddinamico = url.searchParams.get('iddinamico'); // Supondo que iddinamico é passado como parâmetro na URL

    if (!iddinamico) {
      return NextResponse.json({ message: 'Falta o parâmetro iddinamico.' }, { status: 400 });
    }

    // Buscar o peerId usando a chave iddinamico
    const peerId = peerStorage[iddinamico];

    if (!peerId) {
     
      return NextResponse.json({ message: 'Nenhum peerId encontrado para o iddinamico fornecido.' }, { status: 404 }); 
    }

    // Retornar o peerId e o iddinamico
    const response: peerProps = { peerId, id: iddinamico };
    return NextResponse.json(response, { status: 200 });

  } catch (error) {
       return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}




/**
 * @swagger
 * /api/save_peer:
 *   post:
 *     summary: Registra ou atualiza o peerId associado a um iddinamico
 *     description: Salva um peerId no armazenamento interno (peerStorage) vinculado ao identificador dinâmico enviado pelo cliente.
 *     tags:
 *       - Peer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - iddinamico
 *               - peerId
 *             properties:
 *               iddinamico:
 *                 type: string
 *                 description: Identificador dinâmico usado como chave.
 *               peerId:
 *                 type: string
 *                 description: Peer ID a ser associado ao iddinamico.
 *           example:
 *             iddinamico: "abc123"
 *             peerId: "peer-091283-asd"
 *     responses:
 *       200:
 *         description: PeerId salvo com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               message: "ID salvo com sucesso."
 *       400:
 *         description: Parâmetros ausentes.
 *         content:
 *           application/json:
 *             example:
 *               message: "Faltam parâmetros obrigatórios."
 *       500:
 *         description: Erro interno no servidor.
 *         content:
 *           application/json:
 *             example:
 *               message: "Erro interno do servidor."
 */

export async function POST(req: Request) {
  try {
    const { iddinamico, peerId } = await req.json();

    if (!iddinamico || !peerId) {
      return NextResponse.json({ message: 'Faltam parâmetros obrigatórios.' }, { status: 400 });
    }

    // Armazenar o peerId no peerStorage
    peerStorage[iddinamico] = peerId; // Salva o peerId com a chave iddinamico
    return NextResponse.json({ message: 'ID salvo com sucesso.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}
