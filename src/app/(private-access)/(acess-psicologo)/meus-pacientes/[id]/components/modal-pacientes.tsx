'use client'
import { useState, useEffect } from 'react'
import { showErrorMessage, showSuccessMessage } from "@/app/util/messages"
import { FaArrowUp } from 'react-icons/fa'
import Prontuario from '../../../../../../../types/prontuario'
/* import { encoding_for_model } from "@dqbd/tiktoken"; */




interface ModalPacientesProps {
  isOpen: boolean
  onClose: () => void
  paciente: any
}

export const ModalPacientes = ({ isOpen, onClose, paciente }: ModalPacientesProps) => {
  const [formData, setFormData] = useState({
    nome: '',
    fantasy_name: '',
    idade: '',
    sintomas: '',
    telefone: '',
    convenio: '',
    sexo: '',
    cep: '',
    cidade: '',
    bairro: '',
    rua: '',
    numero: '',
    pais: '',
    complemento: '',
    estado: '',
    email: '',
    rg: '',
    cpf: ''
  })

  const [evolucao, setEvolucao] = useState<string>('')
  const [prompt, setPrompt] = useState<string>('')
  const [prontuario, setProntuario] = useState<Prontuario>()
  const [resposta, setResposta] = useState<string>('')
  const [isResponse, setIsResponse] = useState<boolean>(false)


  //leitura dos pacientes
  useEffect(() => {
    if (paciente) {
      setFormData({
        nome: paciente.nome || '',
        fantasy_name: paciente.fantasy_name || '',
        idade: paciente.idade || '',
        sintomas: paciente.sintomas || '',
        telefone: paciente.telefone || '',
        convenio: paciente.convenio || '',
        sexo: paciente.sexo || '',
        cep: paciente.cep || '',
        cidade: paciente.cidade || '',
        bairro: paciente.bairro || '',
        rua: paciente.rua || '',
        numero: paciente.numero || '',
        pais: paciente.pais || '',
        complemento: paciente.complemento || '',
        estado: paciente.estado || '',
        email: paciente.email || '',
        rg: paciente.rg || '',
        cpf: paciente.cpf
      })
    }
  }, [paciente])


  //pegar o valor dos campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  //acredito que edição de pacientes
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/internal/register_pacientes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: paciente.id,
          ...formData
        }),
      })

      if (response.ok) {
        showSuccessMessage('Paciente atualizado com sucesso!')
        window.location.reload()
        // onClose()
      } else {
        const data = await response.json()
        showErrorMessage(`Erro ao atualizar paciente: ${data.error}`)
      }
    } catch (error) {
      showErrorMessage('Erro ao atualizar paciente. Tente novamente mais tarde.')
    }
  }


  //registrar evolução
  const handleEvolution = async () => {
    const date = new Date();

    const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}`;



    try {
      const response = await fetch('/api/internal/prontuario', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pacienteId: paciente.id,
          evolucao: `${formattedDate}: ${evolucao}\n`
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro ao enviar evolução:', errorData);
        showErrorMessage('Ocorreu um erro ao tentar registrar a evolução. Tente novamente mais tarde.');
        return;
      }

      const data = await response.json();
      console.log('Evolução salva com sucesso:', data);
      showSuccessMessage('Evolução registrada com sucesso!');
      setEvolucao('');

    } catch (error) {
      console.error('Erro inesperado ao enviar evolução:', error);
      showErrorMessage('Erro ao enviar evolução. Tente novamente mais tarde.');
    }
  };


  //recuperar prontuario
  async function recuperarProntuario() {
    try {
      const response = await fetch(`/api/internal/prontuario?pacienteId=${paciente.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProntuario(data);
        console.log('Prontuario recuperado com sucesso:', data);
       
      } else {
        const errorData = await response.json();
        console.error('Erro ao recuperar prontuario:', errorData);
        showErrorMessage('Ocorreu um erro ao tentar recuperar o prontuario. Tente novamente mais tarde.');
      }
    } catch (error) {
      console.error('Erro inesperado ao recuperar prontuario:', error);
      showErrorMessage('Erro ao recuperar prontuario. Tente novamente mais tarde.');
    }
  }

   async function recData(){
     await recuperarProntuario();
    const evolucao = prontuario?.evolucao || '';
    const transcricao = prontuario?.transcription || '';
   const instruction = `${prompt}${evolucao}${transcricao}`
   return instruction
   }
  

   useEffect(() => {
    if (isOpen) {
      recData();
    }
  }, [isOpen]);

  //analisar prontuario
  async function analisarProntuario() {

  const instruction = await recData()
   
    const response = await fetch("/api/internal/prontuario/analise-paciente", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: instruction, //aqui vamos colocar tudo que queremos enviar para analise
      }),
    });

    const data = await response.json();
    if (response.ok) {
      setIsResponse(true)
      setResposta(data.result)
    /*  console.log(countTokens(data.result)) */
      setPrompt('')
    } else {
      console.error("Erro:", data.error);
    }

  }

