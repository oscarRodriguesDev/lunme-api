


import { getSupabaseClient } from '@/lib/supabaseClient';
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";


/**
 * PrismaClient é o client do ORM Prisma para realizar consultas e transações com o banco de dados.
 * Recomendado criar apenas uma instância por execução, especialmente em ambientes serverless.
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client
 */

const prisma = new PrismaClient();
const supabase = getSupabaseClient();
 


async function uploadFile(file: File, path: string, id: string) {
  const bucket = supabase.storage.from('tiviai-images');

  // Extrai extensão
  const ext = file.name.split('.').pop()?.toLowerCase() || '';

  // Nome fixo para o usuário
  const fileName = `image-${id}.${ext}`;

  // Listar arquivos na pasta para esse usuário (assumindo que estão todos no mesmo path)
  const { data: filesList, error: listError } = await bucket.list(path, {
    search: `photoprofile${id}`,
    limit: 100,
  });

  if (listError) {
    console.error('Erro ao listar arquivos:', listError);
    return null;
  }

  // Deletar arquivos antigos que não sejam o atual (diferente por extensão)
  const filesToDelete = filesList?.filter(f => f.name !== fileName).map(f => f.name) || [];

  if (filesToDelete.length > 0) {
    const { error: deleteError } = await bucket.remove(
      filesToDelete.map(name => `${path}/${name}`)
    );

    if (deleteError) {
      console.error('Erro ao deletar arquivos antigos:', deleteError);
      return null;
    }
  }

  // Fazer upload com upsert true (sobrescreve o arquivo atual)
  const { data, error } = await bucket.upload(`${path}/${fileName}`, file, {
    cacheControl: '0',
    upsert: true,
  });

  if (error) {
    console.error('Erro no upload:', error);
    return null;
  }

  const { data: publicUrl } = bucket.getPublicUrl(`${path}/${fileName}`);

  return publicUrl?.publicUrl ? `${publicUrl.publicUrl}?t=${Date.now()}` : null;
}





/**
 * @swagger
 * /api/internal/uploads/profile:
 *   post:
 *     security:
 *       - BearerAuth: []
 *     summary: Faz upload de um arquivo para o storage
 *     description: |
 *       Realiza o upload de um arquivo para o bucket correto, dependendo do valor do parâmetro `path`.
 *       - `profile-pictures` → envia para a pasta de fotos de perfil  
 *       - `banner` → envia para a pasta de banners  
 *       O parâmetro `id` é opcional e pode ser usado como nome ou referência do arquivo.
 *
 *     tags:
 *       - Interno - files and uploads
 *
 *     parameters:
 *       - in: query
 *         name: path
 *         required: true
 *         schema:
 *           type: string
 *           enum: [profile-pictures, banner]
 *         description: Pasta de destino do arquivo
 *         example: "profile-pictures"
 *
 *       - in: query
 *         name: id
 *         required: false
 *         schema:
 *           type: string
 *         description: ID opcional para identificar o arquivo
 *         example: "clzw123abc987"
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
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
 *                   example: "https://supabase.../profile-pictures/abc123.png"
 *
 *       400:
 *         description: Erro de validação (arquivo ausente ou parâmetros inválidos)
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
 *         description: Erro interno no servidor ao processar o upload
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
    const id = new URL(req.url).searchParams.get('id');
  try {
    // Obtém os dados da requisição
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    // Chama a função de upload
    //testar se o path é profile-pictures ou banner 
    let fileUrl: string | null = null;
    if (path === 'profile-pictures') {
      fileUrl = await uploadFile(file, 'profile-pictures',id||'');
    } else if (path === 'banner') {
      fileUrl = await uploadFile(file, 'banner',id||"");
    }
    if (!fileUrl) {
      return NextResponse.json({ error: 'Erro ao salvar o arquivo' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Upload realizado com sucesso!', url: fileUrl });
  } catch (err) {
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}




/**
 * @swagger
 * /api/internal/uploads/profile:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     summary: Retorna a URL pública da foto de perfil do usuário
 *     description: |
 *       Busca a imagem de perfil salva no Supabase Storage e retorna a URL pública.
 *       Caso o campo `photoprofile` contenha uma URL completa, apenas o path é extraído.
 *
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
 *         example: "clzw0t3p8000dxoyxk2h4y1ab"
 *
 *     responses:
 *       200:
 *         description: URL pública da imagem retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: "https://qfpygaqyldmthqakmisq.supabase.co/storage/v1/object/public/tiviai-images/profile-pictures/abc123.png"
 *
 *       400:
 *         description: Erro de requisição (userId ausente)
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
 *         description: Usuário não encontrado ou sem foto de perfil
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
 *         description: Erro interno ao gerar a URL pública
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao obter URL da imagem"
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
      return NextResponse.json({ error: "Usuário ou imagem não encontrada" }, { status: 404 });
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
