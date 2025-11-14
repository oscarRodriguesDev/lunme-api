import React, { useEffect, useState } from "react";

interface Plano {
  id: string;
  codigo: string;
  titulo: string;
  descricao: string;
  preco: number;
  valorUn: number;
  quantidade: number;
  createdAt?: string;
  updatedAt?: string;
}
interface RecarregaProps{
    load:boolean
}

const PlanosTable: React.FC<RecarregaProps> = ({ load })  => {
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [atualizar, setAtualizar] = useState<boolean>(false)

  useEffect(() => {
    const fetchPlanos = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/internal/products");
        if (!res.ok) {
          throw new Error("Erro ao buscar planos");
        }
        const data = await res.json();
        setPlanos(data);
      } catch (err: any) {
        setError(err.message || "Erro ao buscar planos");
      } finally {
        setLoading(false);
        setAtualizar(false);
      }
    };

    fetchPlanos();
  }, [atualizar,load]);

  // Função para deletar os planos
  const deletarPlano = async (codigo: string) => {
    const confirmDelete = window.confirm("Tem certeza que deseja deletar este plano?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/internal/products/?codigo=${codigo}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Erro ao deletar o plano");
      }
      // Remove o produto deletado da lista local
      setPlanos((prev) => prev.filter((produto) => produto.id !== codigo));
    } catch (error: any) {
      alert(error.message || "Erro ao deletar o plano");
    }
    setAtualizar(true);
  };

  return (
    <div className="overflow-x-auto">
    {loading ? (
      <div className="text-center py-4 text-foreground">Carregando planos...</div>
    ) : error ? (
      <div className="text-center text-destructive py-4">{error}</div>
    ) : planos.length === 0 ? (
      <div className="text-center py-4 text-muted-foreground">Nenhum plano cadastrado.</div>
    ) : (
      <table className="min-w-full bg-card border border-border rounded-lg shadow">
        <thead className="bg-primary text-primary-foreground">
          <tr>
            <th className="px-4 py-2 border-b border-border text-left">Código</th>
            <th className="px-4 py-2 border-b border-border text-left">Título</th>
            <th className="px-4 py-2 border-b border-border text-left">Descrição</th>
            <th className="px-4 py-2 border-b border-border text-center">Qtd. Créditos</th>
            <th className="px-4 py-2 border-b border-border text-right">Valor Crédito (R$)</th>
            <th className="px-4 py-2 border-b border-border text-right">Preço Total (R$)</th>
            <th className="px-4 py-2 border-b border-border text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {planos.map((plano) => (
            <tr
              key={plano.id}
              className="hover:bg-secondary hover:text-secondary-foreground transition-colors"
            >
              <td className="text-sm px-4 py-2 border-b border-border">{plano.codigo}</td>
              <td className="text-sm px-4 py-2 border-b border-border">{plano.titulo}</td>
              <td className="text-sm px-4 py-2 border-b border-border">{plano.descricao}</td>
              <td className="text-sm px-4 py-2 border-b border-border text-center">{plano.quantidade}</td>
              <td className="text-sm px-4 py-2 border-b border-border text-right">
                {plano.valorUn.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </td>
              <td className="px-4 py-2 border-b border-border text-right">
                {plano.preco.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </td>
              <td className="px-4 py-2 border-b border-border text-center">
                <button
                  onClick={() => deletarPlano(plano.codigo)}
                  className="text-destructive font-bold hover:opacity-80 transition"
                >
                  ✖
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
  
  );
};

export default PlanosTable;
