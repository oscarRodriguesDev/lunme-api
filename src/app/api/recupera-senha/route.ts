import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from 'nodemailer';
import cryptoRandomString from 'crypto-random-string';
import bcrypt from 'bcrypt';



const prisma = new PrismaClient();

/**
 * Gera uma senha aleatória composta por caracteres alfanuméricos.
 * 
 * @param {number} [tamanho=8] - O comprimento da senha a ser gerada (valor padrão: 8).
 * @returns {string} - Retorna a senha gerada em formato de string.
 */
function gerarSenhaAleatoria(tamanho: number = 8): string {
  const senha = cryptoRandomString({ length: tamanho, type: 'alphanumeric' });
  return senha
}


/**
 * Notifica por e-mail que o usuário foi habilitado com sucesso.
 * 
 * @param {string} email - E-mail do usuário que será notificado.
 * @param {string} nome - Nome do usuário habilitado.
 * @param {string} email_system - E-mail gerado para acessar a plataforma.
 * @param {string} senha - Senha temporária gerada para o primeiro acesso.
 */
async function notificar(email: string, nome: string, email_system: string, senha: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_RESPONSE,
      pass: process.env.KEY_EMAIL_RESPONSE,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_RESPONSE,
    to: email,
    subject: 'Recuperação de Senha',
    text: `Olá ${nome},\n\n
    Recentemente voce solicitou a recuperação da sua senha no Lunme.
     Estamos enviando uma senha provisória para que você possa acessar sua conta.\n\n
    Aqui estão os dados para login:
  
    Email: ${email_system}
    Senha provisória: ${senha}
  
    Após o primeiro login, por favor, altere sua senha para garantir a segurança da sua conta.\n\n
    Se você não solicitou essa recuperação, por favor, ignore este e-mail ou entre em contato conosco.\n\n
    Atenciosamente,\n
    Equipe Lunme`
  };
  
  try {
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
  }
}



/**
 * @swagger
 * /api/recupera-senha:
 *   put:
 *     summary: Recuperação de senha
 *     description: Envia uma nova senha provisória para o e-mail do usuário, caso o e-mail esteja cadastrado e confirmado.
 *     tags:
 *       - Autenticação
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: E-mail cadastrado no sistema.
 *                 example: "usuario@example.com"
 *
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso e enviada por e-mail.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Senha alterada com sucesso. Verifique seu e-mail para a nova senha."
 *
 *       400:
 *         description: E-mail não enviado ou e-mail não confirmado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "E-mail não confirmado. Não é possível realizar a recuperação de senha."
 *
 *       404:
 *         description: E-mail não encontrado no sistema.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "E-mail não encontrado."
 *
 *       500:
 *         description: Erro interno ao tentar realizar a recuperação de senha.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao tentar recuperar a senha."
 */

export async function PUT(req: Request) {
    const { email } = await req.json(); // Supondo que o corpo da requisição tenha o email fornecido pelo usuário
  
    if (!email) {
      return NextResponse.json({ message: "E-mail não fornecido." }, { status: 400 });
    }
  
    try {
      // Verificar se o usuário com o e-mail fornecido existe no banco de dados
      const usuario = await prisma.user.findUnique({
        where: { email },
        select: { email_confirm: true, name: true } // Incluindo o campo email_confirm na consulta
      });
  
      if (!usuario) {
        return NextResponse.json({ message: "E-mail não encontrado." }, { status: 404 });
      }
  
      // Verificar se o email_confirm foi preenchido
      if (!usuario.email_confirm) {
        return NextResponse.json({ message: "E-mail não confirmado. Não é possível realizar a recuperação de senha." }, { status: 400 });
      }
  
      // Gerar uma nova senha aleatória
      const novaSenha = gerarSenhaAleatoria(8); // Definindo a senha provisória com tamanho de 8 caracteres
  
      // Criptografar a nova senha antes de armazená-la no banco de dados
      const senhaCriptografada = await bcrypt.hash(novaSenha, 10);
  
      // Atualizar a senha no banco de dados
      await prisma.user.update({
        where: { email },
        data: { password: senhaCriptografada,first_acess:true }
      });
  
      // Enviar e-mail com a nova senha provisória
      await notificar(usuario.email_confirm, usuario.name, email, novaSenha);
  
      // Retornar sucesso
      return NextResponse.json({ message: "Senha alterada com sucesso. Verifique seu e-mail para a nova senha." }, { status: 200 });
    } catch (error) {
  
      return NextResponse.json({ message: "Erro ao tentar recuperar a senha." }, { status: 500 });
    }
  }
  