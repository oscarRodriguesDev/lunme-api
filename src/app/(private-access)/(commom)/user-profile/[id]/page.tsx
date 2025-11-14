"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useId } from "react";
import Image from "next/image";

import capa_default from '../../../../../../public/patern_capa/capa-lume.png'; //alterar capa padrão
import userDefault from "../../../../../../public/profile_pictures_ps/userdefault.png";
import AlteracaoSenha from "../components/trocar_senha";
import { Psicologo } from "../../../../../../types/psicologos";
import LoadingNoHidration from "@/app/(private-access)/components/noHidrationn";
import { useAccessControl } from "@/app/context/AcessControl";
import { showErrorMessage, showSuccessMessage } from "@/app/util/messages";
import { signOut } from "next-auth/react";

const Perfil = () => {
    const { id } = useParams<{ id: string }>();
    const [psicologo, setPsicologo] = useState<Psicologo | null>(null);
    const [editando, setEditando] = useState(false);
    const [formData, setFormData] = useState<Psicologo | null>(null);
    const [alterar, setAlterar] = useState<boolean>(false);
    const [renderBox, setRenderBox] = useState<boolean>(false);

    const { role } = useAccessControl()

    //busca de dados
    async function fetchUserData(userId: string) {
        try {
            const res = await fetch(`/api/internal/user-profile?id=${userId}`);
            if (!res.ok) {
                throw new Error("Erro ao buscar dados do usuário");
            }
            const data = await res.json();
            setPsicologo(data);
            setFormData(data);
        } catch (error) {
            showErrorMessage(`Erro ao buscar dados do psicólogo:${error}`);
        }
    }

    /* Esse UseEfect esta impedindo erro na pagina caso não possua id na url */
    useEffect(() => {
        if (id) {
            fetchUserData(id);
        }
    }, [id]);


    useEffect(() => {
        if (!psicologo) return

        const deveRenderizar = psicologo.first_acess || alterar
        setRenderBox(deveRenderizar)
    }, [alterar])


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        if (!formData) return;
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setPsicologo(formData);
        await handleUpdate();
        setEditando(false);
    };

    const handleProfilePictures = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const fileData = new FormData();
            fileData.append("file", file);

            const res = await fetch(`/api/internal/uploads/profile/?path=profile-pictures&id=${id}`, {
                method: "POST",
                body: fileData,
            });
            // alert(id) // Removido o alert para não atrapalhar UX
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Erro no upload");
            }

            const data = await res.json();
            showSuccessMessage("Foto carregada. Clique em salvar para aplicar.");

            setFormData((prevFormData) =>
                prevFormData ? { ...prevFormData, photoprofile: data.url } : null
            );
        } catch (error) {
            showErrorMessage("Erro ao carregar a foto.");
        }
    };

    const handleBanner = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const fileData = new FormData();
            fileData.append("file", file);
            // alert(id) // Removido o alert para não atrapalhar UX

            const res = await fetch(`/api/internal/uploads/profile/?path=banner&id=${id}`, {
                method: "POST",
                body: fileData,
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Erro no upload");
            }

            const data = await res.json();
            showSuccessMessage("Banner carregado. Clique em salvar para aplicar.");

            setFormData((prevFormData) =>
                prevFormData ? { ...prevFormData, banner: data.url } : null
            );
        } catch (error) {
            showErrorMessage("Erro ao carregar o banner.");
        }
    };

    const handleUpdate = async () => {
        if (!formData) return;
        try {
            const { id, ...restOfFormData } = formData;
            const payload = { id: psicologo?.id, ...restOfFormData };

            const res = await fetch(`/api/internal/user-profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error("Erro ao atualizar perfil");
            }

            const updatedUser = await res.json();
            setPsicologo(updatedUser);
            showSuccessMessage("Perfil atualizado com sucesso!");
        } catch (error) {
            showErrorMessage("Falha ao atualizar perfil. Tente novamente.");
        }
    };

    if (!psicologo || !formData) {
        return (
            //componente de carregamento para evitar o erro de Hidratatiosn
            <LoadingNoHidration />
        );
    } else

        return (
          <>
            {!renderBox ? (
              <div className="w-full min-h-screen bg-[#0F1113] flex flex-col items-center py-10">
                {/* Banner */}
                <div className="w-full h-60 bg-[#3D975B] relative flex justify-center items-end">
                  <Image
                    src={formData.banner || capa_default}
                    width={800}
                    height={375}
                    alt="Banner"
                    quality={100}
                    className={`w-full h-60 object-cover ${!editando ? "rounded-b-2xl" : ""}`}
                  />
                  {/* Foto de perfil sobreposta ao banner */}
                  <div
                    className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 z-20 flex flex-col items-center"
                    style={{ pointerEvents: "none" }}
                  >
                    <div className="relative" style={{ pointerEvents: "auto" }}>
                      <Image
                        src={formData.photoprofile || userDefault}
                        alt="imagem de perfil"
                        width={110}
                        height={110}
                        className="w-28 h-28 rounded-full object-cover border-4 border-[#1D3330] shadow-lg bg-[#1D3330]"
                      />
                      {/* Corrigido: opção de substituir foto de perfil aparece corretamente quando editando */}
                      {editando && (
                        <div className="absolute bottom-0 right-0">
                          <label htmlFor="profile-photo-input" className="cursor-pointer bg-[#3D975B] text-[#0F1113] rounded-full p-1 shadow border-2 border-white flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2a2.828 2.828 0 11-4-4 2.828 2.828 0 014 4z" />
                            </svg>
                            <span className="ml-1 text-xs">Alterar</span>
                            <input
                              type="file"
                              id="profile-photo-input"
                              name="foto"
                              onChange={handleProfilePictures}
                              className="hidden"
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Banner edit input */}
                  {editando && (
                    <div className="absolute top-4 right-4 z-30">
                      <label htmlFor="banner-input" className="text-sm font-medium text-[#E6FAF6] bg-[#1D3330] px-3 py-1 rounded-lg shadow cursor-pointer">
                        Escolha uma foto de banner
                        <input
                          name="banner"
                          id="banner-input"
                          type="file"
                          className="hidden"
                          onChange={handleBanner}
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* Perfil */}
                <div className="w-full max-w-4xl bg-[#1D3330] rounded-2xl shadow-lg mt-20 p-6 flex flex-col items-center">
                  <h1 className="text-2xl font-bold text-[#E6FAF6] mt-2">{psicologo.nome}</h1>
                  <p className="text-[#B0B0B0]">{psicologo.email}</p>

                  <button
                    onClick={() => setEditando(!editando)}
                    className="mt-4 px-4 py-2 bg-[#3D975B] text-[#0F1113] rounded-lg shadow hover:bg-[#337e4b] transition"
                  >
                    {editando ? "Cancelar" : "Editar Perfil"}
                  </button>
                  {editando && (
                    <button
                      onClick={handleSave}
                      className="mt-2 px-4 py-2 bg-[#55FF00] text-[#0F1113] rounded-lg shadow hover:bg-[#3D975B] transition"
                    >
                      Salvar
                    </button>
                  )}
                </div>

                {/* Informações Profissionais */}
                <div className="w-full max-w-4xl bg-[#1D3330] rounded-2xl shadow-lg mt-6 p-6">
                  <h2 className="text-xl font-semibold text-[#55FF00] mb-4">Informações Profissionais</h2>
                  {editando ? (
                    <>
                      <label className="text-[#E6FAF6]" htmlFor="description">Bio</label>
                      <textarea
                        name="description"
                        value={formData.description || ''}
                        onChange={handleChange}
                        className="w-full border border-[#33564F] rounded-lg p-2 mt-2 mb-4 bg-[#0F1113] text-[#E6FAF6]"
                      />

                      {["registro", "crp", "cpf", "idade", "celular", "telefone", "cidade", "uf"].map((field) => (
                        <div key={field} className="mb-2">
                          <label className="text-[#E6FAF6] capitalize">{field}</label>
                          <input
                            type="text"
                            name={field}
                            value={
                              typeof formData[field as keyof typeof formData] === "boolean"
                                ? ""
                                : String(formData[field as keyof typeof formData] ?? "")
                            }
                            onChange={handleChange}
                            className="w-full border border-[#33564F] rounded-lg p-2 bg-[#0F1113] text-[#E6FAF6]"
                          />
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      <p className="text-[#B0B0B0] mt-2 text-center italic">
                        {psicologo.description || "Descrição não informada"}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-[#E6FAF6]">
                        {[
                          ["Registro", psicologo.registro],
                          ["CRP", psicologo.crp],
                          ["Idade", psicologo.idade],
                          ["Celular", psicologo.celular],
                          ["Telefone", psicologo.telefone],
                          ["Cidade", psicologo.cidade],
                          ["Estado", psicologo.uf],
                        ].map(([label, value]) => (
                          <p key={label}><strong>{label}:</strong> {value || "Não informado"}</p>
                        ))}
                      </div>
                      <div className="text-center mt-6">
                        <input
                          type="button"
                          value="Trocar senha"
                          className="px-6 py-2 bg-[#3D975B] text-[#0F1113] rounded-lg shadow-md hover:bg-[#337e4b] focus:outline-none focus:ring-2 focus:ring-[#3D975B]/50 transition duration-200"
                          onClick={() => setAlterar(!alterar)}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40">
                <AlteracaoSenha
                  id={id}
                  email={formData.email}
                  nome={formData.nome}
                  password={formData.password}
                  first_acess={formData.first_acess}
                  lastname={formData.lastname}
                  onClose={() => {
                    setAlterar(!alterar)
                    signOut();
                  }}
                />
              </div>
            )}
          </>
        );
};

export default Perfil;
//subindo alteraçãoes para a homologação