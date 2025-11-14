interface CreditCardData {
    cardNumber: string;
    holderName: string;
    expMonth: string;
    expYear: string;
    cvv: string;
    name:string;
    email:string;
    cpf:string;
    rua:string;
    numero:string;
    bairro:string;
    cidade:string;
    estado:string;
    cep:string;
    ddi:string;
    ddd:string;
    telefone:string;
    
  };
  
  interface Produto{
      codigo:string;
      titulo: string;
      descricao: string;
      preco: number 
      quantidade: number,
  
  }
  

  export type { Produto, CreditCardData};