'use client'
import { useAccessControl } from "@/app/context/AcessControl"
import { FaList, FaFileAlt } from "react-icons/fa"
import HeadPage from "@/app/(private-access)/components/headPage"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"



interface Historico {
  id: string;
  psicologoId: string;
  descricao: string;
  tipo: string;
  timestamp: string;
}

export default function HistoricoPage() {
  const [historicos, setHistoricos] = useState<Historico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { role } = useAccessControl()


  const psicologoId = useParams().id

  useEffect(() => {
    const fetchHistorico = async () => {
      if (!psicologoId) return;

      try {
        const res = await fetch(`/api/internal/history?psicologoId=${psicologoId}`);
        if (!res.ok) throw new Error('Erro ao buscar histórico');
        const data = await res.json();
        setHistoricos(data);
      } catch (err: any) {
        setError(err.message || 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchHistorico();
  }, [psicologoId]);

  if (!psicologoId) return <p className="text-red-500 p-4">Parâmetro `psicologoId` ausente na URL.</p>;
  if (loading) return <p className="p-4">Carregando histórico...</p>;
  if (error) return <p className="text-red-500 p-4">{error}</p>;
  if (historicos.length === 0) return <p className="p-4">Nenhum histórico encontrado.</p>;


  const handleDelete = async (id: string) => {


    try {
      const response = await fetch(`/api/internal/history?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove o item do estado local
        setHistoricos(prev => prev.filter(h => h.id !== id));
      } else {
        throw new Error('Erro ao deletar histórico');
      }
    } catch (error) {
      console.error('Erro ao deletar histórico:', error);
      alert('Erro ao deletar histórico. Tente novamente.');
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
  <HeadPage title="Histórico" icon={<FaList size={20} />} />

  <div className="p-6 max-w-4xl mx-auto">
    <h1 className="text-2xl font-bold mb-6 text-gray-400">Histórico de Ações</h1>
    <ul className="space-y-4">
      {historicos.map((h) => (
        <li
          key={h.id}
          className="relative border border-gray-200 p-4 rounded-xl shadow hover:shadow-md transition-shadow bg-white"
        >
          {/* Botão de deletar */}
          <span
            onClick={() => handleDelete(h.id)}
            className="absolute top-3 right-3 text-red-500 hover:text-red-700 font-bold text-lg cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110 active:scale-95 select-none"
            title="Deletar histórico"
          >
            ×
          </span>

          {/* Conteúdo */}
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Tipo:</span> {h.tipo}
          </p>
          <p className="mt-1 text-gray-800">{h.descricao}</p>
          <p className="text-xs text-gray-400 mt-2">
            {new Date(h.timestamp).toLocaleString('pt-BR')}
          </p>
        </li>
      ))}
    </ul>
  </div>
</>

  );
}
