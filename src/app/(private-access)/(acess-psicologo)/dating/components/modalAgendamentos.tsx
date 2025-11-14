import React, { useState, ChangeEvent, useEffect, ReactEventHandler } from "react";
import { FaCalendar, FaCalendarAlt, FaClock, FaPhoneAlt, FaPen, FaUserFriends, FaUserClock } from "react-icons/fa";
import { MdNotes } from "react-icons/md";
import { v4 as uuidv4 } from 'uuid';
import { useSession } from "next-auth/react";
import { showErrorMessage, showInfoMessage, showSuccessMessage } from "../../../../util/messages";
import { useHistory } from "@/app/context/historyContext";
 
interface Agendamento {
  id: string;
  psicologoId: string;
  fantasy_name: string;
  name: string;
  data: string;
  hora: string;
  tipo_consulta: string;
  observacao: string;
  recorrencia: string;
  duracao: string;
}

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function gerarCodigoAleatorio(tamanho: number = 8): string {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let codigo = '';
  for (let i = 0; i < tamanho; i++) {
    const randomIndex = Math.floor(Math.random() * caracteres.length);
    codigo += caracteres[randomIndex];
  }
  return codigo;
}


const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { data: session, status } = useSession(); // Obtém os dados da sessão
  const { logAction } = useHistory();
  const psicologo = session?.user.id

  const [novoAgendamento, setNovoAgendamento] = useState<Agendamento>({
    id: '',
    psicologoId: String(psicologo),
    fantasy_name: gerarCodigoAleatorio(),
    name: 'Consulta Avulsa',
    data: '',
    hora: '',
    tipo_consulta: '',
    observacao: '',
    recorrencia: '',
    duracao: '30'
  });

  const [pacientes, setPacientes] = useState<any[]>([]);
  const [loadingPacientes, setLoadingPacientes] = useState(false);



  // Função para atualizar o estado do Agendamento conforme os inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNovoAgendamento((prev) => ({ ...prev, [name]: value }));
  };



  // Função para buscar todos os pacientes do psicologo
  const buscarPacientes = async () => {
    if (!psicologo) return;
    
    setLoadingPacientes(true);
    try {
      const response = await fetch(`/api/internal/register_pacientes?psicologoId=${psicologo}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPacientes(data);
      } else {
        console.error('Erro ao buscar pacientes');
        showErrorMessage('Erro ao carregar lista de pacientes');
      }
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
      showErrorMessage('Erro ao carregar lista de pacientes');
    } finally {
      setLoadingPacientes(false);
    }
  };

  // Buscar pacientes quando o componente montar
  useEffect(() => {
    if (psicologo) {
      buscarPacientes();
    }
  }, [psicologo]);



  //salvando os agendamentos
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Verifica se os campos obrigatórios estão preenchidos
    const camposObrigatoriosPreenchidos = novoAgendamento.data &&
      novoAgendamento.hora &&
      novoAgendamento.name &&
      novoAgendamento.fantasy_name;
  
    if (!camposObrigatoriosPreenchidos) {
      showInfoMessage("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
  
    const agendamentos: Agendamento[] = [];
    const { recorrencia, data, hora } = novoAgendamento;
    const dataInicial = new Date(data);
    const horaInicial = hora;
  
    let quantidadeAgendamentos = 1; // Padrão: único
    let intervaloDias = 0;
  
    switch (recorrencia) {
      case 'diaria':
        quantidadeAgendamentos = 30;
        intervaloDias = 1;
        break;
      case 'semanal':
        quantidadeAgendamentos = 12;
        intervaloDias = 7;
        break;
      case 'mensal':
        quantidadeAgendamentos = 6;
        intervaloDias = 30;
        break;
      case 'anual':
        quantidadeAgendamentos = 2;
        intervaloDias = 365;
        break;
      default:
        quantidadeAgendamentos = 1; // única
        intervaloDias = 0;
        break;
    }
  
    for (let i = 0; i < quantidadeAgendamentos; i++) {
      const novaData = new Date(dataInicial);
      novaData.setDate(novaData.getDate() + (intervaloDias * i));
  
      const novo: Agendamento = {
        ...novoAgendamento,
        id: uuidv4(),
        data: novaData.toISOString().split('T')[0],
        hora: horaInicial
      };
  
      agendamentos.push(novo);
    }
  
    // Envia todos os agendamentos (único ou recorrente)
    try {
      let falhas = 0;
  
      for (const agendamento of agendamentos) {
        const response = await fetch("/api/internal/gen-meet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(agendamento),
        });
  
        if (!response.ok) {
          falhas++;
          console.error(`Erro ao criar agendamento para ${agendamento.data}`);
        }
      }
  
      if (falhas === 0) {
        showSuccessMessage(`Agendamento${agendamentos.length > 1 ? 's recorrentes' : ''} criado${agendamentos.length > 1 ? 's' : ''} com sucesso!`);
        logAction(`Você agendou uma reunião com ${novoAgendamento.name} para o dia ${novoAgendamento.data} as 
          ${novoAgendamento.hora} horas com duração de ${novoAgendamento.duracao} `, psicologo);
        setNovoAgendamento({
          id: '',
          psicologoId: '',
          fantasy_name: '',
          name: '',
          data: '',
          hora: '',
          tipo_consulta: '',
          observacao: '',
          recorrencia: '',
          duracao: ''
        });
        onClose(); // Fecha o modal após salvar
      } else {
        showErrorMessage(`Erro ao criar ${falhas} de ${agendamentos.length} agendamento(s).`);
      }
    } catch (error) {
      showErrorMessage("Erro de conexão. Tente novamente.");
      console.error("Erro ao criar agendamentos:", error);
    }
  };
  


  //função para validar se a data imputada é valida:
  const validarData = (data: string): boolean => {
    const dataAtual = new Date();
    const [ano, mes, dia] = data.split('-').map(Number);
    const dataSelecionada = new Date(ano, mes - 1, dia); // mês começa em 0 no JS

    if (isNaN(dataSelecionada.getTime())) {
      alert("Por favor, insira uma data válida.");
      return false;
    }

    // Zerar horas para comparação apenas da data
    dataAtual.setHours(0, 0, 0, 0);
    dataSelecionada.setHours(0, 0, 0, 0);

    if (dataSelecionada < dataAtual) {
      showErrorMessage("A data selecionada não pode ser anterior à data atual.");
      return false;
    }

    return true;
  };


  //função para validar se o horario na data especificada já passou:
  const validarHorario = (data: string, hora: string): boolean => {
    const dataAtual = new Date();
    const [ano, mes, dia] = data.split('-').map(Number);
    const [horaSelecionada, minutoSelecionado] = hora.split(':').map(Number);
    const dataHoraSelecionada = new Date(ano, mes - 1, dia, horaSelecionada, minutoSelecionado);

    if (isNaN(dataHoraSelecionada.getTime())) {
      alert("Por favor, insira um horário válido.");
      return false;
    }

    // Verifica se a data selecionada é hoje
    const hoje = new Date();
    const dataSelecionada = new Date(ano, mes - 1, dia);

    // Zerar horas para comparação apenas da data
    hoje.setHours(0, 0, 0, 0);
    dataSelecionada.setHours(0, 0, 0, 0);

    if (hoje.getTime() === dataSelecionada.getTime()) {
      // Se for hoje, verifica se o horário já passou
      if (dataHoraSelecionada <= dataAtual) {
        showErrorMessage("O horário selecionado já passou. Selecione um horário futuro.");
        return false;
      }
    }

    return true;
  };




  if (!isOpen) return null;

  return (
<>
  <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center z-50">
    <div className="relative bg-[#292727] rounded-lg w-full max-w-[787px] h-full max-h-[90vh] p-6 overflow-y-auto text-white">

      {/* Header */}
      <div className="flex items-center justify-start gap-2 mb-3">
        <FaCalendar size={20} className="text-[#55FF00]" />
        <h2 className="font-bold text-2xl text-[#55FF00]">Novo Agendamento</h2>
      </div>

      {/* Form */}
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="space-y-4">

          {/* Nome do Paciente */}
          <div className="flex-col justify-between gap-4">
            <label className="block text-sm font-medium text-[#E6FAF6]">Selecionar Paciente (Opcional)</label>
            <div className="flex items-center gap-3">
              <FaUserFriends size={20} className="text-[#55FF00]" />
              <select
                name="name"
                value={novoAgendamento.name}
                onChange={handleChange}
                className="border border-[#33564F] bg-[#E6FAF6] text-black rounded-md px-4 py-2 w-full"
              >
                <option value="">Consulta Avulsa</option>
                {loadingPacientes ? (
                  <option value="" disabled>Carregando pacientes...</option>
                ) : (
                  pacientes.map((paciente) => (
                    <option key={paciente.id} value={paciente.name}>
                      {paciente.nome}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Data da Reunião */}
          <div className="flex-col justify-between gap-4">
            <label className="block text-sm font-medium text-[#E6FAF6]">Data da Reunião</label>
            <div className="flex items-center gap-3">
              <FaCalendarAlt size={20} className="text-[#55FF00]" />
              <input
                type="date"
                name="data"
                required
                onChange={handleChange}
                className="border border-[#33564F] bg-[#E6FAF6] text-black rounded-md px-4 py-2 w-full"
                onBlur={(e) => {
                  const datavalida = validarData(e.target.value);
                  if (!datavalida) e.target.value = "";
                }}
              />
            </div>
          </div>

          {/* Hora da Reunião */}
          <div className="flex-col justify-between gap-4">
            <label className="block text-sm font-medium text-[#E6FAF6]">Hora da Reunião</label>
            <div className="flex items-center gap-3">
              <FaClock size={20} className="text-[#55FF00]" />
              <input
                type="time"
                name="hora"
                required
                value={novoAgendamento.hora}
                onChange={handleChange}
                className="border border-[#33564F] bg-[#E6FAF6] text-black rounded-md px-4 py-2 w-full"
                onBlur={(e) => {
                  const horarioValido = validarHorario(novoAgendamento.data, e.target.value)
                  if (!horarioValido) e.target.value = "";
                }}
              />
            </div>
          </div>

          {/* Tipo de Consulta */}
          <div className="flex-col justify-between gap-4">
            <label className="block text-sm font-medium text-[#E6FAF6]">Tipo de Consulta</label>
            <div className="flex items-center gap-3">
              <FaPhoneAlt size={20} className="text-[#55FF00]" />
              <select
                name="tipo_consulta"
                value={novoAgendamento.tipo_consulta}
                onChange={handleChange}
                className="border border-[#33564F] bg-[#E6FAF6] text-black rounded-md px-4 py-2 w-full"
              >
                <option value="">Selecione o tipo de consulta</option>
                <option value="presencial">Presencial</option>
                <option value="online">Online</option>
              </select>
            </div>
          </div>

          {/* Recorrência */}
          <div className="flex-col justify-between gap-4">
            <label className="block text-sm font-medium text-[#E6FAF6]">Recorrência</label>
            <div className="flex items-center gap-3">
              <FaCalendarAlt size={20} className="text-[#55FF00]" />
              <select
                name="recorrencia"
                value={novoAgendamento.recorrencia}
                onChange={handleChange}
                className="border border-[#33564F] bg-[#E6FAF6] text-black rounded-md px-4 py-2 w-full"
              >
                <option value="">Selecione a recorrência</option>
                <option value="Unica">Reunião única</option>
                <option value="diaria">Diária</option>
                <option value="semanal">Semanal</option>
                <option value="mensal">Mensal</option>
                <option value="anual">Anual</option>
              </select>
            </div>
          </div>

          {/* Observações */}
          <div className="flex-col justify-between gap-4">
            <label className="block text-sm font-medium text-[#E6FAF6]">Motivo da consulta</label>
            <div className="flex items-center gap-3">
              <MdNotes size={20} className="text-[#55FF00]" />
              <textarea
                name="observacao"
                value={novoAgendamento.observacao}
                onChange={handleChange}
                placeholder="Digite as observações"
                className="border border-[#33564F] bg-[#E6FAF6] text-black rounded-md px-4 py-2 w-full"
              />
            </div>
          </div>

          {/* Duração */}
          <div className="flex-col justify-between gap-4">
            <label className="block text-sm font-medium text-[#E6FAF6]">Duração</label>
            <div className="flex items-center gap-3">
              <FaUserClock size={20} className="text-[#55FF00]" />
              <select
                name="duracao"
                value={novoAgendamento.duracao || 30}
                onChange={handleChange}
                className="border border-[#33564F] bg-[#E6FAF6] text-black rounded-md px-4 py-2 w-full"
              >
                <option value="30">30 minutos</option>
                <option value="60">60 minutos</option>
              </select>
            </div>
          </div>

          {/* Botões */}
          <div className="mt-6 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="text-[#E6FAF6] hover:text-[#55FF00] transition">Cancelar</button>
            <button type="submit" className="bg-[#147D43] hover:bg-[#33564F] text-white px-6 py-2 rounded-md transition">Salvar</button>
          </div>

        </div>
      </form>
    </div>
  </div>
</>


  );
};

export default Modal;
