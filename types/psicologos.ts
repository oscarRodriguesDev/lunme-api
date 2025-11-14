/**
 * Representa um psicólogo cadastrado na plataforma.
 *
 * @interface Psicologo
 */
interface Psicologo {
    /**
     * Identificador único do psicólogo.
     * @type {string}
     */
    id: string;
  
    /**
     * Primeiro do psicólogo.
     * @type {string}
     */
    nome: string;
  
    /**
     * Segundo  do psicólogo.
     * @type {string}
     */
    lastname: string;
  
    /**
     * Endereço de e-mail do psicólogo.
     * @type {string}
     */
    email: string;
  
    /**
     * Número de registro profissional (ex: registro do conselho).
     * Opcional.
     * @type {string | undefined}
     */
    registro?: string;
  
    /**
     * Número do Cadastro de Pessoa Física (CPF).
     * Opcional.
     * @type {string | undefined}
     */
    cpf?: string;
  
    /**
     * Número do Conselho Regional de Psicologia (CRP).
     * Opcional.
     * @type {string | undefined}
     */
    crp?: string;
  
    /**
     * Número de celular do psicólogo.
     * Opcional.
     * @type {string | undefined}
     */
    celular?: string;
  
    /**
     * Número de telefone fixo do psicólogo.
     * Opcional.
     * @type {string | undefined}
     */
    telefone?: string;
  
    /**
     * Idade do psicólogo.
     * Opcional.
     * @type {string | undefined}
     */
    idade?: string;
  
    /**
     * Cidade onde o psicólogo está localizado.
     * Opcional.
     * @type {string | undefined}
     */
    cidade?: string;
  
    /**
     * Estado (UF) onde o psicólogo está localizado.
     * Opcional.
     * @type {string | undefined}
     */
    uf?: string;
  
    /**
     * URL da foto de perfil do psicólogo.
     * Opcional.
     * @type {string | undefined}
     */
    photoprofile?: string;
  
    /**
     * URL do banner do psicólogo.
     * Opcional.
     * @type {string | undefined}
     */
    banner?: string;
  
    /**
     * Descrição ou biografia do psicólogo.
     * Opcional.
     * @type {string | undefined}
     */
    description?: string;
  
    /**
     * Senha do psicólogo (criptografada).
     * Opcional.
     * @type {string | undefined}
     */
    password?: string;
  
    /**
     * Indica se é o primeiro acesso do psicólogo.
     * Opcional.
     * @type {boolean | undefined}
     */
    first_acess?: boolean;


    /**
     * marca a pontuação do psicologo.
     * @type {[] | undefined}
     */
    pontuacao?: number;




  
}
    

/**
 * Reexporta a interface Psicologo.
 */
export type { Psicologo };
