import React, { useState } from 'react';
import bcrypt from 'bcryptjs';
import { Psicologo } from '../../../../../../types/psicologos';
import { showErrorMessage,showInfoMessage } from '@/app/util/messages';




interface Props extends Psicologo {
  onClose: () => void;
}

const AlteracaoSenha: React.FC<Props> = ({ id, email, nome, password, first_acess, onClose }) => {
  const [senhaAntiga, setSenhaAntiga] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [repetirSenha, setRepetirSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (novaSenha !== repetirSenha) {
      setErro('As senhas não coincidem!');
      return;
    }
    if (novaSenha.length < 6) {
      setErro('A nova senha deve ter pelo menos 6 caracteres!');
      return;
    }
    try {
      const senhaCriptografada = await bcrypt.hash(novaSenha, 10);
      const senhaAtualizada = {
        id,
        first_acess: false,
        password: senhaCriptografada,
      };
      const response = await fetch(`/api/internal/user-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(senhaAtualizada),
      });
      if (response.ok) {
        setSucesso('Senha alterada com sucesso!');
        setErro('');
        setSenhaAntiga('');
        setNovaSenha('');
        setRepetirSenha('');
        showInfoMessage('Senha alterada com sucesso! Você será redirecionado em breve.');
      

        setTimeout(() => onClose(), 2000); // Fecha após sucesso
      } 
    } catch (error) {
      showErrorMessage(`Erro ao alterar senha: ${error}`);
      setErro('Erro ao alterar a senha. Tente novamente.');
    }
  };



  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
    <div className="w-full max-w-md bg-[#1D3330] rounded-2xl shadow-xl p-8 border border-[#3D975B]/30">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold text-[#55FF00] mb-2">Alteração de Senha</h2>
        <p className="text-[#E6FAF6] text-sm">
          Bem-vindo(a) à plataforma <span className="font-semibold text-[#55FF00]">Lunme</span>!<br />
          Como este é seu primeiro acesso, é necessário criar uma nova senha.
        </p>
      </div>
  
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { id: "senhaAntiga", label: "Senha antiga", value: senhaAntiga, setter: setSenhaAntiga },
          { id: "novaSenha", label: "Nova senha", value: novaSenha, setter: setNovaSenha },
          { id: "repetirSenha", label: "Repetir nova senha", value: repetirSenha, setter: setRepetirSenha },
        ].map(({ id, label, value, setter }) => (
          <div key={id}>
            <label htmlFor={id} className="block text-sm font-medium text-[#E6FAF6]">{label}</label>
            <input
              type="password"
              id={id}
              value={value}
              onChange={(e) => setter(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg border-[#33564F] bg-[#0F1113] text-[#E6FAF6] focus:outline-none focus:ring-2 focus:ring-[#55FF00]"
              required
            />
          </div>
        ))}
  
        {erro && <div className="text-red-500 text-sm">{erro}</div>}
        {sucesso && <div className="text-green-500 text-sm">{sucesso}</div>}
  
        <div className="pt-2 flex flex-col gap-3">
          <button
            type="submit"
            className="w-full py-2 bg-[#55FF00] text-[#0F1113] rounded-lg font-semibold hover:bg-[#3D975B] transition"
          >
            Alterar senha
          </button>
  
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 border border-[#55FF00] text-[#55FF00] rounded-lg font-semibold hover:bg-[#55FF00]/20 transition"
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  </div>
  
  );
};

export default AlteracaoSenha;
