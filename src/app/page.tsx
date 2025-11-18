'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    // Tempo entre 2 e 5 segundos
    const randomTime = Math.floor(Math.random() * 80);

    const timer = setTimeout(() => {
      router.replace('/api-docs');
    }, randomTime);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
    
    <div className="flex items-center justify-center min-h-screen bg-[#0a2e2e]">
      <h1 className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#0A4D4D] to-[#1FAFAF] animate-glow">
        Lunme 
      </h1>

      <style jsx>{`
        @keyframes glow {
          0%, 100% {
            text-shadow: 0 0 10px #1FAFAF, 0 0 20px #0A4D4D;
          }
          50% {
            text-shadow: 0 0 20px #0A4D4D, 0 0 40px #1FAFAF;
          }
        }
        .animate-glow {
          animation: glow 2.5s infinite ease-in-out;
        }
      `}</style>
    </div>
    </>
  );
}
