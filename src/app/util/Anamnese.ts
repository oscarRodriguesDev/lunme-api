


const model = `Anamnese Psicológica:

  Titulo do documento: Anamnese Psicológica
  nome: **nome do paciente**
  idade: **idade do paciente**
  email: **email do paciente**
  telefone: **telefone do paciente**

  **respostas com valor clinico para o psicologo**
  ''' faça um resumo descritivo do paciente e de tudo que pode auxiliar o psicologo a decidir o melhor 
  tratamento para o psicologo, ignore respostas nulas e respostas 'sim', 'não' ou 'talvez' '''
  `







export function generateAnamnese(mensagem: string): string {
  return `
  instructions: ##  instruçoes dentro de colchetes[] devem servir de instruções para o GPT e não devem ser replicadas no texto
Você receberá um conjunto de respostas do(a) paciente no formato livre, representado pela variável abaixo:

📨 Respostas do paciente:  
${mensagem}

📄 [Modelo de estrutura esperada] 
${model}

[🟡 **OBJETIVO:**  
Gerar uma descrição clara, coesa e estruturada, preenchendo os campos do modelo conforme as informações
 disponíveis nas respostas do paciente.]

[⚠️ **INSTRUÇÕES IMPORTANTES:**  
- ❌ *NÃO invente informações ou preencha com suposições*.  
- ⬜ Se algum campo do modelo não puder ser preenchido com base nas respostas, mantenha-o **em branco**.  
- ❓ Se uma resposta for confusa ou vaga, ignore-a.  
- ✅ *Entretanto*, se a totalidade do texto acima (${mensagem}) permitir compreender o significado, você pode preencher o campo com base nesse entendimento.  
- ✍️ Use uma linguagem **clínica, objetiva e clara**, sem floreios, julgamentos ou interpretações emocionais.]

[📝 **Documento a ser gerado:**  
📌 *Anamnese Psicológica*  
Descrição estruturada da história e estado emocional do paciente, incluindo aspectos psicológicos, sociais, médicos e relacionais, conforme informações obtidas na entrevista inicial.

🔒 Lembre-se: sua prioridade é a **fidelidade às respostas do paciente** e o **respeito ao modelo fornecido**.
]`;
}