//contar tokens
/* 
 async function countTokens(text: string): Promise<number> {
  const enc = encoding_for_model("gpt-4");
  const tokens = enc.encode(text);
  const tokenCount = tokens.length;
  enc.free(); // libera memória WASM
  return tokenCount;
}
 */

  if (!isOpen) return null

  return (
<>
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
    <div className="bg-[#232528] p-6 rounded-xl w-[80%] h-[80%] max-w-none max-h-none flex flex-col shadow-lg border border-[#33564F]">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-4 border-b border-[#33564F] pb-2">
        <h2 className="text-2xl font-semibold text-[#E6FAF6]">Editar Paciente</h2>
        <button
          onClick={onClose}
          className="text-[#E6FAF6] hover:text-[#55FF00] text-2xl font-bold"
          aria-label="Fechar modal"
          type="button"
        >
          ✕
        </button>
      </div>

      {/* Formulário com scroll */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto space-y-6 pr-2"
      >
        {/* Grid de inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { label: 'Nome', name: 'nome' },
            { label: 'Nome Fantasia', name: 'fantasy_name' },
            { label: 'CPF', name: 'cpf' },
            { label: 'RG', name: 'rg' },
            { label: 'Email', name: 'email', type: 'email' },
            { label: 'Telefone', name: 'telefone' },
            { label: 'Convênio', name: 'convenio' },
            { label: 'Sintomas', name: 'sintomas' },
            { label: 'CEP', name: 'cep' },
            { label: 'Estado', name: 'estado' },
            { label: 'Cidade', name: 'cidade' },
            { label: 'Bairro', name: 'bairro' },
            { label: 'Rua', name: 'rua' },
            { label: 'Número', name: 'numero' },
            { label: 'Complemento', name: 'complemento' },
            { label: 'País', name: 'pais' }
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-[#E6FAF6]">{field.label}</label>
              <input
                type={field.type || 'text'}
                name={field.name}
                value={formData[field.name as keyof typeof formData]}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-[#33564F] bg-[#1F2225] text-[#E6FAF6] shadow-sm focus:border-[#55FF00] focus:ring-[#55FF00]"
              />
            </div>
          ))}
        </div>

        {/* Evolução do paciente */}
        <div className="flex flex-row w-full mt-4 gap-2">
          <input
            type='text'
            id="evolucao"
            name="evolucao"
            value={evolucao}
            onChange={(e) => setEvolucao(e.target.value)}
            placeholder="Digite aqui a evolução observada do paciente..."
            className="flex-1 h-10 rounded-sm border-2 border-[#33564F] bg-[#1F2225] text-[#E6FAF6] p-2"
          />
          <button
            type="button"
            className="bg-[#117F43] hover:bg-[#0f6e3c] text-white p-2 rounded-sm shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#55FF00]"
            title="Enviar"
            onClick={() => handleEvolution()}
          >
            Registrar
          </button>
        </div>

        {/* Resposta do modelo */}
        {isResponse && (
          <div className="mt-4">
            <label htmlFor="resposta" className="block text-sm font-medium text-[#E6FAF6] mb-1">
              Resposta do modelo
            </label>
            <textarea
              name="resposta"
              id="resposta"
              value={resposta}
              onChange={(e) => setResposta(e.target.value)}
              readOnly
              rows={10}
              className="w-full p-4 rounded-xl border border-[#33564F] bg-[#1F2225] text-[#E6FAF6] shadow-inner resize-none focus:outline-none focus:ring-2 focus:ring-[#55FF00]"
            />
          </div>
        )}

        {/* Prompt direto */}
        <div className="relative w-full mt-6">
          <textarea
            id="promptDireto"
            name="promptDireto"
            placeholder="Digite seu prompt..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="resize-y min-h-[50px] w-full rounded-md border-2 border-[#33564F] bg-[#1F2225] text-[#E6FAF6] p-2"
          />
          <button
            type="button"
            className="absolute bottom-4 right-4 bg-[#117F43] hover:bg-[#0f6e3c] text-white p-2 rounded-full shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#55FF00]"
            title="Enviar"
            onClick={() => analisarProntuario()}
          >
            <FaArrowUp className="text-lg" />
          </button>
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[#E6FAF6] bg-[#33564F] hover:bg-[#55FF00] rounded-md transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-[#117F43] hover:bg-[#0f6e3c] rounded-md transition-colors"
          >
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  </div>
</>
  )

}
