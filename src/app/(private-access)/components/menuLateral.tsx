'use client'
import React from "react";
import { MdSpaceDashboard } from "react-icons/md";
import { LuCalendarDays, LuLibraryBig } from "react-icons/lu";
import { BsCreditCard2BackFill, BsCalendarCheckFill } from "react-icons/bs";
import { PiUserCheckFill } from "react-icons/pi";
import { FaSadTear } from "react-icons/fa";
import { GrUserAdmin, GrDiamond } from "react-icons/gr";
import { FaHourglassHalf } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logomarca from '../../../../public/marca/marca-tiviai.png'; //alterar logomarca
import CardUser from "./cardUser";
import { useSession } from "next-auth/react";

type MenuItemProps = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
};

const Menu: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const id = session?.user.id;
  const role = session?.user?.role;

  return (
    <div className="absolute w-[244px] min-h-screen
      bg-gradient-to-b from-[#33564F] via-[#0F1113] to-[#0F1113]
      shadow-xl flex flex-col p-5 border-r border-[#33564F]">

      {/* Logomarca */}
      <div className="w-auto h-[40px] flex items-start justify-start mb-6">
        <Image
          src={Logomarca}
          alt="Logomarca Lunme"
          className="max-w-[120px] max-h-[40px] object-contain"
        />
      </div>

      {/* Usuário */}
      <div className="mb-6">
        <CardUser />
      </div>

      {/* Menu Items */}
      <nav className="flex-1 space-y-2">
        {(role === 'PSYCHOLOGIST' ? [
          { icon: <MdSpaceDashboard size={22} />, label: "Dashboard", route: `/dashboard/${id}` },
          { icon: <LuCalendarDays size={22} />, label: "Agendamentos", route: `/dating/${id}` },
          { icon: <BsCalendarCheckFill size={22} />, label: "Histórico", route: `/historico/${id}` },
          { icon: <FaSadTear size={22} />, label: "Meus Pacientes", route: `/meus-pacientes/${id}` },
          { icon: <LuLibraryBig size={22} />, label: "Base Científica", route: `/cientific/${id}` },
          { icon: <BsCreditCard2BackFill size={22} />, label: "Créditos", route: `/credit/${id}` },
          { icon: <FaHourglassHalf size={22} />, label: "Link Temporário", route: `/temp-link/${id}` },
          { icon: <MdSpaceDashboard size={22} />, label: "Dashboard", route: `/dashboard/${id}` },
        ] : [
          
          ...(role === 'ADMIN'
            ? [
              { icon: <MdSpaceDashboard size={22} />, label: "Dashboard", route: `/dashboard/${id}` },
                { icon: <PiUserCheckFill size={22} />, label: "Novos Psicólogos", route: '/aprove-psc' },
                { icon: <GrDiamond size={22} />, label: "Novo Produto", route: `/product-create/${id}` },
                { icon: <GrUserAdmin size={22} />, label: "Novo Administrador", route: '/novo_admin' },
              ]
              : role === 'PISICOLOGO_ADM'
              ? [
              { icon: <GrUserAdmin size={22} />, label: "Novo Administrador", route: '/novo_admin' },
              
              ]
            : []
          ),
        ]).map((item, idx) => (
          <MenuItem
            key={idx}
            icon={item.icon}
            label={item.label}
            onClick={() => router.push(item.route)}
          />
        ))}
      </nav>

      {/* Rodapé */}
      <div className="mt-auto text-xs text-gray-300 text-center pt-4 border-t border-[#33564F]">
        © 2025 Lunme
      </div>
    </div>
  );
};

// MenuItem com sombra leve e hover elegante
const MenuItem: React.FC<MenuItemProps> = ({ icon, label, onClick }) => (
  <div
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}
    className="
      flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer select-none
      text-[#E6FAF6] font-medium
      hover:text-[#0F1113] hover:bg-[#55FF00]/25
      shadow-sm hover:shadow-md
      transition-all duration-200
      active:scale-95 active:bg-[#55FF00]/35
      focus:outline-none focus:ring-2 focus:ring-[#55FF00]/50
    "
  >
    {icon}
    <span className="text-sm">{label}</span>
  </div>
);

export default Menu;
