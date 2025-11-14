'use client';
import { useAccessControl } from "@/app/context/AcessControl";
import { FaUserMd, FaCalendarAlt, FaUsers, FaEnvelope, FaLightbulb } from "react-icons/fa";
import HeadPage from "@/app/(private-access)/components/headPage";
import { useSession } from "next-auth/react";
import { useHistory } from "@/app/context/historyContext";
import { use, useEffect } from "react";

const PaginaInicial = () => {
  const { role } = useAccessControl();
  const session = useSession();
  const { logAction } = useHistory();
  const id = session.data?.user?.id;

  const dadosMock = {
    consultasHoje: 4,
    pacientesAtivos: 12,
    mensagensNaoLidas: 3,
    dicaDoDia: "Lembre-se de registrar sempre suas séssoes com clareza e objetividade.",
  };



  return (
<>
  <div>
    <HeadPage title="Bem-vinda(o), Psicóloga(o)" icon={<FaUserMd size={20} />} />
    {role === "PSYCHOLOGIST" || role === "ADMIN" ? (
      <div className="px-4 py-6 space-y-6 max-w-5xl mx-auto">
        {/* Saudação */}
        <div className="bg-[#0F1113] p-4 sm:p-6 rounded-2xl shadow text-[#E6FAF6]">
          <h2 className="text-lg sm:text-2xl font-semibold mb-2">
            Olá, {session.data?.user.name ?? "Profissional"} 👋
          </h2>
          <p className="text-[#E6FAF6]/80 text-sm sm:text-base leading-relaxed">
            Que bom te ver por aqui! Esperamos que você tenha um dia produtivo e leve. Abaixo estão algumas informações rápidas para você começar:
          </p>
        </div>

        {/* Cards de informações */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <div className="bg-[#1D3330] border border-[#33564F] p-4 rounded-2xl flex items-center gap-3">
            <FaCalendarAlt className="text-[#55FF00] text-3xl" />
            <div>
              <p className="text-xs sm:text-sm text-[#E6FAF6]/70 uppercase font-medium tracking-wide">Consultas Hoje</p>
              <p className="text-xl font-bold text-[#E6FAF6]">{dadosMock.consultasHoje}</p>
            </div>
          </div>
          <div className="bg-[#1D3330] border border-[#33564F] p-4 rounded-2xl flex items-center gap-3">
            <FaUsers className="text-[#55FF00] text-3xl" />
            <div>
              <p className="text-xs sm:text-sm text-[#E6FAF6]/70 uppercase font-medium tracking-wide">Pacientes Ativos</p>
              <p className="text-xl font-bold text-[#E6FAF6]">{dadosMock.pacientesAtivos}</p>
            </div>
          </div>
          <div className="bg-[#1D3330] border border-[#33564F] p-4 rounded-2xl flex items-center gap-3">
            <FaEnvelope className="text-[#55FF00] text-3xl" />
            <div>
              <p className="text-xs sm:text-sm text-[#E6FAF6]/70 uppercase font-medium tracking-wide">Mensagens Não Lidas</p>
              <p className="text-xl font-bold text-[#E6FAF6]">{dadosMock.mensagensNaoLidas}</p>
            </div>
          </div>
        </div>

        {/* Dica do dia */}
        <div className="bg-[#0F1113] p-5 rounded-2xl shadow flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <FaLightbulb className="text-[#55FF00] text-4xl flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-[#E6FAF6] mb-2 text-lg">Dica do Dia</h3>
            <p className="text-[#E6FAF6]/80 text-sm sm:text-base leading-relaxed">{dadosMock.dicaDoDia}</p>
          </div>
        </div>

        {/* Código de ética / lembrete */}
        <div className="bg-[#1D3330] border-l-4 border-[#55FF00] p-4 rounded-xl text-xs sm:text-sm text-[#E6FAF6]/80">
          Lembre-se: todas as interações devem respeitar o <strong className="text-[#55FF00]">Código de Ética do Psicólogo</strong>. Em caso de dúvida, consulte seu Conselho Regional.
        </div>
      </div>
    ) : (
      <div className="flex justify-center items-center h-screen text-[#E6FAF6]/80 text-center px-4 text-sm sm:text-base">
        Essa página é acessível apenas para psicólogos.
      </div>
    )}
  </div>
</>

  );
};

export default PaginaInicial;
