'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 5000); // 2s para ver o loading
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A4D4D] text-white">
      {/* Logo Lunme */}
      <h1 className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#0A4D4D] to-[#1FAFAF] animate-glow">
        Lunme
      </h1>

      {/* Loading bar minimalista */}
      <div className="w-48 h-1.5 bg-[#063636] rounded-full mt-6 overflow-hidden">
        <div className="h-full bg-[#1FAFAF] animate-loadingBar"></div>
      </div>

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
          animation: glow 2s infinite ease-in-out;
        }

        @keyframes loadingBar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-loadingBar {
          animation: loadingBar 1.5s infinite linear;
        }
      `}</style>
    </div>
  );
}
