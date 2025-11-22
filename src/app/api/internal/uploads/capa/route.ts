


import { getSupabaseClient } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client"


/**
 * PrismaClient é o client do ORM Prisma para realizar consultas e transações com o banco de dados.
 * Recomendado criar apenas uma instância por execução, especialmente em ambientes serverless.
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client
 */

const prisma = new PrismaClient();
const supabase = getSupabaseClient();

 
/**
 * Função assíncrona para fazer upload de um arquivo no Supabase Storage.
 *
 * @param {File} file - O arquivo a ser enviado.
 * @returns {Promise<string | null>} A URL pública do arquivo salvo ou null em caso de erro.
 */
async function uploadFile(file: File, path: string) {
  // Limpa o nome do arquivo: remove espaços, acentos e caracteres especiais
  const sanitizedFileName = file.name
    .normalize("NFD") // Remove acentos
    .replace(/[\u0300-\u036f]/g, "") // Remove marcas de acento
    .replace(/\s+/g, '-') // Substitui espaços por hífen
    .replace(/[^a-zA-Z0-9.-]/g, ''); // Remove caracteres não permitidos (exceto ponto e hífen)

  const fileName = `${Date.now()}-${sanitizedFileName}`; // Nome único e limpo

  const { data, error } = await supabase.storage
    .from('tiviai-images')
    .upload(`${path}/${fileName}`, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    return null;
  }


  const { data: publicUrl } = supabase
    .storage
    .from('tiviai-images')
    .getPublicUrl(`${path}/${fileName}`);

  return publicUrl?.publicUrl;
}



/**
 * @swagger
 * /api/internal/uploads/capa:
 *   post:
 *     security:
 *       - BearerAuth: []
 *     summary: Realiza upload de arquivos
 *     description: Envia um arquivo em formato multipart/form-data e retorna a URL final após o upload.
 *     tags:
 *       - Interno - files and uploads
 *
 *     parameters:
 *       - in: query
 *         name: path
 *         required: false
 *         schema:
 *           type: string
 *         description: Caminho opcional onde o arquivo será salvo
 *         example: "pacientes/123"
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo a ser enviado
 *
 *     responses:
 *       200:
 *         description: Upload realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Upload realizado com sucesso!"
 *                 url:
 *                   type: string
 *                   example: "https://meuservidor.com/uploads/pasta/arquivo.png"
 *
 *       400:
 *         description: Nenhum arquivo enviado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Nenhum arquivo enviado"
 *
 *       500:
 *         description: Erro interno no servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro interno no servidor"
 */

export async function POST(req: Request) {
    const path = new URL(req.url).searchParams.get('path');
  try {
    // Obtém os dados da requisição
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

   // Chama a função de upload
   let fileUrl: string | null = null;
   fileUrl = await uploadFile(file,path||'');
     
    if (!fileUrl) {
      return NextResponse.json({ error: 'Erro ao salvar o arquivo' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Upload realizado com sucesso!', url: fileUrl });
  } catch (err) {
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}




//buscar a image do usuaio
// buscar a imagem do usuário
/**
 * @swagger
 * /api/internal/uploads/capa:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     summary: Retorna a URL pública da foto da capa do livro
 *     description: Busca a ulr da capa do livro do usuário pelo ID fornecido.
 *     tags:
 *       - Interno - files and uploads
 *
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *         example: "clvxyz123abc789"
 *
 *     responses:
 *       200:
 *         description: URL da imagem retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: "https://supabase.storage.com/bucket/capa/user123.png"
 *
 *       400:
 *         description: ID do usuário não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "ID do usuário não fornecido"
 *
 *       404:
 *         description: capa não encontrado ou sem imagem cadastrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Usuário ou imagem não encontrada"
 *
 *       500:
 *         description: Erro interno no servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro interno no servidor"
 */

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "ID do usuário não fornecido" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.photoprofile) {
      return NextResponse.json({ error: "Usuário ou capa não encontrada" }, { status: 404 });
    }

    // Se o campo photoprofile tiver URL completa, extrai só o path
    const path = user.photoprofile.replace(
      'https://qfpygaqyldmthqakmisq.supabase.co/storage/v1/object/public/tiviai-images/',
      ''
    );

    const { data: publicUrlData } = supabase
      .storage
      .from("tiviai-images")
      .getPublicUrl(path);

    if ( !publicUrlData?.publicUrl) {
      return NextResponse.json({ error: "Erro ao obter URL da imagem" }, { status: 500 });
    }

    return NextResponse.json({ url: publicUrlData.publicUrl });
  } catch (err) {
  
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
