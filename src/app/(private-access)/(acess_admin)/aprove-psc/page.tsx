'use client'
import { useState, useEffect } from "react";
import { useAccessControl } from "@/app/context/AcessControl"; // Importa o hook do contexto
import { Psicologo } from "../../../../../types/psicologos";
import HeadPage from "@/app/(private-access)/components/headPage";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc"; //connect
import { VscDebugDisconnect } from "react-icons/vsc"; //disonect
import { PiPlugsConnectedFill } from "react-icons/pi"; //connect
import { showErrorMessage, showPersistentLoadingMessage, showSuccessMessage, updateToastMessage } from "@/app/util/messages";





const ListaPsicologos = () => {


  const { role, hasRole } = useAccessControl();
  const [psicologos, setPsicologos] = useState<PrePsicologos[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAtivo, setAtivo] = useState<boolean>(false);


interface PrePsicologos{
  id: string;
  nome: string;
  lastname: string;
  email: string;
  crp: string;
  cpf: string;
  habilitado: boolean;
}


const [ativoPorId, setAtivoPorId] = useState<{ [key: string]: boolean }>({});

const toggleAtivo = (id: string) => {
  setAtivoPorId(prev => ({
    ...prev,
    [id]: !prev[id] // inverte só o do psicólogo clicado
  }));
};



  /**
 * Busca a lista de psicólogos disponíveis no endpoint interno.
 * Define os estados de loading, error e psicólogos.
 * 
 * @returns {Promise<void>} - Função assíncrona sem retorno direto.
 */
  const fetchPsychologists = async () => {
    try {
      const response = await fetch("/api/internal/analize_psco");

      if (!response.ok) {
       return <><p>Nenhum psicologo encontrado!</p></>
      }

      const { data } = await response.json();

      if (Array.isArray(data)) {
        setPsicologos(data);
      } else {
        setError("Erro: dados recebidos estão em formato inválido.");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };


  /**
   * useEffect busca os cadastros no banco de dados
   */
  useEffect(() => {
    fetchPsychologists(); 
  }, []);



  /**
   * Ativa o psicologo no sistema
   * @param cpf
   */
  const ativarPsicologo = async (cpf: string) => {
    try {
      const response = await fetch('/api/internal/analize_psco', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cpf }),
      });

      if (response.ok) {
        const data = await response.json();
        showSuccessMessage(data.message || 'Psicólogo habilitado com sucesso');
        //window.location.reload();
        deletePsicologoHabilitado(cpf)
        fetchPsychologists(); 
      } else {
        const errorData = await response.json();
        showErrorMessage(errorData.error || 'Erro ao habilitar psicólogo');
        //window.location.reload();
        fetchPsychologists(); 
      }
    } catch (error) {
      showErrorMessage('Erro ao conectar com o servidor');
    }
  };


  //deletar psicologo
  const deletePsicologoHabilitado =async(cpf:string)=>{
    const toastId = showPersistentLoadingMessage('Pre-cadastro esta sendo rejeitado, Psicologo irá receber uma mensagem informando!');
    try {
      const response = await fetch('/api/internal/analize_psco', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cpf }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        updateToastMessage(toastId,"Psicólogo rejeitado com sucesso. Um e-mail foi enviado com as instruções.");
       // window.location.reload();
       fetchPsychologists(); 
        // Aqui você pode recarregar a lista ou remover visualmente o psicólogo da tela, se necessário
      } else {
       updateToastMessage(toastId, "Ocorreu um erro, nenhuma modificação no pré cadastro do Psicologo");
       //window.location.reload();
       fetchPsychologists(); 
      }
    } catch (error) {
      console.error("Erro ao chamar a API de rejeição:", error);
      showErrorMessage("Erro inesperado. Tente novamente.");
    } 


  }

