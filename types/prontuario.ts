
interface Prontuario {
  id: string;
  pacienteId: string;
  queixaPrincipal?: string;
  historico?: string;
  conduta?: string;
  evolucao?: string;
  transcription?: string;
  createdAt: string;
  updatedAt: string;
}

export default Prontuario