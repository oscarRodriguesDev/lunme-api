-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'PSYCHOLOGIST', 'COMMON');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "UserRole" NOT NULL,
    "registro" TEXT,
    "bandeira" TEXT,
    "celular" TEXT,
    "cep" TEXT,
    "cidade" TEXT,
    "cpf" TEXT,
    "credit_card" TEXT,
    "creditos" TEXT,
    "crp" TEXT,
    "cvc" TEXT,
    "fantasy_name" TEXT,
    "idade" TEXT,
    "psicologoid" TEXT,
    "rg" TEXT,
    "rua" TEXT,
    "telefone" TEXT,
    "uf" TEXT,
    "email_confirm" TEXT,
    "cfp" TEXT,
    "banner" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "linkedin" TEXT,
    "photoprofile" TEXT,
    "whatsapp" TEXT,
    "description" TEXT,
    "first_acess" BOOLEAN,
    "lastname" TEXT,
    "pontuacao" INTEGER[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrePsicologo" (
    "cpf" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "rg" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "data_nasc" TEXT NOT NULL,
    "celular" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "crp" TEXT NOT NULL,
    "habilitado" BOOLEAN NOT NULL,
    "id" TEXT NOT NULL,
    "cfp" TEXT NOT NULL,
    "lastname" TEXT,

    CONSTRAINT "PrePsicologo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrePaciente" (
    "id" TEXT NOT NULL,
    "nome" TEXT,
    "email" TEXT,
    "endereco" TEXT,
    "nascimento" TEXT,
    "idade" TEXT,
    "cpf" TEXT,
    "telefone" TEXT,
    "emergencia" TEXT,
    "generoOrientacao" TEXT,
    "estadoCivil" TEXT,
    "origemConhecimento" TEXT,
    "preocupacao" TEXT,
    "motivoAtendimento" TEXT,
    "experienciaAnterior" TEXT,
    "saudeFisica" TEXT,
    "detalhesSaudeFisica" TEXT,
    "medicamentos" TEXT,
    "diagnosticoMental" TEXT,
    "historicoFamiliar" TEXT,
    "rotina" TEXT,
    "sono" TEXT,
    "atividadeFisica" TEXT,
    "estresse" TEXT,
    "convivencia" TEXT,
    "relacaoFamiliar" TEXT,
    "apoioSocial" TEXT,
    "nivelFelicidade" TEXT,
    "ansiedade" TEXT,
    "pensamentosNegativos" TEXT,
    "objetivoTerapia" TEXT,
    "temasDelicados" TEXT,
    "estiloAtendimento" TEXT,
    "observacoesFinais" TEXT,
    "autorizacaoLGPD" BOOLEAN,
    "habilitado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "psicologoId" TEXT,

    CONSTRAINT "PrePaciente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paciente" (
    "id" TEXT NOT NULL,
    "nome" TEXT,
    "cpf" TEXT NOT NULL,
    "idade" TEXT,
    "sintomas" TEXT,
    "telefone" TEXT,
    "convenio" TEXT,
    "fantasy_name" TEXT,
    "bairro" TEXT,
    "cep" TEXT,
    "cidade" TEXT,
    "complemento" TEXT,
    "email" TEXT,
    "estado" TEXT,
    "numero" TEXT,
    "pais" TEXT,
    "rg" TEXT,
    "rua" TEXT,
    "sexo" TEXT,
    "psicologoId" TEXT,
    "resumo_anmp" TEXT,
    "result_amnp" TEXT[],

    CONSTRAINT "Paciente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consulta" (
    "id" TEXT NOT NULL,
    "pacienteId" TEXT,
    "fantasy_name" TEXT,
    "psicologoId" TEXT,
    "data" TEXT,
    "hora" TEXT,
    "tipo_consulta" TEXT,
    "observacao" TEXT,
    "recorrencia" TEXT,
    "titulo" TEXT,
    "name" TEXT,
    "code" TEXT,
    "duracao" TEXT,

    CONSTRAINT "Consulta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consents_Agreements" (
    "ipNumber" TEXT NOT NULL,
    "data_consent" TEXT NOT NULL,
    "hora_consent" TEXT NOT NULL,
    "nome_consent" TEXT NOT NULL,
    "cpf_consent" TEXT NOT NULL,
    "id" TEXT NOT NULL,

    CONSTRAINT "Consents_Agreements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cookies_consent" (
    "ipNumber" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "Hora" TEXT NOT NULL,
    "permissão" BOOLEAN NOT NULL,
    "id" TEXT NOT NULL,

    CONSTRAINT "cookies_consent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avaliacao" (
    "id" TEXT NOT NULL,
    "audio" INTEGER NOT NULL,
    "video" INTEGER NOT NULL,
    "experienciaGeral" INTEGER NOT NULL,
    "avaliacaoProfissional" INTEGER NOT NULL,
    "comentario" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "psicologoId" TEXT NOT NULL,

    CONSTRAINT "Avaliacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcessoAnamneseTemp" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "ip" TEXT,
    "acessado_em" TIMESTAMP(3),
    "psicologoId" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AcessoAnamneseTemp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "model_doc" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "psicologoId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,

    CONSTRAINT "model_doc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "base_cientific" (
    "id" TEXT NOT NULL,
    "psicologoId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "url_capa" TEXT,
    "resumo" TEXT NOT NULL,

    CONSTRAINT "base_cientific_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prontuario" (
    "id" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "queixaPrincipal" TEXT,
    "historico" TEXT,
    "conduta" TEXT,
    "transcription" TEXT,
    "evolucao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prontuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Historico" (
    "id" TEXT NOT NULL,
    "psicologoId" TEXT NOT NULL,
    "userName" TEXT,
    "descricao" TEXT,
    "tipo" TEXT DEFAULT 'geral',
    "timestamp" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Historico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produto" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "valorUn" DOUBLE PRECISION NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Compra" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "Status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "qtdCreditos" TEXT,

    CONSTRAINT "Compra_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PrePsicologo_cpf_key" ON "PrePsicologo"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "PrePsicologo_crp_key" ON "PrePsicologo"("crp");

-- CreateIndex
CREATE UNIQUE INDEX "PrePsicologo_cfp_key" ON "PrePsicologo"("cfp");

-- CreateIndex
CREATE UNIQUE INDEX "Consulta_code_key" ON "Consulta"("code");

-- CreateIndex
CREATE UNIQUE INDEX "AcessoAnamneseTemp_token_key" ON "AcessoAnamneseTemp"("token");

-- CreateIndex
CREATE UNIQUE INDEX "prontuario_pacienteId_key" ON "prontuario"("pacienteId");

-- CreateIndex
CREATE UNIQUE INDEX "produto_codigo_key" ON "produto"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Compra_paymentId_key" ON "Compra"("paymentId");

-- AddForeignKey
ALTER TABLE "prontuario" ADD CONSTRAINT "prontuario_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
