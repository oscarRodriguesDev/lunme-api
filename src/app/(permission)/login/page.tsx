"use client";


import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { redirect, useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";
import Logo from '../../../../public/marca/logo.png'
import Link from "next/link";
import { KeyboardEvent } from 'react';
import { showErrorMessage, showInfoMessage, showSuccessMessage } from "@/app/util/messages";



export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const session = useSession()
  const [showPassword, setShowPassword] = useState(false);
  const [aviso, setAviso] = useState('')



  //função para logar
  const handleLogin = async () => {
    //veriicar se tem algo digitado em senha
    if (!password.trim()) {
     showErrorMessage("A senha não pode estar vazia");
     setAviso("Senha Inválida");
      return;
    }
    //verificar se email está vazio
    if (!email.trim()) {
      showErrorMessage("O e-mail não pode estar vazio");
      setAviso("E-mail Inválido");
      return;
    }
    try {
      const result = await signIn("credentials", { email, password, callbackUrl: `/common-page`, redirect: false });
      if (result?.error) {
        //experimental
        showErrorMessage(result?.error);
        setPassword('')
        if (result.error === 'Usuario não existe no sistema') {
          setEmail("");
        }
        throw new Error(result.error);
      } else {
        showSuccessMessage('Bem vindo a Lunme')
        /*  redirect('/common-page') */
        router.push('/common-page')
      }
      // Se não houver erro, o usuário será redirecionado automaticamente pelo NextAuth
    } catch (error) {
      setAviso('Usuário ou senha incorretos')
      setPassword(""); // Limpa a senha, mantendo o email
    }
  };



  //verificando estado do usuario
  useEffect(() => {
    if (session.status === 'unauthenticated') {
      return
    } else {
      router.push('/common-page')
    }
  }, [session]);

  //se eu clicar em enter, vai chamar o handleLogin
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };


  return (
<>
  <div className="min-h-screen bg-gradient-to-br from-[#0A4D4D] via-[#00736B] to-[#1E6F6F] flex items-center justify-center px-4">
    <div className="w-full max-w-md p-8 sm:p-10 bg-[#222222] rounded-3xl shadow-lg border border-[#333333]">
      
      <h1 className="flex items-center justify-center text-2xl sm:text-3xl font-semibold text-center text-[#A7FFF7] mb-6">
        <span>
          <Image src={Logo} alt="imagem logo" quality={100} className="w-10 h-10 mr-3" />
        </span>
        Login
      </h1>

      <div className="space-y-6">
        <input
          type="email"
          required
          placeholder="email@lunme.com.br"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          onBlur={() => {
            if (!email.includes('@') || !email.endsWith('.com.br')) {
              setAviso("Por favor, informe um e-mail válido!");
            } else {
              setAviso("");
            }
          }}
          className="w-full p-3 sm:p-4 border-2 border-[#3A3A3A] bg-[#1E6F6F] text-[#E6FAF6] placeholder-[#A7FFF7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1DD1C1]"
        />

        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            required
            name="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full p-3 sm:p-4 border-2 border-[#3A3A3A] bg-[#1E6F6F] text-[#E6FAF6] placeholder-[#A7FFF7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1DD1C1] pr-10"
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (!password.trim()) {
                setAviso("A senha não pode estar vazia");
              } else {
                setAviso("");
              }
            }}
          />

          <p className="absolute  text-xs text-[#ff1515] p-2 text-center">
            {aviso}
          </p>

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-[#A7FFF7]"
          >
            {showPassword ? <FaEyeSlash size={11} /> : <FaEye size={12} />}
          </button>
        </div>

        <input
          type="button"
          onClick={handleLogin}
          className="w-full py-3 bg-[#1DD1C1] text-[#0A4D4D] rounded-lg hover:bg-[#009E9D] focus:outline-none focus:ring-2 focus:ring-[#55FF00]"
          value="Acessar"
        />

        <button
          onClick={() => router.push('/pre-cadastro')}
          className="w-full py-3 text-[#1DD1C1] border-2 border-[#1DD1C1] rounded-lg hover:bg-[#1DD1C1] hover:text-[#0A4D4D] focus:outline-none focus:ring-2 focus:ring-[#55FF00]"
        >
          Cadastre-se
        </button>
      </div>

      <div className="mt-6 text-center flex flex-col sm:flex-row justify-center gap-2 text-sm">
        <Link href="/recupera" className="text-[#A7FFF7] hover:text-[#55FF00]">
          Esqueceu a senha?
        </Link>
        <a
          href="https://lunme.com.br"
          rel="noopener noreferrer"
          className="text-[#A7FFF7] hover:text-[#55FF00]"
        >
          Voltar
        </a>
      </div>
    </div>
  </div>
</>

  );
}

