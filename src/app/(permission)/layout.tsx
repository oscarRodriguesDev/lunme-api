import type { Metadata } from "next";
import '@/app/globals.css'

import AuthProvider from "../context/AuthProvider";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <AuthProvider>
      {children}
    </AuthProvider>

  );
}

