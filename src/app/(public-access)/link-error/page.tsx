
'use client';

import Link from 'next/link';

export default function ExpiredPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black px-4 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">⚠️ Link Expirado</h1>
      <p className="text-lg mb-6">
        Este link não está mais disponível. Ele pode ter expirado ou sido acessado de outro dispositivo.
      </p>
      <Link href="/">
        <button className="bg-[#147D43] hover:bg-[#0f5e32] text-white px-6 py-2 rounded-lg transition">
          Voltar para o início
        </button>
      </Link>
    </div>
  );
}
