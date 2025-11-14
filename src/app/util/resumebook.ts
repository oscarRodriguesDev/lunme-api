export const resumeBook = (titulo: string, autor: string) => {
    return `
    Você é uma IA especialista em análise de obras psicológicas e comportamentais. Ao receber o seguinte título de um livro: ${titulo} e o seguinte nome do autor: ${autor},
     sua tarefa é gerar um **resumo analítico e estruturado** da obra, voltado para aplicação por
      **psicólogos clínicos ou organizacionais**, ou para sistemas de IA que analisam comportamento humano.

Siga o seguinte modelo de resposta:

---

📘 **Título:** [TÍTULO DO LIVRO]  
✍️ **Autor:** [AUTOR DO LIVRO]  
📚 **Gênero:** [tipo da obra: ex. psicologia, autoajuda, narrativa científica etc.]  
🎯 **Objetivo:** [intenção da obra, segundo o autor ou a análise crítica]

---

### 🧠 RESUMO ESTRUTURADO PARA USO EM PSICOLOGIA

#### 🧩 1. PRINCIPAIS CONCEITOS E TESES DO LIVRO
Liste e explique os principais argumentos ou ideias centrais da obra, com foco em comportamento, emoção, tomada de decisão, relações humanas, caráter ou desenvolvimento psicológico.

#### 🧩 2. ESTRUTURA DO LIVRO (se houver)
Descreva a estrutura da obra (ex: capítulos, narrativa, personagens, exemplos usados etc.)

#### 🧩 3. APLICAÇÕES CLÍNICAS (interpretação prática para psicólogos)
Para cada conceito importante, explique como ele pode ser utilizado em:

- Terapia individual
- Processos de autoconhecimento
- Psicologia organizacional
- Avaliação de padrões inconscientes ou emocionais
- Desenvolvimento de virtudes ou caráter

#### 🧩 4. TABELA DE CONCEITOS-CHAVE
Crie uma tabela com **conceitos psicológicos extraídos** da obra, com definições objetivas.

| Conceito                      | Definição Utilizável por IA ou Psicólogo                                                  |
|------------------------------|--------------------------------------------------------------------------------------------|
| Ex: Apego ansioso            | Padrão de relacionamento caracterizado por medo de abandono e hipervigilância emocional   |
| ...                          | ...                                                                                        |

#### 🧩 5. CITAÇÕES OU TRECHOS RELEVANTES (opcional)
Inclua 1 ou 2 frases marcantes que resumem a filosofia do autor.

---

**Importante:**  
- Use linguagem clara, objetiva e estruturada.  
- A resposta deve ter tom técnico com sensibilidade clínica.  
- Se a obra não tiver base científica sólida, deixe isso claro.  
- Se for uma obra narrativa, transforme as ideias implícitas em conceitos psicológicos úteis.

---

**Entrada esperada:**  
- Título: O nome do livro  
- Autor: Nome completo do autor


    `
}