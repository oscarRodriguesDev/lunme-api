// src/app/layout.tsx
import type { Metadata } from "next";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Importante!
import './globals.css'
import CookiesAlert from "./(general-policies)/components/cookies-alert";



export const metadata: Metadata = {
  title: "Lunme",
  description: "Lunme é um sistema inteligente que transforma suas cosnultas online com transcrição, trazendo insights com inteligencia artificial",
  keywords: "inteligência artificial, reuniões, transcrição automática, agendamento inteligente, produtividade, assistente virtual",
  robots: "index, follow",
  openGraph: {
    title: "Lunme - Revolucione Suas Reuniões",
    description: "Aumente sua produtividade com o Lunme, o assistente inteligente para reuniões que transcreve, agenda e fornece insights em tempo real.",
    url: "https://app.lunme.com.br",
    type: "website",
    locale: "pt_BR",
    siteName: "Lunme Ai",

  },

};

/* Layout principal da aplicação */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <html lang="pt-BR">
    <body>
        {children}
        
        <ToastContainer/>
        <CookiesAlert/>
    </body>
  </html>
  );
}


