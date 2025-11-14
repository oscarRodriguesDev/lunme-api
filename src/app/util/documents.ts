
const modelDC= `DC - Declaração
DECLARAÇÃO
 Declaro, para os devidos fins, que [Nome completo ou nome social do(a) paciente] compareceu
 às sessões de acompanhamento psicológico realizadas em [local], nos dias [xx/xx/xxxx] e
 [xx/xx/xxxx], com duração média de [tempo] cada.
 Esta declaração tem como finalidade [descrever brevemente o motivo do documento].
 [Local], [data]
 ____________________________________
 [Nome completo da(o) psicóloga(o)]
 CRP [número]
`

 const modelPP = `
 PARECER PSICOLÓGICO
 Identificação:
 Pessoa/Instituição objeto do parecer: [Nome completo ou nome social]
 Solicitante: [Nome e instituição]
 Finalidade: [Motivo da solicitação]
 Responsável: [Nome da(o) psicóloga(o)], CRP [número], [titulação]
 Descrição da Demanda:
 [Apresentar o contexto e o questionamento que motivou o parecer.]
 Análise:
 [Analisar a questão com base em fundamentos teóricos, éticos e técnicos da Psicologia.]
 Conclusão:
 [Apresentar posicionamento técnico sobre o tema questionado.]
 [Local], [data]
 ____________________________________
 [Nome completo da(o) psicóloga(o)]
 CRP [número]
 `

const modelLP= ` LP - LAUDO PSICOLÓGICO
 Nome: [Nome completo ou nome social]
 Solicitante: [Instituição / paciente / órgão]
 Finalidade: [Descrever o motivo do pedido]
 Responsável: [Nome da(o) psicóloga(o)], CRP [número]
 Descrição da Demanda:
 [Descrever o contexto e motivação da avaliação.]
 Procedimentos:
 [Informar métodos, instrumentos psicológicos e bases teóricas utilizadas.]
 Análise:
 [Apresentar a análise técnica, baseada em dados, resultados e observações.]
 Conclusão:
 [Indicar diagnóstico, hipótese diagnóstica, encaminhamentos ou recomendações.]
 Referências:
 [Listar as fontes teóricas e manuais técnicos utilizados.]
 [Local], [data]
 ____________________________________
 [Nome completo da(o) psicóloga(o)]
 CRP [número]
`
const modelRM= ` RM - RELATÓRIO MULTIPROFISSIONAL
 Identificação:
 Pessoa atendida: [Nome completo ou nome social]
 Solicitante: [Instituição / equipe / paciente]
 Finalidade: [Descrever o motivo do documento]
 Equipe responsável:- [Nome da(o) psicóloga(o)] – CRP [número]- [Demais profissionais com registro e função]
 Descrição da Demanda:
 [Contextualização e motivo da atuação multiprofissional.]
 Procedimentos:
 [Descrever intervenções realizadas por cada profissional.]
 Análise:
 [Apresentar análises separadas de cada área envolvida.]
 Conclusão:
 [Encaminhamentos, orientações e observações conjuntas.]
 [Local], [data]
 ____________________________________
 Assinaturas dos profissionais e registros de classe
`

//relatorio profissional
 const modelRP =`
RELATÓRIO PSICOLÓGICO
Identificação:
Nome: [Nome completo ou nome social]
Solicitante: [Instituição / profissional / próprio paciente]
Finalidade: [Descrever o motivo do pedido]
Profissional responsável: [Nome, CRP]
Descrição da Demanda:
[Descrever o motivo do atendimento e contexto da solicitação.]
Procedimentos:
[Informar métodos, técnicas e referenciais teóricos utilizados.]
Análise:
[Apresentar análise técnica e teórica dos dados observados.]
Conclusão:
[Descrever as conclusões e, se aplicável, encaminhamentos ou recomendações.]
[Local], [data]
____________________________________
[Nome completo da(o) psicóloga(o)]
CRP [número]
 `

 const modelAP = `
 ATESTADO PSICOLÓGICO
 Atesto, para os devidos fins, que [Nome completo ou nome social do(a) paciente], após
 processo de avaliação psicológica realizado no período de [datas], apresenta [descrição das
 condições psicológicas pertinentes à solicitação].
 Finalidade: [justificar aptidão, afastamento, impedimento, ou outra solicitação].
 [Local], [data]
 ____________________________________
 [Nome completo da(o) psicóloga(o)]
 CRP [número]
 `

export {modelDC,modelLP,modelPP,modelRM, modelRP, modelAP}
