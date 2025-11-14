'use client'

import { showErrorMessage, showInfoMessage } from "@/app/util/messages";
import { ReactEventHandler, useState } from "react";

const RecuperarSenha = () => {

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Função para enviar a solicitação de recuperação de acesso
  async function solicitarAcesso(email: string) {
    try {
      // Verificar se o e-mail não está vazio
      if (!email) {
        showErrorMessage("Por favor, forneça um e-mail válido.");
        return;
      }

      // Fazer a requisição para a rota de recuperação de senha
      const response = await fetch('/api/recupera-senha', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      // Verificar se a resposta foi bem-sucedida
      if (response.ok) {
        // Sucesso: exibir uma mensagem ao usuário
        showInfoMessage('Se o e-mail for válido, você receberá uma nova senha em breve.');
      } else {
        // Se o email não for encontrado, nada será mostrado
        // Então não informamos nada ao usuário (comportamento esperado)
      }
    } catch (error) {

      showErrorMessage("Ocorreu um erro ao tentar recuperar sua senha. Tente novamente mais tarde.");
    }
  }



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await solicitarAcesso(email);
    setLoading(false);
  };


  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-[#111111] px-4 relative overflow-hidden">

  
  
      {/* Conteúdo principal acima do fundo */}
      <div className="relative z-10 w-full max-w-md bg-[#1E1E1E] rounded-2xl shadow-lg p-8 border border-[#333333]">
        <h1 className="text-2xl font-bold text-center text-[#1DD1C1] mb-4">
          Recuperação de Senha
        </h1>
        <p className="text-center text-[#E6FAF6] text-sm mb-6">
          Digite o seu e-mail do <strong>Lunme</strong> e enviaremos uma senha provisória para acessar a plataforma.
        </p>
  
        <form onSubmit={handleSubmit} method="PUT" className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-[#E6FAF6] mb-1">
              E‑mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-[#444444] rounded-lg bg-[#222222] text-sm text-[#E6FAF6] placeholder:text-[#777777] focus:outline-none focus:ring-2 focus:ring-[#1DD1C1]"
              placeholder="seuemail@Lunme.com.br"
              required
            />
          </div>
  
          <button
            type="submit"
            className="w-full bg-[#1DD1C1] hover:bg-[#009E9D] text-[#111111] py-3 rounded-xl text-sm font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#1DD1C1]/50"
          >
            Enviar acesso provisório
          </button>
        </form>
  
        <div className="mt-6 text-center text-sm text-[#E6FAF6]">
          <p>
            Lembrou sua senha?{' '}
            <a href="/login" className="text-[#1DD1C1] font-medium hover:underline">
              Voltar para o login
            </a>
          </p>
        </div>
      </div>
    </div>
  </>
  
  );
};

export default RecuperarSenha;
