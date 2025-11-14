"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white px-6 text-center">
      <div className="max-w-md">
        <h1 className="text-7xl font-bold text-[#147D43] tracking-wider glitch">
          404
        </h1>
        <h2 className="text-2xl font-semibold mt-4">
          Ops! Lunme não encontrou esse caminho
        </h2>
        <p className="mt-2 text-gray-300">
          Essa pagina pode ter sido removida{dots}
        </p>
        <Link
          href="/"
          className="mt-6 inline-block px-6 py-2 bg-[#147D43] text-white font-semibold rounded-full hover:bg-green-700 transition-all"
        >
          Voltar para a base
        </Link>
        <style jsx>{`
          .glitch {
            position: relative;
            display: inline-block;
          }
          .glitch::before,
          .glitch::after {
            content: "404";
            position: absolute;
            top: 0;
            left: 0;
            opacity: 0.3;
            color: #147d43;
            z-index: -1;
          }
          .glitch::before {
            transform: translateX(-2px);
          }
          .glitch::after {
            transform: translateX(2px);
          }
        `}</style>
      </div>
    </main>
  );
}
