import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

export default function GPTModal({ isOpen, onClose, content }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
    <div className="bg-[#232528] rounded-2xl shadow-xl max-w-3xl w-[90%] max-h-[90vh] overflow-auto p-6 relative border border-[#33564F]">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-[#E6FAF6] hover:text-[#55FF00] text-xl"
      >
        &times;
      </button>
  
      <h2 className="text-xl font-semibold mb-4 text-[#E6FAF6]">Análise Gerada</h2>
      <div className="whitespace-pre-wrap text-[#E6FAF6]">
        {content}
      </div>
    </div>
  </div>
  
  );
}
