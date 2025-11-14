

   import { NextResponse } from "next/server";
   import { PrismaClient } from "@prisma/client";

   const prisma = new PrismaClient();

   //função vai salvar os dados no banco de dados
   

   /**
 * @swagger
 * /api/cookies-consent:
 *   post:
 *     summary: Registra consentimento do usuário
 *     description: Salva os dados de consentimento do usuário, incluindo IP, data, hora, nome e CPF.
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
 *                 format: date
 *                 description: Data do consentimento
 *                 example: "2025-08-26"
 *               hora:
 *                 type: string
 *                 format: time
 *                 description: Hora do consentimento
 *                 example: "14:35"
 *               ip:
 *                 type: string
 *                 description: Endereço IP do usuário
 *                 example: "192.168.0.1"
 *               nome:
 *                 type: string
 *                 description: Nome do usuário
 *                 example: "João Silva"
 *               cpf:
 *                 type: string
 *                 description: CPF do usuário
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
 *                   example: "clv987654321"
 *                 ipNumber:
 *                   type: string
 *                   example: "192.168.0.1"
 *                 data_consent:
 *                   type: string
 *                   format: date
 *                   example: "2025-08-26"
 *                 hora_consent:
 *                   type: string
 *                   format: time
 *                   example: "14:35"
 *                 nome_consent:
 *                   type: string
 *                   example: "João Silva"
 *                 cpf_consent:
 *                   type: string
 *                   example: "123.456.789-00"
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