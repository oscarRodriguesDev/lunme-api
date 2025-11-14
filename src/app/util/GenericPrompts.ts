export function generate(
  mensagem: string,
  model: string,
  psicologo: string,
  crp: string,
  paciente: string
): string {
  return `
### 📌 INSTRUÇÕES PARA GERAÇÃO DE DOCUMENTO PSICOLÓGICO

🔹 *Objetivo:*  
Gerar um documento profissional, estruturado e fiel ao modelo indicado, utilizando as informações fornecidas a seguir.

---

## 📍 1. MODELO BASE

Você recebeu um modelo de relatório psicológico. 
Substitua todos os campos entre colchetes pelos dados fornecidos:

- Nome do paciente: ${paciente}
- Psicólogo: ${psicologo}
- CRP: ${crp}


Use a transcrição a seguir para preencher as seções descritivas:

"${mensagem}"

Instruções:
1. Substitua todos os colchetes pelos dados reais.
2. Complete "Descrição da Demanda", "Procedimentos", "Análise" e "Conclusão" com informações coerentes extraídas da transcrição.
3. Adicione uma seção de Observações Complementares e Fontes utilizadas, se aplicável.
4. Mantenha o formato, títulos e espaçamento do modelo original.
5. Retorne apenas o documento final completo, pronto para uso.


🧾 **Modelo de Documento (extraído da base de conhecimento):**  
${model}

---

## 📍 2. DADOS FIXOS A SEREM INSERIDOS AUTOMATICAMENTE

- 👤 **Nome do Paciente:** ${paciente}
- 🧠 **Psicólogo Responsável:** ${psicologo}
- 🪪 **CRP:** ${crp}
- 📅 **Fonte de conteúdo:** Transcrição da sessão abaixo

Esses dados devem aparecer nos campos correspondentes do modelo, **sem alterações, variações de nome ou reinterpretações**.  
Se o modelo não tiver campos explícitos para esses dados, **adicione-os na seção de identificação**.

---

## 📍 3. CONTEÚDO PRINCIPAL

Com base na transcrição da sessão a seguir, preencha integralmente o modelo acima:

🗣️ **Transcrição da Sessão:**  
"""  
${mensagem}  
"""

---

## 📍 4. DIRETRIZES DE FORMATAÇÃO E CONDUTA

- Mantenha a **estrutura original** do modelo, incluindo títulos, subtítulos e divisões de seções.  
- Preencha cada campo de acordo com a transcrição, e insira os dados fixos onde couber.  
- Caso alguma informação não esteja presente, escreva: **“Nada consta na consulta.”**  
- Utilize terminologia técnica conforme o **DSM-5** ou **CID-11**, se pertinente.  
- Ao final, adicione (se aplicável) uma seção de **“Observações Complementares”**.  
- Finalize com uma **nota ética** de responsabilidade profissional e sigilo.  
- Formate o texto de modo claro, com ênfase e espaçamento adequados para leitura clínica.

---

## 📍 5. FINALIZAÇÃO

Retorne **apenas o documento final completo**, pronto para uso, sem explicações adicionais.

⚠️ **Reforce:** Todos os campos de identificação devem conter:
- Nome do paciente: *${paciente}*  
- Psicólogo responsável: *${psicologo}*  
- CRP: *${crp}*  

`.trim();
}
