


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
 

/* async function uploadFile(file: File, path: string, id: string) {
  // Limpa o nome do arquivo: remove espaços, acentos e caracteres especiais
  console.log('id', id)
  const sanitizedFileName = file.name
    .normalize("NFD") // Remove acentos
    .replace(/[\u0300-\u036f]/g, "") // Remove marcas de acento
    .replace(/\s+/g, '-') // Substitui espaços por hífen
    .replace(/[^a-zA-Z0-9.-]/g, ''); // Remove caracteres não permitidos (exceto ponto e hífen)

  const fileName = `photoprofile${id}`; // Nome único e limpo

  const { data, error } = await supabase.storage
    .from('tiviai-images')
    .upload(`${path}/${fileName}`, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    return null;
  }


  const { data: publicUrl } = supabase
    .storage
    .from('tiviai-images')
    .getPublicUrl(`${path}/${fileName}`);

  return publicUrl?.publicUrl;
} */



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





// Função que recebe a requisição POST e chama `uploadFile`
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




//buscar a image do usuaio
// buscar a imagem do usuário
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
