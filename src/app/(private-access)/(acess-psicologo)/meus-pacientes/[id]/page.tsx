'use client'
import { useAccessControl } from "@/app/context/AcessControl"
import { FaList, FaFileAlt, FaThumbsUp, FaThumbsDown, FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa"//icones de like e dislike
import HeadPage from "@/app/(private-access)/components/headPage"
import { use, useEffect, useState } from "react"
import { redirect, useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { FaCirclePlus } from "react-icons/fa6";
import { GrDocumentUser } from "react-icons/gr";
import { showErrorMessage, showInfoMessage, showSuccessMessage } from "@/app/util/messages"
import { ModalPacientes } from "./components/modal-pacientes"
import { PrePaciente } from "../../../../../../types/prePacientes"
import ProntuarioModal from "./components/prontuario"


const mockAtendimentos = [
  {
    id: "mock-id-123",
    nome: "Maria da Silva",
    cpf: "123.456.789-00",
    idade: "32",
    sintomas: "Ansiedade e insônia",
    telefone: "(11) 98765-4321",
    sexo: "Feminino",
    email: "maria@email.com",
    psicologoId: "psico-id-456",
    result_amnp: ["resposta 1", "resposta 2"],
    resumo_anmp: "Paciente relata sintomas de ansiedade associados a eventos recentes de estresse.",
    status: 'ativo',


  },
  {
    id: "mock-id-123",
    nome: "Maria da Silva",
    cpf: "123.456.789-00",
    idade: "32",
    sintomas: "Ansiedade e insônia",
    telefone: "(11) 98765-4321",
    sexo: "Feminino",
    email: "maria@email.com",
    psicologoId: "psico-id-456",
    result_amnp: ["resposta 1", "resposta 2"],
    resumo_anmp: "Paciente relata sintomas de ansiedade associados a eventos recentes de estresse.",
    status: 'ativo',
  },
  {
    id: "mock-id-123",
    nome: "Maria da Silva",
    cpf: "123.456.789-00",
    idade: "32",
    sintomas: "Ansiedade e insônia",
    telefone: "(11) 98765-4321",
    sexo: "Feminino",
    email: "maria@email.com",
    psicologoId: "psico-id-456",
    result_amnp: ["resposta 1", "resposta 2"],
    resumo_anmp: "Paciente relata sintomas de ansiedade associados a eventos recentes de estresse.",
    status: 'ativo',
  }
]


const getStatus = (status: string) => {
  switch (status) {
    case "ok":
      return (<FaThumbsUp />)
    case "stoped":
      return (<FaThumbsDown />)
    default:
      return (<FaThumbsUp />)
  }
}




//alterar depois meus atendimentos para meus pacientes
const MeusPacientes = () => {
  const { role } = useAccessControl()
  const [pacientes, setPacientes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const params = useParams();
  const idpsc = params?.id as string;
  const router = useRouter()
  const [prePacientes, setPrePacientes] = useState<PrePaciente[]>([])
  const [modalOpen, setModalOpen] = useState(false);

  const [idPac,setIdPac]= useState<string>("00")





  //controle de edição de pacientes:
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pacienteSelecionado, setPacienteSelecionado] = useState<any | null>(null)

  const abrirModal = (paciente: any) => {

    setPacienteSelecionado(paciente)
    setIsModalOpen(true)

  }

  const fecharModal = () => {
    setIsModalOpen(false)
    setPacienteSelecionado(null)
  }

  const { data: session, status } = useSession(); // Obtém os dados da sessão
  const name_psico = session?.user.name

  //busca os pré pacientes no banco
  useEffect(() => {

    console.log(idpsc)
    const fetchPrePacientes = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/internal/register_pacientes/pre-pacientes?psicologoId=${idpsc}`);
        if (response.ok) {
          const data = await response.json();
          setPrePacientes(data);

        } else {
          showErrorMessage('Erro ao carregar pré-pacientes');
        }
      } catch (error) {
        showErrorMessage('Erro ao carregar pré-pacientes');
        console.error('Erro:', error);
      } finally {
        setLoading(false);
      }
    };

    if (idpsc) {
      fetchPrePacientes();
    }
  }, [idpsc]);

  // Função para deletar paciente
  const deletePaciente = async (pacienteId: string) => {
    try {
      const response = await fetch(`/api/internal/register_pacientes?id=${pacienteId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setPacientes(pacientes.filter(paciente => paciente.id !== pacienteId));
        showSuccessMessage('Paciente deletado com sucesso!');
      } else {
        const data = await response.json();
        showErrorMessage(`Erro ao deletar paciente: ${data?.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      showErrorMessage('Erro ao deletar paciente. Tente novamente mais tarde.');
    }
  };




  /**
   * function deletePaciente
   * @param string id
   */
 /*  const deletePaciente = async (pacienteId: string) => {
    try {
      const response = await fetch(`/api/internal/register_pacientes?id=${pacienteId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setPacientes(pacientes.filter(paciente => paciente.id !== pacienteId));
        showSuccessMessage('Paciente deletado com sucesso!');
      } else {
        const data = await response.json();
        showErrorMessage(`Erro ao deletar paciente: ${data?.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      showErrorMessage('Erro ao deletar paciente. Tente novamente mais tarde.');
    }
  }; */
  

 



  //abre a pagina do paciente selecionado
  const getPaciente = (id: string) => {
    showInfoMessage('abrindo perfil de paciente')
    router.push(`/pacient-profile/${id}`)
  }



  const fetchPacientes = async () => {
    try {
      const response = await fetch(`/api/internal/register_pacientes?psicologoId=${idpsc}`)
      if (!response.ok) {
        throw new Error('Erro ao buscar pacientes')
      }
      const data = await response.json()
      setPacientes(data)
    } catch (error) {
      showErrorMessage(`Erro ao buscar paciente`)
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {

    // se quiser realmente testar a API, descomente:
    fetchPacientes()
  }, [idpsc])


  //abre a pagina com o id do  paciente e do psicologo na url
  const openPacTrasn = (psc: string, pac: string) => {
    try {
      router.push(`/pacient-transform/${psc}/${pac}`);

    } catch (error) {
      showErrorMessage("Ocorreu um erro ao tentar identificar o psicologo!")
    }
    finally {
      console.log('finalizou')
    }

  }



  //descarte de pré paciente
  const descartarPrePaciente = async (idpac: string) => {
    try {
      const response = await fetch(`/api/internal/register_pacientes/transform?idpac=${idpac}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao descartar pré-paciente');
      }

      const data = await response.json();

      showInfoMessage('Pré-paciente descartado com sucesso!');

      fetchPacientes()

    } catch (error) {
      showErrorMessage(`Erro ao descartar pré-paciente: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      console.error('Erro ao descartar PrePaciente:', error);
    }
  };



  if (role === 'ADMIN') {
    return (
      <div className="flex justify-center items-center h-screen text-center text-lg text-red-500">
        Essa página é acessível apenas para psicólogos.
      </div>
    )
  }

  return (
<>
  <HeadPage
    title={'Meus Pacientes'}
    icon={<FaList size={20} />}
  />

  <ProntuarioModal
    pacienteId={idPac} // apenas um usuário para testes
    open={modalOpen}
    onClose={() => setModalOpen(false)}
  />

  <div className="overflow-x-auto p-4 bg-[#0F1113] min-h-screen">
    <div className="h-full px-5 py-3 flex justify-end">
      <FaCirclePlus
        size={30}
        className="text-[#55FF00] hover:text-[#33FF00] cursor-pointer"
        onClick={() => { redirect(`/cadastro-pacientes/${idpsc}`) }}
        title="Adicionar novo paciente"
      />
    </div>

    {/* Tabela de pacientes */}
    <table className="min-w-full bg-[#33564F] border border-[#E6FAF6]/20 rounded-xl shadow">
      <thead className="bg-[#33564F] text-[#E6FAF6] text-sm">
        <tr>
          <th className="px-4 py-2 text-left">Nome</th>
          <th className="px-4 py-2 text-left">Idade</th>
          <th className="px-4 py-2 text-left">Telefone</th>
          <th className="px-4 py-2 text-left">Cidade</th>
          <th className="px-4 py-2 text-left">Estado</th>
          <th className="px-4 py-2 text-left">Convenio</th>
          <th className="px-4 py-2 text-left">Prontuário</th>
          <th className="px-4 py-2 text-left">Ações</th>
        </tr>
      </thead>
      <tbody>
        {pacientes && pacientes.length > 0 ? (
          pacientes.map((item, index) => (
            <tr
              key={index}
              className="border-t border-[#E6FAF6]/20 text-[#E6FAF6] text-sm hover:bg-[#55FF00]/10 transition-colors"
            >
              <td className="px-4 py-2">{item.nome}</td>
              <td className="px-4 py-2">{item.idade}</td>
              <td className="px-4 py-2">{item.telefone}</td>
              <td className="px-4 py-2">{item.cidade}</td>
              <td className="px-4 py-2">{item.estado}</td>
              <td className="px-4 py-2">{item.convenio}</td>
              <td className="px-4 py-2">
                <FaFileAlt
                  className="text-[#ffffff] hover:text-[#acadac] cursor-pointer"
                  onClick={() => {
                    setIdPac(item.id)
                    setModalOpen(true)
                  }}
                />
              </td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <button
                    className="flex items-center gap-1 bg-[#55FF00]/20 text-[#E6FAF6] hover:bg-[#55FF00]/40 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                    onClick={() => abrirModal(item)}
                  >
                    Abrir <GrDocumentUser />
                  </button>
                  <button
                    className="flex items-center gap-1 bg-red-800/20 text-red-500 hover:bg-red-600/40 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                    onClick={() => deletePaciente(item.id)}
                    title="Deletar paciente"
                  >
                    <FaTrash /> Deletar
                  </button>
                  <button
                    className="flex items-center gap-1 bg-green-800/20 text-green-300 hover:bg-green-600/40 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                    onClick={() => abrirModal(item)}
                    title="Editar paciente"
                  >
                    <FaEdit /> Editar
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={8} className="px-4 py-8 text-center text-[#E6FAF6]/70">
              Nenhum paciente encontrado
            </td>
          </tr>
        )}
      </tbody>
    </table>

    {/* Tabela de futuros pacientes */}
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-[#E6FAF6] mb-4">Futuros pacientes</h2>
      <table className="w-full bg-[#33564F] rounded-lg shadow overflow-hidden">
        <thead className="bg-[#33564F] text-[#E6FAF6]/90">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Id</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Nome</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Idade</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E6FAF6]/20 text-[#E6FAF6]">
          {prePacientes.length > 0 ? (
            prePacientes.map((item, index) => (
              <tr key={index} className="hover:bg-[#55FF00]/10 transition-colors">
                <td className="px-4 py-3 text-sm">{item.id || 'N/A'}</td>
                <td className="px-4 py-3 text-sm">{item.nome || 'N/A'}</td>
                <td className="px-4 py-3 text-sm">{item.idade || 'N/A'}</td>
                <td className="px-4 py-3 text-sm">{item.email || 'N/A'}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <button
                      className="flex items-center gap-1 bg-green-100/20 text-[#55FF00] hover:bg-green-500/30 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                      onClick={() => openPacTrasn(idpsc, item.id)}
                      title="Habilitar como paciente"
                    >
                      <FaCheck /> Habilitar
                    </button>
                    <button
                      className="flex items-center gap-1 bg-red-100/20 text-red-500 hover:bg-red-600/30 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                      onClick={() => descartarPrePaciente(item.id)}
                      title="Descartar pré-paciente"
                    >
                      <FaTimes /> Descartar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-[#E6FAF6]/70">
                Nenhum pré-paciente encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>

  {isModalOpen && (
    <ModalPacientes
      isOpen={isModalOpen}
      onClose={fecharModal}
      paciente={pacienteSelecionado}
    />
  )}
</>

  )
}

export default MeusPacientes
//caveman method skincare
