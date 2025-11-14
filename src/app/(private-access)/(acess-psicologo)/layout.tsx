

import type { Metadata } from "next";
import AuthProvider from "../../context/AuthProvider";
import Menu from "@/app/(private-access)/components/menuLateral";
import { AccessControlProvider } from "../../context/AcessControl";
import { HistoryProvider } from "@/app/context/historyContext";
import AppProvider from "@/app/context/AppProvider";



export const metadata: Metadata = {
  title: "Lunme",
  description: "Lunme é um sistema inteligente que transforma suas cosnultas online com transcrição, trazendo insights com inteligencia artificial",
  keywords: "inteligência artificial, reuniões, transcrição automática, agendamento inteligente, produtividade, assistente virtual",
  robots: "index, follow",
  openGraph: {
    title: "Lunme - Revolucione Suas Reuniões",
    description: "Aumente sua produtividade com o Lunme, o assistente inteligente para reuniões que transcreve, agenda e fornece insights em tempo real.",
    url: "https://lunme.com.br",
    type: "website",
    locale: "pt_BR",
    siteName: "Lunme",

  },

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <HistoryProvider>


          <AuthProvider>
              <AccessControlProvider>
          {/*   <div className="flex-1 ml-[300px] mt-2"> */}
             
            <Menu />
                <AppProvider>
              {children}
           </AppProvider>
            {/* </div> */}
              </AccessControlProvider>
          </AuthProvider>
      
        </HistoryProvider>
  );
}

