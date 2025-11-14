/**
 * Representa um agendamento de consulta com todas as informações necessárias
 * para exibição, controle e processamento do evento.
 */
export interface Agendamento {
    /** 
     * Identificador único do agendamento (geralmente um UUID).
     */
    id: string;
  
    /** 
     * Identificador do psicólogo responsável pela consulta.
     */
    psicologoId: string;
  
    /** 
     * Nome fantasia da clínica ou profissional (usado para exibição).
     */
    fantasy_name: string;
  
    /** 
     * Nome do paciente ou da pessoa atendida.
     */
    name: string;
  
    /** 
     * Título ou assunto da consulta (pode representar o objetivo ou tema da sessão).
     */
    titulo: string;
  
    /** 
     * Data da consulta no formato ISO (ex: "2025-04-09").
     */
    data: string;
  
    /** 
     * Hora da consulta (ex: "14:00").
     */
    hora: string;
  
    /** 
     * Tipo da consulta (ex: "Presencial", "Online", "Vídeo").
     */
    tipo_consulta: string;
  
    /** 
     * Observações adicionais inseridas pelo profissional ou paciente.
     */
    observacao: string;
  
    /** 
     * Informações sobre a recorrência do agendamento (ex: "Semanal", "Mensal", "Única").
     */
    recorrencia: string;
  
    /** 
     * Código único de identificação ou uso interno (ex: usado para entrar em salas online).
     */
    code: string;
    /** 
     * duração da reunião 
     */
    duracao: string;


  }
  