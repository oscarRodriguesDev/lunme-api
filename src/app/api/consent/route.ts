

   import { NextResponse } from "next/server";
   import { PrismaClient } from "@prisma/client";

   const prisma = new PrismaClient();


//consentimeno de dados   
   export async function POST(req:Request){
   try {
     const { data, hora, ip, nome, cpf } = await req.json();

     const consent = await prisma.consents_Agreements.create({
       data: {
         ipNumber: ip,
         data_consent: data,
         hora_consent: hora,
         nome_consent: nome,
         cpf_consent: cpf
       }
     });

     return NextResponse.json(consent, { status: 201 });
   } catch (error) {
    console.log(error)
     return NextResponse.json(
       { error: 'Erro ao salvar consentimento' },
       { status: 500 }
     );
   }

   }