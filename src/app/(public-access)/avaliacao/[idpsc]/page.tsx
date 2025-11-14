"use client";
import { useEffect, useState } from "react";
import { showSuccessMessage } from "@/app/util/messages";
import { useParams } from "next/navigation";

type AvaliacaoCampos = {
  audio: number;
  video: number;
  experienciaGeral: number;
  avaliacaoProfissional: number;
  comentario: string;
  psicologoId: string;
};

export default function AvaliacaoReuniao() {
  const [avaliacao, setAvaliacao] = useState<AvaliacaoCampos>({
    audio: 0,
    video: 0,
    experienciaGeral: 0,
    avaliacaoProfissional: 0,
    comentario: "",
    psicologoId: "",
  });

  const [isAvaliado, setAvaliado] = useState(false);
  const { idPsicologo } = useParams();
  const psicologoId = String(idPsicologo);

  useEffect(() => {
    setAvaliacao((prev) => ({ ...prev, psicologoId }));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/avaliacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(avaliacao),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao enviar avaliação");

      setAvaliado(true);
      showSuccessMessage("Avaliação enviada com sucesso!");
    } catch (error) {
      console.error(error);
    }
  };

  const campos: { label: string; key: keyof AvaliacaoCampos }[] = [
    { label: "Qualidade do Áudio", key: "audio" },
    { label: "Qualidade do Vídeo", key: "video" },
    { label: "Experiência Geral", key: "experienciaGeral" },
    { label: "Atendimento do Psicólogo", key: "avaliacaoProfissional" },
  ];

  const renderNota = (campo: keyof AvaliacaoCampos) => (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((nota) => (
        <button
          key={nota}
          type="button"
          className={`w-9 h-9 rounded-full text-sm font-semibold border transition-colors duration-150 ${
            avaliacao[campo] === nota
              ? "bg-gradient-to-tr from-[#55FF00]/70 via-[#33FF00]/70 to-[#55FF00]/70 text-black shadow-md"
              : "bg-gray-800 text-gray-300 hover:bg-[#33FF00]/20 hover:text-white"
          }`}
          onClick={() =>
            setAvaliacao((prev) => ({ ...prev, [campo]: nota }))
          }
        >
          {nota}
        </button>
      ))}
    </div>
  );

  return (
    <div
      className="min-h-screen bg-black/90 text-white flex items-center justify-center px-4 relative"
      style={{
        backgroundImage: `url("/marca/big-logo.png")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "1500px",
      }}
    >
      {!isAvaliado ? (
        <div className="w-full max-w-2xl bg-[#0F1113]/80 backdrop-blur-lg rounded-xl shadow-xl p-8 border border-[#3D975B]/50">
          <h2 className="text-center text-2xl font-semibold text-[#55FF00] mb-8">
            Avalie sua reunião e atendimento
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {campos.map(({ label, key }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-[#E6FAF6] w-48">{label}</span>
                  {renderNota(key)}
                </div>
              ))}
            </div>

            <div>
              <label className="block text-[#E6FAF6] mb-1">Comentários:</label>
              <textarea
                className="w-full p-2 border border-[#33564F] rounded-md resize-none bg-[#1a1a1a] text-[#E6FAF6] placeholder:text-gray-500"
                rows={4}
                placeholder="Conte-nos o que achou da reunião e do atendimento..."
                value={avaliacao.comentario}
                onChange={(e) =>
                  setAvaliacao((prev) => ({
                    ...prev,
                    comentario: e.target.value,
                  }))
                }
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-[#33564F] via-[#55FF00] to-[#33FF00] text-black font-semibold rounded-lg shadow hover:from-[#55FF00] hover:via-[#33FF00] hover:to-[#55FF00] transition-colors duration-200"
              >
                Enviar Avaliação
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="w-full max-w-2xl bg-[#0F1113]/70 backdrop-blur-lg rounded-xl shadow-xl p-8 text-center border border-[#3D975B]/50">
          <h2 className="text-3xl font-semibold text-[#55FF00] mb-4">
            Obrigado pela sua avaliação!
          </h2>
          <p className="text-[#E6FAF6]">
            Sua opinião é muito importante para nós. Até breve!
          </p>
        </div>
      )}
    </div>
  );
}
