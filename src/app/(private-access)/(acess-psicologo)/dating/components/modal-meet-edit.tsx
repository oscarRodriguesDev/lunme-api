import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { FaCalendar, FaCalendarAlt, FaClock, FaPhoneAlt, FaPen, FaUserFriends, FaUserClock } from "react-icons/fa";
import { MdNotes } from "react-icons/md";
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
  meet: Agendamento;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, meet }) => {
  const [novoAgendamento, setNovoAgendamento] = useState<Agendamento>({
    id: '',
    psicologoId: '',
    fantasy_name: '',
    name: '',
    data: '',
    hora: '',
    tipo_consulta: '',
    observacao: '',
    recorrencia: '',
    duracao: '30'
  });

  const { logAction } = useHistory();

  useEffect(() => {
    if (isOpen && meet) {
      setNovoAgendamento(meet);
    }
  }, [isOpen, meet]);

  // Função para atualizar o estado do Agendamento conforme os inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNovoAgendamento((prev) => ({ ...prev, [name]: value }));
  };

  // Função para enviar os dados do agendamento para a API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verifica se todos os campos obrigatórios estão preenchidos
    if (novoAgendamento.data && novoAgendamento.hora && novoAgendamento.name && novoAgendamento.fantasy_name) {
      const novo: Agendamento = { ...novoAgendamento };

      try {
        // Fazendo a requisição para a API (ajuste a URL da sua API)
        const response = await fetch("/api/internal/gen-meet", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(novo), // Envia os dados como JSON
        });

        if (response.ok) {
          showSuccessMessage("Agendamento editado com sucesso!");
          logAction(`Você editou hora e data de uma reunião com ${novoAgendamento.name} `, novoAgendamento.psicologoId);
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
          showErrorMessage("Erro ao editar o agendamento. Tente novamente.");
        }
      } catch (error) {
        showErrorMessage("Erro de conexão. Tente novamente.");
      }
    } else {
      showInfoMessage("Por favor, preencha todos os campos obrigatórios.");
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
    <div className="fixed inset-0 #2e432c bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-[#525b65] rounded-lg w-full max-w-[787px] h-full max-h-[90vh] p-6 overflow-y-auto text-white">
        
        {/* Header */}
        <div className="flex items-center justify-start gap-3 mb-5">
          <FaCalendar size={40} className="text-[#55FF00]" />
          <h2 className="font-bold text-2xl text-[#55FF00]">Editar Agendamento</h2>
        </div>
  
        {/* Form */}
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="space-y-4">
  
            {/* Nome do Paciente */}
            <div className="flex-col gap-4">
              <label className="block text-sm font-medium text-[#E6FAF6]">Nome real do Paciente</label>
              <div className="flex items-center gap-3">
                <FaUserFriends size={20} className="text-[#55FF00]" />
                <input
                  type="text"
                  name="name"
                  value={novoAgendamento.name}
                  onChange={handleChange}
                  className="border border-[#33564F] bg-[#E6FAF6] text-black rounded-md px-4 py-2 w-full"
                  readOnly
                  disabled
                />
              </div>
            </div>
  
            {/* Identificador único */}
            <div className="flex-col gap-4">
              <label className="block text-sm font-medium text-[#E6FAF6]">Identificador único</label>
              <div className="flex items-center gap-3">
                <FaPen size={20} className="text-[#55FF00]" />
                <input
                  type="text"
                  name="fantasy_name"
                  value={novoAgendamento.fantasy_name}
                  onChange={handleChange}
                  className="border border-[#33564F] bg-[#E6FAF6] text-black rounded-md px-4 py-2 w-full"
                  readOnly
                  disabled
                />
              </div>
            </div>
  
            {/* Data da Reunião */}
            <div className="flex-col gap-4">
              <label className="block text-sm font-medium text-[#E6FAF6]">Data da Reunião</label>
              <div className="flex items-center gap-3">
                <FaCalendarAlt size={20} className="text-[#55FF00]" />
                <input
                  type="date"
                  name="data"
                  value={novoAgendamento.data}
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
            <div className="flex-col gap-4">
              <label className="block text-sm font-medium text-[#E6FAF6]">Hora da Reunião</label>
              <div className="flex items-center gap-3">
                <FaClock size={20} className="text-[#55FF00]" />
                <input
                  type="time"
                  name="hora"
                  value={novoAgendamento.hora}
                  onChange={handleChange}
                  className="border border-[#33564F] bg-[#E6FAF6] text-black rounded-md px-4 py-2 w-full"
                  onBlur={(e) => {
                    const horarioValido = validarHorario(novoAgendamento.data, e.target.value);
                    if (!horarioValido) e.target.value = "";
                  }}
                />
              </div>
            </div>
  
            {/* Tipo de Consulta */}
            <div className="flex-col gap-4">
              <label className="block text-sm font-medium text-[#E6FAF6]">Tipo de Consulta</label>
              <div className="flex items-center gap-3">
                <FaPhoneAlt size={20} className="text-[#55FF00]" />
                <input
                  type="text"
                  name="tipo_consulta"
                  value={novoAgendamento.tipo_consulta}
                  onChange={handleChange}
                  className="border border-[#33564F] bg-[#E6FAF6] text-black rounded-md px-4 py-2 w-full"
                  readOnly
                  disabled
                />
              </div>
            </div>
  
            {/* Recorrência */}
            <div className="flex-col gap-4">
              <label className="block text-sm font-medium text-[#E6FAF6]">Recorrência</label>
              <div className="flex items-center gap-3">
                <FaCalendarAlt size={20} className="text-[#55FF00]" />
                <input
                  type="text"
                  name="recorrencia"
                  value={novoAgendamento.recorrencia}
                  onChange={handleChange}
                  className="border border-[#33564F] bg-[#E6FAF6] text-black rounded-md px-4 py-2 w-full"
                  readOnly
                  disabled
                />
              </div>
            </div>
  
            {/* Observações */}
            <div className="flex-col gap-4">
              <label className="block text-sm font-medium text-[#E6FAF6]">Sintomas</label>
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
            <div className="flex-col gap-4">
              <label className="block text-sm font-medium text-[#E6FAF6]">Duração</label>
              <div className="flex items-center gap-3">
                <FaUserClock size={20} className="text-[#55FF00]" />
                <select
                  name="duracao"
                  value={novoAgendamento.duracao || "30"}
                  onChange={handleChange}
                  className="border border-[#33564F] bg-[#E6FAF6] text-black rounded-md px-4 py-2 w-full"
                >
                  <option value="30">30 minutos</option>
                  <option value="60">1 hora</option>
                </select>
              </div>
            </div>
  
            {/* Botões */}
            <div className="mt-6 flex justify-end gap-4">
              <button type="button" onClick={onClose} className="text-[#E6FAF6] hover:text-[#55FF00] transition">
                Cancelar
              </button>
              <button type="submit" className="bg-[#147D43] hover:bg-[#33564F] text-white px-6 py-2 rounded-md transition">
                Salvar
              </button>
            </div>
  
          </div>
        </form>
      </div>
    </div>
  </>
  

  );
};

export default Modal;