//rejeitar psicologo
  const rejeitarPisicologo = async (cpf: string) => {
    const toastId = showPersistentLoadingMessage('Pre-cadastro esta sendo rejeitado, Psicologo irá receber uma mensagem informando!');
     try {
       const response = await fetch('/api/internal/analize_psco', {
         method: 'DELETE',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({ cpf }),
       });
   
       const result = await response.json();
   
       if (response.ok) {
         updateToastMessage(toastId,"Psicólogo rejeitado com sucesso. Um e-mail foi enviado com as instruções.");
        // window.location.reload();
        fetchPsychologists(); 
         // Aqui você pode recarregar a lista ou remover visualmente o psicólogo da tela, se necessário
       } else {
        updateToastMessage(toastId, "Ocorreu um erro, nenhuma modificação no pré cadastro do Psicologo");
        //window.location.reload();
        fetchPsychologists(); 
       }
     } catch (error) {
       console.error("Erro ao chamar a API de rejeição:", error);
       showErrorMessage("Erro inesperado. Tente novamente.");
     } 

  };


  return (
    <>
    <HeadPage title="Novas Solicitações" icon={<VscGitPullRequestGoToChanges size={20} />} />
  
    {role === 'ADMIN' ? (
      <div className="container mx-auto px-4 sm:px-6 py-6">
        <h1 className="text-2xl font-bold text-[#399784] mb-4">Lista de Psicólogos Cadastrados</h1>
  
        {loading && <p className="text-[#25463f]">Carregando...</p>}
        {error && <p className="text-red-500">{error}</p>}
  
        {!loading && !error && psicologos.length === 0 && (
          <p className="text-[#8ebcb2]">Nenhum psicólogo encontrado.</p>
        )}
  
        {/* Tabela de psicólogos */}
        {!loading && !error && psicologos.length > 0 && (
          <div className="overflow-x-auto">
            <table className="table-auto w-full mt-4 border-collapse text-[#E6FAF6]">
              <thead>
                <tr className="bg-[#1E1E1E] text-left text-[#E6FAF6] uppercase text-sm leading-normal">
                  <th className="py-3 px-6 border-b border-[#333333] font-semibold">Nome</th>
                  <th className="py-3 px-6 border-b border-[#333333] font-semibold">Sobrenome</th>
                  <th className="py-3 px-6 border-b border-[#333333] font-semibold">CPF</th>
                  <th className="py-3 px-6 border-b border-[#333333] font-semibold">CRP</th>
                  <th className="py-3 px-6 border-b border-[#333333] font-semibold text-center">Email</th>
                  <th className="py-3 px-6 border-b border-[#333333] font-semibold text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {psicologos.map((psicologo) => {
                  const isAtivo = ativoPorId[psicologo.id] || false;
  
                  return (
                    <tr key={psicologo.id} className="hover:bg-[#2A2A2A]">
                      <td className="border p-2 text-center border-[#333333]">{psicologo.nome}</td>
                      <td className="border p-2 text-center border-[#333333]">{psicologo.lastname}</td>
                      <td className="border p-2 text-center border-[#333333]">{psicologo.cpf}</td>
                      <td className="border p-2 text-center border-[#333333]">{psicologo.crp}</td>
                      <td className="border p-2 text-center border-[#333333]">{psicologo.email}</td>
  
                      <td className="border p-2 flex justify-center gap-2 border-[#333333]">
                        <button onClick={() => toggleAtivo(psicologo.id)}>
                          {isAtivo ? (
                            <PiPlugsConnectedFill color="#1DD1C1" size={25} />
                          ) : (
                            <VscDebugDisconnect color="#FF5555" size={25} />
                          )}
                        </button>
  
                        <button
                          onClick={() => ativarPsicologo(psicologo.cpf || '')}
                          disabled={!isAtivo}
                          className={`px-3 py-1 text-[12px] rounded text-white font-semibold transition-all duration-200 ${
                            isAtivo
                              ? 'bg-[#1DD1C1] hover:bg-[#009E9D] cursor-pointer'
                              : 'bg-gray-600 cursor-not-allowed opacity-60'
                          }`}
                        >
                          Save
                        </button>
  
                        <button
                          onClick={() => rejeitarPisicologo(psicologo.cpf || '')}
                          disabled={isAtivo}
                          className={`px-3 py-1 text-[12px] rounded text-white font-semibold transition-all duration-200 ${
                            !isAtivo
                              ? 'bg-[#FF5555] hover:bg-[#CC4444] cursor-pointer'
                              : 'bg-gray-600 cursor-not-allowed opacity-60'
                          }`}
                        >
                          No Enable
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    ) : (
      <div className="flex justify-center items-center h-screen text-[#E6FAF6]">
        Essa página é acessível apenas para administradores
      </div>
    )}
  </>
  );
};

export default ListaPsicologos;
