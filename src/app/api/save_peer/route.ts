import { NextResponse } from 'next/server';

let peerStorage: Record<string, string> = {}; // Armazena temporariamente os peerIds



/**
 * @swagger
 * /api/peers:
 *   get:
 *     summary: Recupera peerId associado a um iddinamico
 *     description: Retorna o peerId correspondente ao iddinamico fornecido como parâmetro de query. Se não houver correspondência, retorna 404.
 *     tags:
 *       - Peers
 *     parameters:
 *       - in: query
 *         name: iddinamico
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador dinâmico usado para buscar o peerId
 *         example: "abc123"
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
 *                   description: ID do peer
 *                   example: "peer_456XYZ"
 *                 id:
 *                   type: string
 *                   description: ID dinâmico fornecido
 *                   example: "abc123"
 *       400:
 *         description: Parâmetro iddinamico ausente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Falta o parâmetro iddinamico."
 *       404:
 *         description: Nenhum peerId encontrado para o iddinamico fornecido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Nenhum peerId encontrado para o iddinamico fornecido."
 *       500:
 *         description: Erro interno do servidor.
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
 *     summary: Salva um peerId associado a um iddinamico
 *     description: Recebe um identificador dinâmico (iddinamico) e um peerId e os armazena para uso posterior.
 *     tags:
 *       - Peers
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
 *                 description: Identificador dinâmico para associar ao peerId
 *                 example: abc123
 *               peerId:
 *                 type: string
 *                 description: ID do peer a ser salvo
 *                 example: peer_456XYZ
 *     responses:
 *       200:
 *         description: ID salvo com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ID salvo com sucesso
 *       400:
 *         description: Parâmetros obrigatórios ausentes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Faltam parâmetros obrigatórios
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro interno do servidor
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
