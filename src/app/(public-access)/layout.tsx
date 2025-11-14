import type React from "react"
import type { Metadata } from "next"
import "../globals.css"




export const metadata: Metadata = {
  title: "Lunme - Consultas Inteligentes",
  description:
    "Lunme é um sistema inteligente que transforma suas consultas online com transcrição, trazendo insights com inteligência artificial",
  keywords:
    `inteligência artificial, reuniões, transcrição automática,
     agendamento inteligente, produtividade, assistente virtual,psicologia,psicologos,
     nr1,saudeocupacional, saúde emocional,chat gpt, agente de ia `,
  robots: "index, follow",
  openGraph: {
    title: "Lunme - Revolucione Suas Reuniões",
    description:
      "Aumente sua produtividade com o Lunme, o assistente inteligente para reuniões que transcreve, agenda e fornece insights em tempo real.",
    url: "https://lunme.com.br",
    type: "website",
    locale: "PT_BR",
    siteName: "Lunme",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <main className="min-h-screen pt-16">{children}</main>
     
    </>

  )
}
