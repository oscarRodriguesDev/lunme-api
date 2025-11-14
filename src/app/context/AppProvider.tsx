'use client';

import React, { useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import { MdMenu, MdClose, MdSpaceDashboard } from 'react-icons/md';
import { LuCalendarDays, LuLibraryBig } from 'react-icons/lu';
import { BsCreditCard2BackFill, BsCalendarCheckFill } from 'react-icons/bs';
import { PiUserCheckFill } from 'react-icons/pi';
import { FaSadTear } from 'react-icons/fa';
import { GrUserAdmin } from 'react-icons/gr';
import { FaHourglassHalf } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import CardUser from '../(private-access)/components/cardUser';
import { useSession } from 'next-auth/react';

type AppProviderProps = {
  children: React.ReactNode;
};

type MenuItemProps = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
};

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const router = useRouter();


  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);



  const MenuItem: React.FC<MenuItemProps> = ({ icon, label, onClick }) => (
    <div
    className="
      flex items-center py-1 px-2 space-x-3
      border-b border-[#33564F]
      rounded-md
      text-[#E6FAF6]
      hover:text-[#55FF00] hover:bg-[#1D3330]
      active:scale-95 active:bg-[#33564F]/70
      transition
      duration-200
      cursor-pointer
      select-none
      focus:outline-none focus:ring-2 focus:ring-[#55FF00]/50
    "
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') onClick();
    }}
  >
    {icon}
    <span className="text-sm font-semibold">{label}</span>
  </div>
  
  );

  return (

<main
  className="
    flex-1 
    ml-[250px] 
    mt-[10px] 
    h-auto 
    min-h-[calc(100vh-3px)] 
    bg-gradient-to-br from-[#0F1113] via-[#33564F] to-[#1D3330] 
    text-[#E6FAF6]
  "
>
  {children}
</main>

  
  );
};

export default AppProvider;
