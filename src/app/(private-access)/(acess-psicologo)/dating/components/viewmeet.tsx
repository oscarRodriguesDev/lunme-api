import { FaEdit, FaTrash } from "react-icons/fa";
import { Agendamento } from "../../../../../../types/agendamentos";

interface VisualizarModalProps {
    isOpen: boolean;
    onClose: () => void;
    agendamentos: Agendamento[];
    onEdit: (agendamento: Agendamento) => void;
    onDelete: (agendamento: Agendamento) => void;
}

export default function ViewDay({
    isOpen,
    onClose,
    agendamentos,
    onEdit,
    onDelete
}: VisualizarModalProps) {
    if (!isOpen || agendamentos.length === 0) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="bg-[#414a52] p-6 rounded-2xl shadow-2xl w-full max-w-2xl relative text-[#E6FAF6] max-h-[90vh] overflow-y-auto">
      
          {/* Botão fechar */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-[#E6FAF6] hover:text-red-500 text-2xl transition"
          >
            ×
          </button>
      
          {/* Título */}
          <h2 className="text-2xl font-semibold text-center mb-6 border-b border-[#33564F] pb-2 text-[#55FF00]">
            📋 Agendamentos do Dia
          </h2>
      
          {agendamentos.map((agendamento, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-sm py-2 border-b border-[#33564F] last:border-none"
            >
              <div className="flex gap-6">
                <div>
                  <p className="text-[#E6FAF6]">Nome</p>
                  <p className="font-medium text-white">{agendamento.name}</p>
                </div>
                <div>
                  <p className="text-[#E6FAF6]">Data</p>
                  <p className="font-medium text-white">{agendamento.data}</p>
                </div>
                <div>
                  <p className="text-[#E6FAF6]">Horário</p>
                  <p className="font-medium text-white">{agendamento.hora}</p>
                </div>
              </div>
      
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(agendamento)}
                  className="flex items-center gap-1 bg-[#33564F] text-[#55FF00] px-3 py-1.5 rounded-md text-xs hover:bg-[#147D43] transition"
                >
                  <FaEdit className="text-sm" /> Editar
                </button>
                <button
                  onClick={() => onDelete(agendamento)}
                  className="flex items-center gap-1 bg-red-50 text-red-700 px-3 py-1.5 rounded-md text-xs hover:bg-red-100 transition"
                >
                  <FaTrash className="text-sm" /> Apagar
                </button>
              </div>
            </div>
          ))}
      
        </div>
      </div>
      
    );
}
