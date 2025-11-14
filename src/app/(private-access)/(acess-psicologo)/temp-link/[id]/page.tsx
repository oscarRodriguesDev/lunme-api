'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function GerarLinkAnamnesePage() {
  const { id } = useParams();
  const psicologoId = id?.toString() ?? '';
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiado, setCopiado] = useState(false);

  async function gerarLink() {
    setLoading(true);
    setCopiado(false);
    setLink('');
    try {
      const res = await fetch('/api/internal/gerar-link-anamnese', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ psicologoId }),
      });
      const data = await res.json();
      if (res.ok) {
        setLink(data.link);
      } else {
        alert(data.error || 'Erro ao gerar link.');
      }
    } catch (err) {
      alert('Erro inesperado.');
    } finally {
      setLoading(false);
    }
  }
  async function copiarLink() {
    if (link) {
      await navigator.clipboard.writeText(link);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  }
  return (
    <>
    <div className="min-h-screen bg-[#0F1113] text-[#E6FAF6] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl bg-[#232528] rounded-2xl shadow-lg p-8 border border-[#33564F]">
        <h1 className="text-3xl font-bold text-center text-[#55FF00] mb-6">
          Gerar Link de Anamnese
        </h1>
  
        <div className="space-y-6">
          <button
            onClick={gerarLink}
            disabled={loading || !psicologoId}
            className={`w-full bg-[#55FF00] hover:bg-[#33cc00] text-[#0F1113] font-semibold py-2 rounded-lg transition ${
              loading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Gerando...' : 'Gerar Link'}
          </button>
  
          {link && (
            <div className="mt-6 p-4 bg-[#1F2924] border border-[#33564F] rounded-lg shadow-sm">
              <p className="text-sm mb-2 font-medium text-[#E6FAF6]">Link gerado:</p>
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  readOnly
                  value={link}
                  className="flex-1 border border-[#33564F] rounded-lg px-3 py-1 text-sm bg-[#0F1113] text-[#E6FAF6]"
                />
                <button
                  onClick={copiarLink}
                  className="bg-[#55FF00] text-[#0F1113] px-4 py-1.5 rounded-lg text-sm hover:bg-[#33cc00]"
                >
                  {copiado ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </>
  
  );
}
