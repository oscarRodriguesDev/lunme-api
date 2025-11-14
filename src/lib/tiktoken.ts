// lib/tiktoken.ts — Roda apenas no server!
import { encoding_for_model } from "@dqbd/tiktoken";

export function contarTokens(texto: string): number {
  const enc = encoding_for_model("gpt-4");
  const tokens = enc.encode(texto);
  const total = tokens.length;
  enc.free(); // Libera memória
  return total;
}
