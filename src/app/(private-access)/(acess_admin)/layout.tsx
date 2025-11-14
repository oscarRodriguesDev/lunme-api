
/**
 * Importações principais para o layout da aplicação:
 *
 * - `Metadata` (do Next.js): Tipo usado para definir metadados da página (como título, descrição etc).
 *
 * - `AuthProvider`: Componente responsável por encapsular a aplicação com a lógica de autenticação via `next-auth`
 *   e proteger rotas com base no status da sessão, utilizando o componente `AuthGuard` internamente.
 *
 * - `Menu`: Componente da interface que representa o menu lateral de navegação.
 *   Geralmente exibido em todas as páginas autenticadas.
 *
 * - `AccessControlProvider`: Contexto de controle de acesso que pode gerenciar permissões, papéis ou regras de
 *   acesso dos usuários às funcionalidades e componentes da aplicação.
 */

import type { Metadata } from "next";
import AuthProvider from "@/app/context/AuthProvider";
import Menu from "@/app/(private-access)/components/menuLateral";
import { AccessControlProvider } from "@/app/context/AcessControl";
import AppProvider from "@/app/context/AppProvider";


/**
 * Metadados da aplicação Tivi AI para SEO e compartilhamento social.
 *
 * Este objeto segue o padrão do Next.js para definição de metadados em páginas,
 * otimizando a aplicação para mecanismos de busca (SEO) e redes sociais.
 *
 * @property {string} title - Título da aba/navegador e título principal exibido nos resultados de busca.
 * @property {string} description - Descrição curta do sistema, usada por buscadores e ao compartilhar o link.
 * @property {string} keywords - Palavras-chave relevantes para o conteúdo do sistema, ajudando na indexação.
 * @property {string} robots - Instruções para os robôs de busca sobre indexação e rastreamento.
 * @property {object} openGraph - Metadados específicos para quando o link é compartilhado em redes sociais.
 * @property {string} openGraph.title - Título exibido no preview das redes sociais.
 * @property {string} openGraph.description - Descrição complementar para redes sociais.
 * @property {string} openGraph.url - URL principal da aplicação.
 * @property {string} openGraph.type - Tipo do conteúdo (ex: website, article, etc).
 * @property {string} openGraph.locale - Localização/língua da aplicação (pt_BR).
 * @property {string} openGraph.siteName - Nome do site a ser exibido nas redes sociais.
 */

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


/**
 * Layout principal da aplicação Tivi AI.
 *
 * Este componente é o layout padrão para todas as páginas autenticadas da aplicação.
 * Ele envolve a aplicação inteira com o componente `AuthProvider` para gerenciar a autenticação
 * e protege as rotas com o componente `AccessControlProvider`.
 *
 * O layout inclui o componente `Menu` para navegação lateral e o conteúdo da página passado como `children`.
 *
 * @param {Object} props - Propriedades do componente.
 * @param {React.ReactNode} props.children - Elementos filhos que representam o conteúdo da página.
 * @returns {JSX.Element} Elemento JSX que representa o layout principal da aplicação.
 */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <AuthProvider>
      <AccessControlProvider>
        <Menu />
      {/*   <div className="flex-1 ml-[300px] mt-2"> */}

          <AppProvider>
            {children}
          </AppProvider>
       {/*  </div> */}
      </AccessControlProvider>
    </AuthProvider>

  );
}

