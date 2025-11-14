// Remove os campos automáticos do banco que não fazem sentido no formulário
export interface PrePaciente {
  id:string;
  nome?: string;
  email?: string;
  endereco?: string;
  nascimento?: string;
  idade?: string;
  cpf?: string;
  telefone?: string;
  emergencia?: string;
  generoOrientacao?: string;
  estadoCivil?: string;
  origemConhecimento?: string;
  preocupacao?: string;
  motivoAtendimento?: string;
  experienciaAnterior?: string;
  saudeFisica?: string;
  detalhesSaudeFisica?: string;
  medicamentos?: string;
  diagnosticoMental?: string;
  historicoFamiliar?: string;
  rotina?: string;
  sono?: string;
  atividadeFisica?: string;
  estresse?: string;
  convivencia?: string;
  relacaoFamiliar?: string;
  apoioSocial?: string;
  nivelFelicidade?: string;
  ansiedade?: string;
  pensamentosNegativos?: string;
  objetivoTerapia?: string;
  temasDelicados?: string;
  estiloAtendimento?: string;
  observacoesFinais?: string;
  autorizacaoLGPD?: boolean;
  psicologoId?: string; // Se quiser receber no formulário, pode deixar opcional
  habilitado?: boolean;
  motivacao?:string;
}
