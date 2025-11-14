'use client'

import React from "react";

const PoliticaCookies = () => {

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([
            document.getElementById("politica-cookies")?.innerText || ""
        ], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "politica-de-cookies-lunme.txt";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (

        <>
        <div className="max-w-4xl mx-auto px-6 py-10 text-justify bg-white text-black rounded-2xl shadow-md" id="politica-cookies">
            <h1 className="text-3xl font-bold mb-6 text-[#3D975B]">Política de Cookies – Lunme</h1>

            <h2 className="text-2xl font-semibold mt-8 mb-3 text-[#3D975B]">1. Introdução</h2>
            <p className="leading-relaxed mb-4">
                A Lunme valoriza a privacidade e a transparência no tratamento dos dados de seus usuários. Esta Política de Cookies tem como
                objetivo esclarecer como utilizamos cookies e tecnologias semelhantes para coletar e armazenar informações durante a navegação
                em nossa plataforma. Aqui, explicamos o que são cookies, quais tipos utilizamos, para que servem e como você pode gerenciar suas preferências.
                Nosso compromisso é garantir que seus dados sejam tratados com segurança, respeito e em conformidade com a Lei Geral de Proteção de Dados Pessoais
                (Lei nº 13.709/2018 – LGPD).
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-3 text-[#3D975B]">2. O que são cookies?</h2>
            <p className="leading-relaxed mb-4">
                Cookies são pequenos arquivos de texto enviados por um site ao navegador do usuário, que ficam armazenados no dispositivo (computador, smartphone, tablet).
                Esses arquivos permitem o reconhecimento do dispositivo em visitas futuras, facilitando a navegação e possibilitando recursos personalizados.
                Além de cookies, também podemos utilizar tecnologias semelhantes, como localStorage, sessionStorage e tokens, para armazenar informações localmente
                no seu navegador de forma segura.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-3 text-[#3D975B]">3. Por que usamos cookies?</h2>
            <p className="leading-relaxed mb-4">
                Os cookies desempenham um papel fundamental no funcionamento da plataforma da Lunme. Abaixo listamos os principais motivos pelos quais
                os utilizamos:
            </p>
            <ul className="list-disc list-inside mb-4 pl-4">
                <li>Manutenção da sessão do usuário: ao fazer login, armazenamos dados essenciais para manter sua sessão ativa e segura até que você opte por sair.</li>
                <li>Armazenamento de preferências: registramos escolhas como o tema da aplicação (modo claro ou escuro), idioma ou outras configurações personalizadas.</li>
                <li>Gestão de consentimentos: usamos cookies para registrar se você já leu e aceitou nossa política de cookies, bem como se concedeu ou não autorização para o tratamento de dados pessoais.</li>
                <li>Melhoria contínua da experiência: cookies nos ajudam a entender como os usuários interagem com nossa interface, permitindo ajustes para melhorar usabilidade e desempenho.</li>
            </ul>
            <p className="mb-4">
                <strong className="text-[#3D975B]">Importante:</strong> a Lunme não utiliza cookies com fins publicitários ou para rastrear comportamento fora de nossa plataforma.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-3 text-[#3D975B]">4. Quais cookies utilizamos</h2>
            <p className="leading-relaxed mb-4">
                Os cookies utilizados pela Lunme podem ser classificados conforme a sua finalidade e tempo de expiração:
            </p>
            <ul className="list-disc list-inside mb-4 pl-4">
                <li><strong>Cookies Essenciais:</strong> Necessários para o funcionamento básico da plataforma.</li>
                <li><strong>Cookies de Funcionalidade:</strong> Armazenam preferências do usuário.</li>
                <li><strong>Cookies de Consentimento:</strong> Registram decisões sobre privacidade.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-3 text-[#3D975B]">5. Consentimento e controle do usuário</h2>
            <p className="leading-relaxed mb-4">
                Durante seu primeiro acesso à plataforma, exibiremos um banner de consentimento solicitando sua permissão para o uso de cookies. Você poderá:
            </p>
            <ul className="list-disc list-inside mb-4 pl-4">
                <li>Aceitar todos os cookies</li>
                <li>Configurar preferências de privacidade</li>
                <li>Rejeitar o uso de cookies não essenciais</li>
                <li>Modificar suas escolhas a qualquer momento por meio das configurações da conta ou diretamente no navegador</li>
            </ul>
            <p className="mb-4">
                Recomendamos que você permita o uso dos cookies essenciais para garantir o funcionamento correto do sistema.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-3 text-[#3D975B]">6. Como gerenciar ou excluir cookies</h2>
            <p className="leading-relaxed mb-4">
                Você tem total autonomia para controlar e/ou excluir os cookies já armazenados em seu dispositivo. Para isso, acesse as configurações do seu navegador preferido:
            </p>
            <ul className="list-disc list-inside mb-4 pl-4">
                <li>
                    Google Chrome – <a href="https://support.google.com/accounts/answer/61416?hl=pt-BR" target="_blank" rel="noopener noreferrer" className="text-[#3D975B] underline">
                        https://support.google.com/accounts/answer/61416?hl=pt-BR
                    </a>
                </li>
                <li>
                    Mozilla Firefox – <a href="https://support.mozilla.org/pt-BR/kb/ativar-desativar-cookies" target="_blank" rel="noopener noreferrer" className="text-[#3D975B] underline">
                        https://support.mozilla.org/pt-BR/kb/ativar-desativar-cookies
                    </a>
                </li>
                <li>
                    Microsoft Edge – <a href="https://support.microsoft.com/pt-br/microsoft-edge" target="_blank" rel="noopener noreferrer" className="text-[#3D975B] underline">
                        https://support.microsoft.com/pt-br/microsoft-edge
                    </a>
                </li>
                <li>
                    Safari (Apple) – <a href="https://support.apple.com/pt-br/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-[#3D975B] underline">
                        https://support.apple.com/pt-br/guide/safari/sfri11471/mac
                    </a>
                </li>
            </ul>
            <p className="mb-4">
                Lembre-se de que desabilitar todos os cookies pode impactar negativamente sua experiência de navegação na Lunme.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-3 text-[#3D975B]">7. Compartilhamento com terceiros</h2>
            <p className="leading-relaxed mb-4">
                Atualmente, a Lunme não compartilha dados de cookies com terceiros, nem utiliza serviços externos de rastreamento como
                Google Analytics ou Facebook Pixel. Toda coleta de dados é realizada de forma interna, exclusivamente para fins operacionais e
                de melhoria da experiência do usuário.
                Caso futuramente integremos algum serviço de terceiros, essa política será atualizada e o consentimento específico será solicitado.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-3 text-[#3D975B]">8. Alterações nesta política</h2>
            <p className="leading-relaxed mb-4">
                A Lunme reserva-se o direito de modificar esta Política de Cookies sempre que necessário. As alterações entram em vigor
                imediatamente após sua publicação. Recomendamos que os usuários consultem este documento regularmente.
                <br />Última atualização: 11 de junho de 2025
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-3 text-[#3D975B]">9. Contato</h2>
            <p className="leading-relaxed mb-6">
                Caso tenha dúvidas sobre esta política, entre em contato conosco:
                <br />E-mail: <a href="mailto:admin@Lunme.com.br" className="text-[#3D975B]">admin@Lunme.com.br</a>
                <br />Telefone: (27) 98899-1663
            </p>

            <div className="mt-10 text-center">
                <button
                    onClick={handleDownload}
                    className="bg-[#3D975B] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#337f4d] transition-colors"
                >
                    Baixar Política de Cookies
                </button>
            </div>
        </div>
        </>


    );
};

export default PoliticaCookies;