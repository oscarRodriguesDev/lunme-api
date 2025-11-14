/**
 * Representa um endereço no sistema.
 */
export interface Endereco {
    /**
     * Código de Endereçamento Postal (CEP) do local.
     * Exemplo: "01001-000"
     */
    cep: string; 

    /**
     * Logradouro do endereço, como o nome da rua, avenida ou praça.
     * Exemplo: "Praça da Sé"
     */
    logradouro: string;

    /**
     * Bairro do endereço.
     * Exemplo: "Sé"
     */
    bairro: string; 

    /**
     * Localidade do endereço, geralmente a cidade.
     * Exemplo: "São Paulo"
     */
    localidade: string; 

    /**
     * Unidade da Federação (UF) do endereço, ou seja, o estado.
     * Exemplo: "SP"
     */
    uf: string;

    /**
     * Nome do estado completo.
     * Exemplo: "São Paulo"
     */
    estado: string; 
}
