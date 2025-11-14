const PrivacyPolicy = () => {
    return (
      <div className="space-y-4 p-6 text-sm text-gray-800 overflow-auto">
        <h2 className="text-xl font-bold">🔐 Política de Privacidade</h2>
  
        <section>
          <h3 className="font-semibold text-lg">1. Coleta de Dados</h3>
          <p>
            Coletamos dados cadastrais, técnicos e, com consentimento, dados clínicos para funcionamento da plataforma. Os dados incluem, mas não se limitam a:
          </p>
          <ul className="list-disc list-inside ml-4">
            <li>Nome, CPF, RG, e-mail, telefone.</li>
            <li>CRP, especialidade, agenda (psicólogos).</li>
            <li>Histórico de atendimentos, motivo da consulta (pacientes).</li>
            <li>IP, data e hora do consentimento.</li>
          </ul>
        </section>
  
        <section>
          <h3 className="font-semibold text-lg">2. Uso dos Dados</h3>
          <p>
            Os dados são utilizados para:
          </p>
          <ul className="list-disc list-inside ml-4">
            <li>Agendamento e realização de sessões.</li>
            <li>Geração de relatórios e análises.</li>
            <li>Comunicação entre usuários.</li>
            <li>Fins de auditoria, segurança e conformidade legal.</li>
          </ul>
        </section>
  
        <section>
          <h3 className="font-semibold text-lg">3. Compartilhamento</h3>
          <p>
            A plataforma <strong>não compartilha dados pessoais com terceiros</strong>, exceto:
          </p>
          <ul className="list-disc list-inside ml-4">
            <li>Quando exigido por lei ou autoridade competente.</li>
            <li>Com consentimento expresso e informado do titular.</li>
            <li>Para operação técnica essencial e segura da plataforma (ex: servidores, backups).</li>
          </ul>
        </section>
  
        <section>
          <h3 className="font-semibold text-lg text-red-600">4. Compartilhamento Indevido por Psicólogos</h3>
          <p>
            A <strong>plataforma se exime de qualquer responsabilidade</strong> por eventuais compartilhamentos indevidos ou não autorizados de dados realizados por psicólogos, especialmente se feitos fora dos meios fornecidos pela plataforma.
          </p>
          <p>Adotamos as seguintes medidas para prevenir esse tipo de conduta:</p>
          <ul className="list-disc list-inside ml-4">
            <li>Bloqueio de cópia e exportação dos conteúdos sensíveis dos relatórios e transcrições.</li>
            <li>Ausência de botões ou recursos que facilitem o compartilhamento direto de dados de pacientes.</li>
            <li>Registros de logs e auditorias de acesso aos documentos sensíveis.</li>
            <li>Orientações éticas e cláusulas contratuais para uso correto da informação.</li>
          </ul>
          <p>
            O compartilhamento de dados obtidos por psicólogos deve seguir exclusivamente as diretrizes do Código de Ética Profissional do Psicólogo e da LGPD. Qualquer conduta fora desses parâmetros será de responsabilidade exclusiva do profissional, e poderá levar à suspensão de sua conta na plataforma.
          </p>
        </section>
  
        <section>
          <h3 className="font-semibold text-lg">5. Armazenamento e Segurança</h3>
          <ul className="list-disc list-inside ml-4">
            <li>Criptografia de dados em trânsito e repouso.</li>
            <li>Servidores certificados e monitorados.</li>
            <li>Acesso restrito a profissionais autorizados.</li>
            <li>Retenção mínima e controlada dos dados.</li>
          </ul>
        </section>
  
        <section>
          <h3 className="font-semibold text-lg">6. Direitos do Usuário</h3>
          <p>Você pode a qualquer momento:</p>
          <ul className="list-disc list-inside ml-4">
            <li>Acessar, corrigir ou atualizar seus dados.</li>
            <li>Solicitar exclusão de informações pessoais.</li>
            <li>Revogar consentimentos concedidos.</li>
          </ul>
        </section>
      </div>
    );
  };
  
  export default PrivacyPolicy;
  