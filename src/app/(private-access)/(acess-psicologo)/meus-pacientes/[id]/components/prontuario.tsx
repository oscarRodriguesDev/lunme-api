'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import Prontuario from '../../../../../../../types/prontuario';

interface Props {
  pacienteId: string;
  open: boolean;
  onClose: () => void;
}

export default function ProntuarioModal({ pacienteId, open, onClose }: Props) {
  const [prontuario, setProntuario] = useState<Prontuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;

    async function fetchProntuario() {
      setLoading(true);
      try {
        const res = await fetch(`/api/internal/prontuario?pacienteId=${pacienteId}`);
        if (!res.ok) throw new Error('Erro ao buscar prontuário');
        const data = await res.json();
        setProntuario(data);
      } catch (error) {
        console.error('Erro ao carregar prontuário:', error);
        setProntuario(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProntuario();
  }, [pacienteId, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-[#232528] rounded-2xl shadow-xl w-full max-w-2xl p-6 relative border border-[#33564F]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#E6FAF6] hover:text-[#55FF00]"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-[#E6FAF6]">Prontuário do Paciente</h2>

        {loading ? (
          <p className="text-[#E6FAF6]">Carregando prontuário...</p>
        ) : !prontuario ? (
          <p className="text-[#E6FAF6]">Nenhum prontuário encontrado.</p>
        ) : (
          <>
            <Info label="Queixa Principal" value={prontuario.queixaPrincipal} />
            <Info label="Histórico" value={prontuario.historico} />
            <Info label="Conduta" value={prontuario.conduta} />
            <Info label="Evolução" />
            <div className="max-h-60 overflow-y-auto bg-[#0F1113] rounded-md p-3 border border-[#33564F] whitespace-pre-line text-sm text-[#E6FAF6]">
              {prontuario.evolucao}
            </div>
            <div className="max-h-[9rem] overflow-y-auto space-y-1 bg-[#1F2924] rounded-md shadow-md p-3 border border-[#33564F] text-sm text-[#E6FAF6]">
              {(prontuario.transcription || '')
                .match(/\*--\d{2}\/\d{2}\/\d{4}/g)
                ?.map((entry, index) => {
                  const date = entry.replace("*--", "").trim();
                  return (
                    <div key={index} className="pb-1">
                      transcrição encontrada: {date}
                    </div>
                  );
                })}
            </div>

            <p className="text-xs text-[#55FF00] mt-4">
              Última atualização: {new Date(prontuario.updatedAt).toLocaleString()}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div className="mb-3">
      <label className="block font-medium text-[#E6FAF6]">{label}:</label>
      <p className="text-[#E6FAF6]">{value || 'Não informado'}</p>
    </div>
  );
}
