export interface TranscriptionData {
  titleDoc: string;
    IdentificacaoPaciente: {
      Nome: string;
      Idade: number;
      DataTriagem: string;
      TipoTriagem: string;
      NomeResponsavel: string;
      ProfissionalResponsavel: string;
    };
    IntroducaoAnamnese: string;
    ResumoAnamnese: Record<string, string>;
    EscutaAtivaEmpatica: Record<string, string>;
    DemandasPaciente: string[];
    InformacoesAdicionais: string;
    HipotesesDiagnosticas: string[];
    TestesPsicologicosIndicados: string;
    PlanoTerapeuticoInicial: string;
    PlanoInvestimento: {
      Valor: string;
      TempoSessao: string;
      FormaPagamento: string;
      FrequenciaSugerida: string;
      PacoteAcompanhamento: string;
    }[];
    ConsideracoesFinais: string;
    MensagensImportantes: string[];
    ProfissionalResponsavel: {
      Nome: string;
      CRP: string;
    };
    InsightsGPT: string;
  }