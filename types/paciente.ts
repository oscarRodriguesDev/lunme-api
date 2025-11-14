export interface Paciente {
  id?: string; //
  nome?: string; //
  fantasy_name?: string; // não tem
  cpf?: string; //
  idade?: string; //
  sintomas?: string; //t
  telefone?: string; //
  convenio?: string; //não tem
  sexo?: string; //
  cep?: string; //não tem 
  cidade?: string; //não tem 
  bairro?: string; //não tem 
  rua?: string; //não tem 
  numero?: string; //não tem
  pais?: string; //não tem 
  complemento?: string; //não tem
  estado?: string; //não tem 
  email?: string;  //tem
  rg?: string; //não tem
  psicologoId?: string; //
  result_amnp:[string]; //vem da anamnese cadastro
  resumo_anmp?:string; //gerado pelo gpt a partir da anamnse
  
}
