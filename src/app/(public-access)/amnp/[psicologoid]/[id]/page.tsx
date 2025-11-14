'use client'
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ValidadorLinkAnamnese from "@/app/(public-access)/amnp/components/avalielink/avaliador";
import { showErrorMessage, showSuccessMessage } from "@/app/util/messages";
import { PrePaciente } from "../../../../../../types/prePacientes";


export default function FormularioAnamnese() {
  const params = useParams();
  const psicologoid = params.psicologoid as string;
  const id = params.id as string;
  const [origemOutro, setOrigemOutro] = useState("");




  const [form, setForm] = useState<PrePaciente>({
    id,
    nome: "",
    email: "",
    idade: "",
    cpf: "",
    telefone: "",
    origemConhecimento: "",
    preocupacao: "",
    motivoAtendimento: "",
    experienciaAnterior: "",
    saudeFisica: "",
    detalhesSaudeFisica: "",
    medicamentos: "",
    diagnosticoMental: "",
    historicoFamiliar: "",
    rotina: "",
    sono: "",
    atividadeFisica: "",
    estresse: "",
    convivencia: "",
    relacaoFamiliar: "",
    apoioSocial: "",
    nivelFelicidade: "",
    ansiedade: "",
    pensamentosNegativos: "",
    objetivoTerapia: "",
    temasDelicados: "",
    estiloAtendimento: "",
    observacoesFinais: "",
    autorizacaoLGPD: false,
    psicologoId: psicologoid,
    habilitado: false
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const router = useRouter();
  const [autorizado, setAutorizado] = useState<boolean | null>(null);

  //verifica se o link ainda esta valido
  useEffect(() => {
    async function verificarAcesso() {
      const res = await fetch(`/api/amnp/${id}`);
      if (res.ok) {
        setAutorizado(true);
      } else {
        setAutorizado(false);
        showErrorMessage("Link expirado ou acesso não autorizado.");
        router.push("/link-error"); // ou uma página de erro
      }
    }

    verificarAcesso();
  }, [id, router]);

  const handleOrigemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const valor = e.target.value;
    setForm((prev: any) => ({
      ...prev,
      origemConhecimento: valor,
    }));
    if (valor !== "outro") {
      setOrigemOutro(""); // limpa o campo caso mude de "outro" para outro valor
    }
  };

  const handleOrigemOutroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setOrigemOutro(valor);
    setForm((prev: any) => ({
      ...prev,
      origemConhecimento: `Outro: ${valor}`,
    }));
  };





  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validação básica campos obrigatórios
    const {
      id,
      nome,
      email,
      nascimento,
      idade,
      cpf,
      preocupacao,
      motivoAtendimento,
      psicologoId: psicologoid,
    } = form;
    setLoading(true);

    try {
      const response = await fetch("/api/analize_pcte", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.error || "Erro ao enviar o formulário.");
      } else {
        setSuccessMsg("Formulário enviado com sucesso!");
        setForm({
          id:id,
          nome: "",
          email: "",
          idade: "",
          cpf: "",
          telefone: "",
          origemConhecimento: "",
          preocupacao: "",
          motivoAtendimento: "",
          experienciaAnterior: "",
          saudeFisica: "",
          detalhesSaudeFisica: "",
          medicamentos: "",
          diagnosticoMental: "",
          historicoFamiliar: "",
          rotina: "",
          sono: "",
          atividadeFisica: "",
          estresse: "",
          convivencia: "",
          relacaoFamiliar: "",
          apoioSocial: "",
          nivelFelicidade: "",
          ansiedade: "",
          pensamentosNegativos: "",
          objetivoTerapia: "",
          temasDelicados: "",
          estiloAtendimento: "",
          observacoesFinais: "",
          autorizacaoLGPD: false,
          psicologoId: psicologoid
        });
        showSuccessMessage('enviado');
      }
    } catch (error) {
      setErrorMsg("Erro de conexão. Tente novamente.");
      showErrorMessage('Não enviado');
    } finally {
      setLoading(false);
    }
  }

  return (

    <>
      <ValidadorLinkAnamnese
        token={String(id)}
      />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Formulário de Anamnese</h1>
        <form className="space-y-8" onSubmit={handleSubmit}>

          {/* Sessão dados pessoais */}
          <fieldset className="border border-gray-200 rounded-xl p-6 shadow-sm">
            <legend className="text-lg font-semibold text-gray-800 mb-4">Dados Obrigatórios</legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome */}
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome completo
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  required
                  value={form.nome}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              {/* Idade */}
              <div>
                <label htmlFor="idade" className="block text-sm font-medium text-gray-700 mb-1">
                  Idade
                </label>
                <input
                  type="number"
                  id="idade"
                  name="idade"
                  required
                  value={form.idade}
                  onChange={ handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              {/* CPF */}
              <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
                  CPF
                </label>
                <input
                  type="text"
                  id="cpf"
                  name="cpf"
                  required
                  value={form.cpf}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              {/* Telefone */}
              <div>
                <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="text"
                  id="telefone"
                  name="telefone"
                  required
                  value={form.telefone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              {/* Origem do conhecimento */}
              <div>
                <label htmlFor="origemConhecimento" className="block text-sm font-medium text-gray-700 mb-1">
                  Como chegou até nós?
                </label>
                <select
                  name="origemConhecimento"
                  id="origemConhecimento"
                  value={form.origemConhecimento}
                  onChange={handleOrigemChange}
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  <option value="">Selecione uma opção</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="google">Google</option>
                  <option value="facebook">Facebook</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="instagram">Instagram</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              {/* Campo extra se origem = outro */}
              {form.origemConhecimento === "outro" && (
                <div className="md:col-span-2">
                  <label htmlFor="origemOutro" className="block text-sm font-medium text-gray-700 mb-1">
                    Por favor, especifique:
                  </label>
                  <input
                    type="text"
                    id="origemOutro"
                    name="origemOutro"
                    value={origemOutro}
                    onChange={handleOrigemOutroChange}
                    placeholder="Ex: indicação de amigo, panfleto, etc."
                    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              )}
            </div>
          </fieldset>


          {/* SEssão motivos */}
          <fieldset className="border border-gray-200 rounded-xl p-6 shadow-sm">
            <legend className="text-lg font-semibold text-gray-800 mb-4">Motivo do Atendimento</legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="motivoAtendimento" className="block text-sm font-medium text-gray-700 mb-1">
                  Descreva em poucas palavras o motivo pelo qual está procurando atendimento
                </label>
                <input
                  type="text"
                  name="motivoAtendimento"
                  id="motivoAtendimento"
                  value={form.motivoAtendimento}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-3"
                  required
                />
              </div>

              <div>
                <label htmlFor="preocupacao" className="block text-sm font-medium text-gray-700 mb-1">
                  Qual é sua principal preocupação atualmente?
                </label>
                <input
                  type="text"
                  name="preocupacao"
                  id="preocupacao"
                  value={form.preocupacao}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-3"
                  required
                />
              </div>

              <div>
                <label htmlFor="motivacao" className="block text-sm font-medium text-gray-700 mb-1">
                  O que motivou você a buscar atendimento neste momento?
                </label>
                <input
                  type="text"
                  name="motivacao"
                  id="motivacao"
                  value={(form as any)["motivacao"] || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-3"
                />
              </div>

              <div>
                <label htmlFor="experienciaAnterior" className="block text-sm font-medium text-gray-700 mb-1">
                  Já teve experiências anteriores com terapia ou suporte psicológico?
                </label>
                <input
                  type="text"
                  name="experienciaAnterior"
                  id="experienciaAnterior"
                  value={form.experienciaAnterior}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-3"
                />
              </div>
            </div>
          </fieldset>

          {/* Sessão Histórico de Saúde Física e Mental */}
          <fieldset className="border border-gray-200 rounded-xl p-6 shadow-sm">
            <legend className="text-lg font-semibold text-gray-800 mb-4">Histórico de Saúde Física e Mental</legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Condição de saúde física ou crônica (radio + condicional) */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Você possui alguma condição de saúde física ou crônica?
                </label>

                <div className="flex items-center gap-6 mb-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="saudeFisica"
                      value="sim"
                      checked={form.saudeFisica === "sim"}
                      onChange={handleInputChange}
                      className="text-green-600"
                    />
                    Sim
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="saudeFisica"
                      value="nao"
                      checked={form.saudeFisica === "nao"}
                      onChange={handleInputChange}
                      className="text-green-600"
                    />
                    Não
                  </label>
                </div>

                {form.saudeFisica === "sim" && (
                  <div>
                    <label htmlFor="detalhesSaudeFisica" className="block text-sm font-medium text-gray-700 mb-1">
                      Descreva a condição:
                    </label>
                    <input
                      type="text"
                      id="detalhesSaudeFisica"
                      name="detalhesSaudeFisica"
                      value={form.detalhesSaudeFisica}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                      placeholder="Ex: asma, hipertensão, diabetes..."
                    />
                  </div>
                )}
              </div>

              {/* Medicamentos */}
              <div>
                <label htmlFor="medicamentos" className="block text-sm font-medium text-gray-700 mb-1">
                  Está em uso de medicamentos? Se sim, quais?
                </label>
                <input
                  type="text"
                  id="medicamentos"
                  name="medicamentos"
                  value={form.medicamentos}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              {/* Diagnósticos de saúde mental */}
              <div>
                <label htmlFor="diagnosticoMental" className="block text-sm font-medium text-gray-700 mb-1">
                  Já recebeu diagnóstico de alguma condição de saúde mental? Se sim, quais?
                </label>
                <input
                  type="text"
                  id="diagnosticoMental"
                  name="diagnosticoMental"
                  value={form.diagnosticoMental}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="historicoFamiliar" className="block text-sm font-medium text-gray-700 mb-1">
                  Alguém na sua família apresenta histórico de transtornos mentais? Se sim, quais?
                </label>
                <input
                  type="text"
                  id="historicoFamiliar"
                  name="historicoFamiliar"
                  value={form.historicoFamiliar}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
            </div>
          </fieldset>

          {/* sessão  Rotina e Hábitos */}
          <fieldset className="border border-gray-200 rounded-xl p-6 shadow-sm">
            <legend className="text-lg font-semibold text-gray-800 mb-4">Rotina e Hábitos</legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rotina diária */}
              <div className="md:col-span-2">
                <label htmlFor="rotina" className="block text-sm font-medium text-gray-700 mb-1">
                  Como é a sua rotina diária? (ex.: trabalho, estudo, lazer)
                </label>
                <textarea
                  id="rotina"
                  name="rotina"
                  value={form.rotina}
                  onChange={handleTextareaChange}
                  className="w-full border border-gray-300 rounded-md p-3 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              {/* Qualidade do sono */}
              <div>
                <label htmlFor="sono" className="block text-sm font-medium text-gray-700 mb-1">
                  Como você avalia a sua qualidade de sono?
                </label>
                <input
                  type="text"
                  id="sono"
                  name="sono"
                  value={form.sono}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              {/* Atividades físicas */}
              <div>
                <label htmlFor="atividadeFisica" className="block text-sm font-medium text-gray-700 mb-1">
                  Você pratica atividades físicas? Se sim, quais? Com qual frequência?
                </label>
                <input
                  type="text"
                  id="atividadeFisica"
                  name="atividadeFisica"
                  value={form.atividadeFisica}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              {/* Estresse */}
              <div className="md:col-span-2">
                <label htmlFor="estresse" className="block text-sm font-medium text-gray-700 mb-1">
                  Como costuma lidar com o estresse no dia a dia?
                </label>
                <input
                  type="text"
                  id="estresse"
                  name="estresse"
                  value={form.estresse}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
            </div>
          </fieldset>


          {/* sessão Contexto Familiar e Relacional*/}
          <fieldset className="border border-gray-200 rounded-xl p-6 shadow-sm">
            <legend className="text-lg font-semibold text-gray-800 mb-4">Contexto Familiar e Relacional</legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Morando com alguém */}
              <div>
                <label htmlFor="convivencia" className="block text-sm font-medium text-gray-700 mb-1">
                  Você mora sozinho(a) ou com alguém?
                </label>
                <input
                  type="text"
                  id="convivencia"
                  name="convivencia"
                  value={form.convivencia}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              {/* Relação com a família */}
              <div>
                <label htmlFor="relacaoFamiliar" className="block text-sm font-medium text-gray-700 mb-1">
                  Como você descreveria a sua relação com a família?
                </label>
                <input
                  type="text"
                  id="relacaoFamiliar"
                  name="relacaoFamiliar"
                  value={form.relacaoFamiliar}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              {/* Apoio social */}
              <div className="md:col-span-2">
                <label htmlFor="apoioSocial" className="block text-sm font-medium text-gray-700 mb-1">
                  Você se sente apoiado(a) pelas pessoas ao seu redor?
                </label>
                <input
                  type="text"
                  id="apoioSocial"
                  name="apoioSocial"
                  value={form.apoioSocial}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
            </div>
          </fieldset>


          {/*sessão Avaliação Inicial de Saúde Mental  */}
          <fieldset className="border border-gray-200 rounded-xl p-6 shadow-sm">
            <legend className="text-lg font-semibold text-gray-800 mb-4">Avaliação Inicial de Saúde Mental</legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nível de felicidade */}
              <div>
                <label htmlFor="nivelFelicidade" className="block text-sm font-medium text-gray-700 mb-1">
                  Como você avalia o seu nível de felicidade em uma escala de 0 a 10?
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  id="nivelFelicidade"
                  name="nivelFelicidade"
                  value={form.nivelFelicidade}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              {/* Frequência de ansiedade */}
              <div>
                <label htmlFor="ansiedade" className="block text-sm font-medium text-gray-700 mb-1">
                  Com que frequência você se sente ansioso(a) ou sobrecarregado(a)?
                </label>
                <input
                  type="text"
                  id="ansiedade"
                  name="ansiedade"
                  value={form.ansiedade}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              {/* Pensamentos negativos */}
              <div className="md:col-span-2">
                <label htmlFor="pensamentosNegativos" className="block text-sm font-medium text-gray-700 mb-1">
                  Você já teve pensamentos de desistir da vida ou autolesão?
                </label>
                <input
                  type="text"
                  id="pensamentosNegativos"
                  name="pensamentosNegativos"
                  value={form.pensamentosNegativos}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
            </div>
          </fieldset>



          {/* sessão Questões Voltadas ao Contexto Terapêutico */}
          <fieldset className="border border-gray-200 rounded-xl p-6 shadow-sm">
            <legend className="text-lg font-semibold text-gray-800 mb-4">Questões Voltadas ao Contexto Terapêutico</legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Objetivo da terapia */}
              <div className="md:col-span-2">
                <label htmlFor="objetivoTerapia" className="block text-sm font-medium text-gray-700 mb-1">
                  Qual é o seu objetivo principal com a terapia?
                </label>
                <input
                  type="text"
                  id="objetivoTerapia"
                  name="objetivoTerapia"
                  value={form.objetivoTerapia}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              {/* Assuntos delicados */}
              <div className="md:col-span-2">
                <label htmlFor="temasDelicados" className="block text-sm font-medium text-gray-700 mb-1">
                  Existem aspectos da sua vida que você não sente à vontade para discutir agora?
                </label>
                <input
                  type="text"
                  id="temasDelicados"
                  name="temasDelicados"
                  value={form.temasDelicados}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              {/* Estilo de atendimento preferido */}
              <div className="md:col-span-2">
                <label htmlFor="estiloAtendimento" className="block text-sm font-medium text-gray-700 mb-1">
                  Como você prefere que o atendimento seja conduzido? (ex.: mais diretivo, exploratório)
                </label>
                <input
                  type="text"
                  id="estiloAtendimento"
                  name="estiloAtendimento"
                  value={form.estiloAtendimento}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              {/* Observações finais */}
              <div className="md:col-span-2">
                <label htmlFor="observacoesFinais" className="block text-sm font-medium text-gray-700 mb-1">
                  Há algo mais que você gostaria de compartilhar ou considerar importante para o seu processo terapêutico?
                </label>
                <textarea
                  id="observacoesFinais"
                  name="observacoesFinais"
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="Ex: traumas, bloqueios, manias, costumes..."
                />
              </div>
            </div>
          </fieldset>


          {/* sessão lgpd */}
          <fieldset className="border border-gray-200 rounded-xl p-6 shadow-sm">
            <legend className="text-lg font-semibold text-gray-800 mb-4">Autorização de uso de dados</legend>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="autorizacaoLGPD"
                name="autorizacaoLGPD"
                checked={form.autorizacaoLGPD}
                onChange={handleInputChange}
                className="mt-1 h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="autorizacaoLGPD" className="text-sm text-gray-700">
                Autorizo o uso dos meus dados pessoais, fornecidos neste formulário, para fins de atendimento psicológico conforme os termos da LGPD.
              </label>
            </div>
          </fieldset>





          <div className="flex justify-center mt-6">
            <input
              type="submit"
              value="Enviar"
              className="bg-[#117E43] text-white font-semibold px-6 py-2 rounded-full shadow-md hover:bg-[#0e6b39] transition"
            />
          </div>




        </form>


      </div>

    </>
  );
}
