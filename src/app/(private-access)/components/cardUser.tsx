'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import userDefault from '../../../../public/profile_pictures_ps/userdefault.png';
import { showErrorMessage } from "../../util/messages";

interface CardUserProps {
  darkMode?: boolean; // opcional para adequar cores do menu lateral
}

const CardUser: React.FC<CardUserProps> = ({ darkMode }) => {
  const { data: session, status } = useSession();
  const [cardOpen, setCardOpen] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  const [id, setId] = useState<string | null>('');

  const userId = session?.user?.id;
  const urlPerfil = `/user-profile/${id}`;

  useEffect(() => {
    if (!userId) return;

    const cacheKey = `fotoPerfil_${userId}`;
    const cachedFoto = localStorage.getItem(cacheKey);

    if (cachedFoto) {
      setFotoPerfil(cachedFoto);
      return;
    }

    const fetchFotoPerfil = async () => {
      try {
        const response = await fetch(`/api/internal/uploads/profile/?userId=${userId}`);
        const data = await response.json();

        if (data?.url) {
          localStorage.setItem(cacheKey, data.url);
          setFotoPerfil(data.url);
        }
      } catch (error) {
        showErrorMessage(`Erro ao buscar dados do usuário: ${error}`);
      }
    };

    fetchFotoPerfil();
  }, [userId]);

  useEffect(() => {
    if (userId) setId(userId);
  }, [userId]);

  const handleLogout = async () => {
    if (userId) localStorage.removeItem(`fotoPerfil_${userId}`);
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="relative">
    {/* Cabeçalho do card */}
    <div
      onClick={() => setCardOpen(!cardOpen)}
      className="
        flex items-center gap-3 cursor-pointer px-4 py-2 rounded-xl shadow-md
        transition-all duration-300
        bg-[#33564F] border border-[#55FF00]/30 hover:border-[#55FF00]
      "
    >
      {status === "authenticated" ? (
        <>
          <div className="rounded-full w-[40px] h-[40px] border border-[#55FF00]/40 overflow-hidden bg-center bg-cover" style={{ backgroundImage: `url('${fotoPerfil || userDefault.src || userDefault}')` }} />
          <span className="text-sm font-semibold text-[#E6FAF6] truncate max-w-[130px]">
            {session.user?.name}
          </span>
        </>
      ) : (
        <span className="text-[#E6FAF6]/70">Usuário não autenticado</span>
      )}
    </div>
  
    {/* Dropdown do card */}
    {cardOpen && status === "authenticated" && (
      <div className="absolute right-0 mt-2 w-48 bg-[#0F1113] border border-[#33564F] rounded-xl shadow-lg z-50 animate-fadeIn">
        <Link
          href={urlPerfil}
          className="block px-4 py-2 text-sm text-[#E6FAF6] hover:bg-[#55FF00]/20 rounded-t-xl transition"
        >
          Meu perfil
        </Link>
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-600/20 rounded-b-xl transition"
        >
          Sair
        </button>
      </div>
    )}
  </div>
  
  );
};

export default CardUser;
