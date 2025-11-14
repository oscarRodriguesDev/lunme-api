'use client'

import { useState, ChangeEvent } from "react";
import { CgProfile } from "react-icons/cg";
import HeadPage from "@/app/(private-access)/components/headPage";
import { Paciente } from "../../../../../../types/paciente"; // ajuste o caminho conforme sua estrutura

const pacienteMock: Paciente = {
  id: "1a2b3c4d-uuid-mock",
  nome: "Maria Silva",
  fantasy_name: "Maria Psicóloga",
  cpf: "123.456.789-00",
  idade: "35",
  sintomas: "Ansiedade, insônia",
  telefone: "(11) 99999-9999",
  convenio: "Unimed",
  sexo: "feminino",
  cep: "01234-567",
  cidade: "São Paulo",
  bairro: "Centro",
  rua: "Rua das Flores",
  numero: "123",
  pais: "Brasil",
  complemento: "Apto 45",
  estado: "SP",
  email: "maria.silva@email.com",
  rg: "12.345.678-9",
  psicologoId: "abc123xyz",
  result_amnp:['null'],
  resumo_anmp:''
};

const labels: Record<keyof Paciente, string> = {
  id: "ID",
  nome: "Nome",
  fantasy_name: "Nome Fantasia",
  cpf: "CPF",
  idade: "Idade",
  sintomas: "Sintomas",
  telefone: "Telefone",
  convenio: "Convênio",
  sexo: "Sexo",
  cep: "CEP",
  cidade: "Cidade",
  bairro: "Bairro",
  rua: "Rua",
  numero: "Número",
  pais: "País",
  complemento: "Complemento",
  estado: "Estado",
  email: "Email",
  rg: "RG",
  psicologoId: "ID Psicólogo",
    result_amnp: 'lista',
  resumo_anmp:'resumo'
};

export default function PerfilPacientePage() {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Paciente>(pacienteMock);

  const dadosPessoaisFields: (keyof Paciente)[] = [
    "nome",
    "cpf",
    "rg",
    "sexo",
    "idade",
    "fantasy_name",
    "psicologoId",
    "convenio",
    "sintomas",
  ];

  const contatoFields: (keyof Paciente)[] = ["telefone", "email"];

  const enderecoFields: (keyof Paciente)[] = [
    "cep",
    "cidade",
    "bairro",
    "rua",
    "numero",
    "pais",
    "complemento",
    "estado",
  ];

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    alert("Dados salvos! (Mock)");
    setEditMode(false);
  };

  const handleCancel = () => {
    setFormData(pacienteMock);
    setEditMode(false);
  };

  return (
    <>
    <HeadPage title="Perfil do Paciente" icon={<CgProfile size={20} />} />
  
    <main className="max-w-5xl mx-auto p-6 bg-[#0F1113] min-h-screen">
      <div className="bg-[#232528] shadow-lg rounded-2xl p-8 border border-[#33564F]">
        <h2 className="text-3xl font-bold mb-8 text-center text-[#E6FAF6]">Perfil do Paciente</h2>
  
        {/* Dados Pessoais */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4 border-b border-[#33564F] pb-2 text-[#E6FAF6]">Dados Pessoais</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dadosPessoaisFields.map((field) => (
              <div key={field} className="flex flex-col">
                <label
                  htmlFor={field}
                  className="text-sm font-medium text-[#E6FAF6] capitalize"
                >
                  {labels[field]}
                </label>
                <input
                  type="text"
                  id={field}
                  name={field}
                  value={formData[field] ?? ""}
                  onChange={handleChange}
                  readOnly={!editMode || field === "cpf" || field === "id"}
                  className={`mt-1 p-2 rounded-md border ${
                    editMode && field !== "cpf" && field !== "id"
                      ? "border-[#33564F] bg-[#1F2924] focus:outline-none focus:ring-2 focus:ring-[#55FF00]"
                      : "bg-[#1F1F1F] text-[#979897] cursor-not-allowed border-[#232528]"
                  }`}
                />
              </div>
            ))}
          </div>
        </section>
  
        {/* Contato */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4 border-b border-[#33564F] pb-2 text-[#E6FAF6]">Contato</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contatoFields.map((field) => (
              <div key={field} className="flex flex-col">
                <label
                  htmlFor={field}
                  className="text-sm font-medium text-[#E6FAF6] capitalize"
                >
                  {labels[field]}
                </label>
                <input
                  type="text"
                  id={field}
                  name={field}
                  value={formData[field] ?? ""}
                  onChange={handleChange}
                  readOnly={!editMode}
                  className={`mt-1 p-2 rounded-md border ${
                    editMode
                      ? "border-[#33564F] bg-[#1F2924] focus:outline-none focus:ring-2 focus:ring-[#55FF00]"
                      : "bg-[#1F1F1F] text-[#979897] cursor-not-allowed border-[#232528]"
                  }`}
                />
              </div>
            ))}
          </div>
        </section>
  
        {/* Endereço */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4 border-b border-[#33564F] pb-2 text-[#E6FAF6]">Endereço</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {enderecoFields.map((field) => (
              <div key={field} className="flex flex-col">
                <label
                  htmlFor={field}
                  className="text-sm font-medium text-[#E6FAF6] capitalize"
                >
                  {labels[field]}
                </label>
                <input
                  type="text"
                  id={field}
                  name={field}
                  value={formData[field] ?? ""}
                  onChange={handleChange}
                  readOnly={!editMode}
                  className={`mt-1 p-2 rounded-md border ${
                    editMode
                      ? "border-[#33564F] bg-[#1F2924] focus:outline-none focus:ring-2 focus:ring-[#55FF00]"
                      : "bg-[#1F1F1F] text-[#979897] cursor-not-allowed border-[#232528]"
                  }`}
                />
              </div>
            ))}
          </div>
        </section>
  
        {/* Botões */}
        <div className="flex justify-center gap-6">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="bg-[#117F43] text-white px-6 py-2 rounded hover:bg-[#0f6e3c] transition"
              >
                Salvar
              </button>
              <button
                onClick={handleCancel}
                className="bg-[#232528] text-[#E6FAF6] px-6 py-2 rounded border border-[#33564F] hover:bg-[#1F2924] transition"
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="bg-[#117F43] text-white px-6 py-2 rounded hover:bg-[#0f6e3c] transition"
            >
              Editar Perfil
            </button>
          )}
        </div>
      </div>
    </main>
  </>
  
  );
}
