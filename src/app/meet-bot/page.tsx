"use client";

import { useState } from "react";

export default function MeetBotPage() {
  const [meetingUrl, setMeetingUrl] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function startBot() {
    if (!meetingUrl) {
      setError("Informe a URL da reunião!");
      return;
    }

    setStatus("Conectando...");
    setError("");

    try {
      const res = await fetch("/api/bot/startBot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: meetingUrl })
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("Bot entrou na reunião com sucesso!");
        console.log(data);
      } else {
        setStatus("");
        setError(data.error || "Erro ao conectar o bot.");
      }
    } catch (err) {
      console.error(err);
      setStatus("");
      setError("Erro ao chamar o bot.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 text-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Iniciar Bot na Reunião</h1>

        <input
          type="text"
          placeholder="Cole o link da reunião aqui"
          value={meetingUrl}
          onChange={(e) => setMeetingUrl(e.target.value)}
          className="w-full p-3 rounded-md border border-gray-600 bg-gray-700 placeholder-gray-400 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={startBot}
          className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold transition-colors"
        >
          Iniciar Bot
        </button>

        {status && <p className="text-green-400 mt-4">{status}</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}
