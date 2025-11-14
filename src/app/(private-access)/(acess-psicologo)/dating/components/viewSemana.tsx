import { useState, useMemo } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";

type Agendamento = {
    id: string;
    name: string;
    data: string; // formato "yyyy-mm-dd"
    hora: string;
};

type ViewSemanalProps = {
    agendamentos: Agendamento[];
    onDelete: (id: string) => void;
    onEdit: (agendamento:any) => void;
};

export default function ViewSemanal({ agendamentos, onDelete, onEdit }: ViewSemanalProps) {
    const [offsetSemanal, setOffsetSemanal] = useState(0);

    const diasDaSemana = useMemo(() => {
        const hoje = new Date();
        const diaDaSemanaAtual = hoje.getDay();

        const domingo = new Date(hoje);
        domingo.setDate(hoje.getDate() - diaDaSemanaAtual + offsetSemanal * 7);

        const dias = [];
        for (let i = 0; i < 7; i++) {
            const dia = new Date(domingo);
            dia.setDate(domingo.getDate() + i);
            dias.push(dia);
        }
        return dias;
    }, [offsetSemanal]);

    return (
        <div className="bg-[#2f363c] text-[#E6FAF6] p-4 max-h-[480px] overflow-y-auto rounded-xl shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setOffsetSemanal((prev) => prev - 1)}
            className="bg-[#2fd1d6] hover:bg-[#55FF00] text-[#0F1113] font-bold py-1 px-3 rounded transition"
          >
            ⬅ Semana anterior
          </button>
          <h2 className="text-xl font-semibold text-[#55FF00]">Agendamentos da Semana</h2>
          <button
            onClick={() => setOffsetSemanal((prev) => prev + 1)}
            className="bg-[#2fd1d6] hover:bg-[#55FF00] text-[#0F1113] font-bold py-1 px-3 rounded transition"
          >
            Semana seguinte ➡
          </button>
        </div>
      
        <div className="grid grid-cols-7 gap-4">
          {diasDaSemana.map((dia, index) => {
            const diaNome = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][index];
            const diaMes = dia.getDate();
            const mes = dia.getMonth() + 1;
            const diaISO = dia.toISOString().split("T")[0];
      
            const ags = agendamentos.filter((ag) => ag.data === diaISO);
      
            return (
              <div key={diaNome + diaISO} className="bg-[#33564F] p-3 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-[#55FF00]">
                  {diaNome} <span className="text-sm text-[#E6FAF6]">({diaMes}/{mes})</span>
                </h3>
      
                {ags.length > 0 ? (
                  ags.map((agendamento) => (
                    <div
                      key={agendamento.id}
                      className="mt-2 p-2 bg-[#0F1113] rounded-lg flex justify-between items-center shadow-inner"
                    >
                      <div className="w-full">
                        <p className="font-semibold text-[#55FF00]">{agendamento.name}</p>
                        <p className="text-[#E6FAF6]">{agendamento.hora}</p>
      
                        <div className="flex flex-row justify-between mt-2">
                          <button
                            onClick={() => onDelete(agendamento.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Deletar agendamento"
                          >
                            <FaTrash />
                          </button>
                          <button
                            onClick={() => onEdit(agendamento)}
                            className="text-[#55FF00] hover:text-[#33FF00]"
                            title="Editar agendamento"
                          >
                            <FaEdit />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[#E6FAF6] mt-2">Sem agendamentos</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
    );
}
