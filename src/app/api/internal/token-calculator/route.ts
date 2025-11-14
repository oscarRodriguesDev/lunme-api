import { NextResponse } from "next/server";
import { encoding_for_model } from "tiktoken";

type ModelPrices = {
  input: number;  // preço por 1k tokens (entrada)
  output: number; // preço por 1k tokens (saída)
};

const prices: Record<string, ModelPrices> = {
  // --- GPT-3.5 ---
  "gpt-3.5-turbo": { input: 0.00050, output: 0.00150 },

  // --- GPT-4o Family ---
  "gpt-4o-mini": { input: 0.00015, output: 0.00060 },
  "gpt-4o": { input: 0.00250, output: 0.01000 },

  // --- GPT-4 Family ---
  "gpt-4": { input: 0.03000, output: 0.06000 },
  "gpt-4-turbo": { input: 0.01000, output: 0.03000 },

  // --- GPT-4.5 (Orion) ---
  "gpt-4.5": { input: 0.07500, output: 0.15000 },
};

export async function POST(req: Request) {
  try {
    const { inputText, outputText, model } = await req.json();

    if (!inputText || !outputText || !model) {
      return NextResponse.json(
        { error: "inputText, outputText e model são obrigatórios" },
        { status: 400 }
      );
    }

    if (!prices[model]) {
      return NextResponse.json(
        { error: "Modelo não suportado" },
        { status: 400 }
      );
    }

    // Criar codificador para o modelo
    const encoder = encoding_for_model(model);

    // Contar tokens
    const promptTokens = encoder.encode(inputText).length;
    const completionTokens = encoder.encode(outputText).length;

    // Calcular custo
    const cost =
      (promptTokens / 1000) * prices[model].input +
      (completionTokens / 1000) * prices[model].output;

    return NextResponse.json({
      model,
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
      costUSD: cost,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
