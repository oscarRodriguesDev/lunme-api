

   import { NextResponse } from "next/server";
   import { PrismaClient } from "@prisma/client";

   const prisma = new PrismaClient();


/**
 * @swagger
 * /api/consent:
 *   post:
 *     summary: Registra um novo consentimento do usuário.
 *     description: Salva no banco de dados a confirmação do termo de consentimento, incluindo IP, data, hora, nome e CPF.
 *     tags:
 *       - Consentimento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - data
 *               - hora
 *               - ip
 *               - nome
 *               - cpf
 *             properties:
 *               data:
 *                 type: string
 *                 example: "2025-11-17"
 *               hora:
 *                 type: string
 *                 example: "23:55:12"
 *               ip:
 *                 type: string
 *                 example: "192.168.0.10"
 *               nome:
 *                 type: string
 *                 example: "Oscar Rodrigues"
 *               cpf:
 *                 type: string
 *                 example: "123.456.789-00"
 *     responses:
 *       201:
 *         description: Consentimento registrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "clxyz0987"
 *                 ipNumber:
 *                   type: string
 *                 data_consent:
 *                   type: string
 *                 hora_consent:
 *                   type: string
 *                 nome_consent:
 *                   type: string
 *                 cpf_consent:
 *                   type: string
 *       500:
 *         description: Erro interno ao salvar consentimento.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao salvar consentimento"
 */
 
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