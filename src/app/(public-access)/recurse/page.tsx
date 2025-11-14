"use client";
import { useState } from "react";
import HeadPage from "@/app/(private-access)/components/headPage";
import { FaRegCreditCard, FaUserCheck } from "react-icons/fa";
import { showErrorMessage, showSuccessMessage } from "../../util/messages";
//import { useAccessControl } from "@/app/context/AcessControl";

export default function CadastroAdmin() {
  const [formData, setFormData] = useState({
    name: "", // Altere para 'name' ao invés de 'nome'
    email: "",
    password: "", // Altere para 'password' ao invés de 'senha'
    confirmPassword: "", // Adicione 'confirmPassword' para validação
    role: "ADMIN", // Novo campo para selecionar a role
  });

  const [loading, setLoading] = useState(false);

  //const { role, hasRole } = useAccessControl(); // Obtém o papel e a função de verificação do contexto

  // Captura os valores dos inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Enviar os dados para o backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/register_admins", {  
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showSuccessMessage("Usuário cadastrado com sucesso!");
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "ADMIN", // Resetando a role para o valor padrão
        });
      } else {
        showErrorMessage(`Erro: ${data.message}`);
      }
    } catch (error) {
      showErrorMessage("Erro ao cadastrar usuário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeadPage title="Novo Administrador" icon={<FaUserCheck size={20} />} />
  
      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Cadastro de Usuário</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Nome"
          value={formData.name}
          onChange={handleChange}
          className="input-style"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={formData.email}
          onChange={handleChange}
          className="input-style"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={formData.password}
          onChange={handleChange}
          className="input-style"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmar Senha"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="input-style"
          required
        />
        
        {/* Campo de seleção para o tipo de usuário */}
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="input-style"
          required
        >
          <option value="ADMIN">Administrador</option>
          <option value="PSYCHOLOGIST">Psicólogo</option>
          <option value="COMMON">Comum</option>
        </select>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded w-full"
          disabled={loading}
        >
          {loading ? "Cadastrando..." : "Cadastrar Usuário"}
        </button>
      </form>
    </div>

   
    </>
  );
}
