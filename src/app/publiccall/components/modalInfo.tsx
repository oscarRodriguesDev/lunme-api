import { useEffect, useRef } from "react";

type Props = {
  mostrar: boolean;
  onFechar: () => void;
};

export default function PopupAjuda({ mostrar, onFechar }: Props) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Fecha ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onFechar();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onFechar]);

  if (!mostrar) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative"
      >
        <button
          onClick={onFechar}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✖
        </button>
        <h2 className="text-lg font-semibold text-[#3D975B] mb-2">Permissões necessárias</h2>
        <p className="text-sm text-gray-800 mb-2">
          Para usar o microfone e a transcrição ao vivo, ative o microfone do navegador:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-700 mb-3">
          <li>Clique no ícone ao lado da barra de endereço (🔒 ou ⚙️).</li>
          <li>Vá em <strong>“Permissões”</strong> e permita o uso do microfone.</li>
          <li>Atualize a página após a mudança.</li>
        </ul>
        <p className="text-xs text-gray-500 italic">
          Suas falas são tratadas com sigilo e usadas para melhorar seu atendimento.
        </p>
      </div>
    </div>
  );
}
