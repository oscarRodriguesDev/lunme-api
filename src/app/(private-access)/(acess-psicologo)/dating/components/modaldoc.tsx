'use client'
import React, { useEffect, useState } from 'react';
import { useAccessControl } from '@/app/context/AcessControl';


type DocumentoModalProps = {
  onClose: () => void;
  onGenerate: () => void;
  onSelectTipo: (tipo: string) => void;
  tipoSelecionado?: string;
  prompt:string
};

const tipos: string[] = [];

interface Docs {
  id: string
  name: string
  psicologoId: string
  prompt: string
}


export const DocumentoModal: React.FC<DocumentoModalProps> = ({
  onClose,
  onGenerate,
  onSelectTipo,
  tipoSelecionado,
  prompt,
}) => {
  const { userID } = useAccessControl();
  const [documentos, setDocumentos] = useState<Docs[]>([])

useEffect(() => {
  const fetchDocumentos = async () => {
    try {
      const response = await fetch(`/api/internal/uploads/doc-model/?psicologoId=${userID}`)
      if (!response.ok) throw new Error("Erro ao buscar documentos")

      const data: Docs[] = await response.json()
      setDocumentos(data)

      // Coleta os nomes únicos e ordena
      const nomesUnicosOrdenados = Array.from(
        new Set(data.map(doc => doc.name))
      ).sort((a, b) => a.localeCompare(b))

      // Substitui os valores da lista `tipos` diretamente
      tipos.length = 0
      tipos.push(...nomesUnicosOrdenados)

      console.log("Tipos atualizados:", tipos)
    } catch (error) {
      console.error("Erro ao buscar tipos de documentos:", error)
    }
  }

  if (userID) fetchDocumentos()
}, [userID])



  return (
    <>
    
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3e3c3c] bg-opacity-50 backdrop-blur-sm px-4">
      <div className="bg-[#3f5942] rounded-2xl p-6 w-full max-w-2xl shadow-2xl border border-gray-200">
        <h2 className="text-xl font-bold text-center text-[#bef6f3] mb-4">
          Escolha o Documento desejado
        </h2>

        <div className="grid grid-cols-6 gap-3 justify-items-center mb-5">
          {tipos.map((tipo) => (
            <button
              key={tipo}
              onClick={() => onSelectTipo(tipo)}
              className={`w-14 h-14 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all ${tipoSelecionado === tipo
                  ? 'bg-[#117E43] text-white border-[#117E43] shadow'
                  : 'bg-white text-[#232b27] border-[#117E43] hover:bg-[#9898de]'
                }`}
            >
              {tipo}
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="border-2 border-[#117E43] text-[#d1d9d4] font-medium px-4 py-2 rounded-lg hover:bg-[#1f2b25] transition"
          >
            Cancelar
          </button>
          <button
            onClick={onGenerate}
            className="bg-[#117E43] text-white font-medium px-4 py-2 rounded-lg shadow hover:bg-[#1f2b25] transition"
          >
            Gerar documento
          </button>
        </div>
      </div>
    </div>
    </>


  );
};
