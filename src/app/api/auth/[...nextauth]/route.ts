

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient, UserRole } from "@prisma/client";
import { compare } from "bcryptjs";

const prisma = new PrismaClient();





const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        id: { label: 'Id', type: 'id' },
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
        role: { label: "role", type: 'UserRole' },
        crp: { label: "crp", type: 'string' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Email e senha são obrigatórios.");
          throw new Error("Email e senha são obrigatórios.");
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) {
          throw new Error("Usuario não existe no sistema"); //teste de erro
        }
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
         //redirecionar para tela de login
         throw new Error("Usuario ou senha incorretos!");
          //throw new Error("erro senha");
        }
        if (![UserRole.ADMIN, UserRole.PSYCHOLOGIST, UserRole.COMMON, UserRole.PISICOLOGO_ADM].includes(user.role)) {
          throw new Error("Acesso negado: este usuário não tem permissão.");
        }
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Adiciona `role` ao token quando o usuário faz login
      if (user) {
        token.id = user.id
        token.role = user.role; // Adiciona o role do usuário ao token
        token.crp = user.crp; 
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role as UserRole;
        session.user.id = token.id as string;
        session.user.crp = token.crp as string; // 👈 adicione isso
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
 pages: {
  signIn: "/login",
  signOut: "/",
  error: "/login"
},
});
export { handler as GET, handler as POST };

