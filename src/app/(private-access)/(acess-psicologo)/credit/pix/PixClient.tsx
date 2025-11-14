"use client"


import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAccessControl } from "@/app/context/AcessControl"





export default function PixClient({ brcode }: { brcode: string }) {
  const { userID } = useAccessControl()
  const router = useRouter()
  const qrCodeUrl = decodeURIComponent(brcode)
  const [secondsLeft, setSecondsLeft] = useState(180)

 //pegar a ordem da query string (?order=...)
  const [ordem, setOrdem] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const ordemParam = searchParams.get("order");
      setOrdem(ordemParam);
    }
  }, []);


  // Chama a API e verifica o status da compra a cada segundo
  useEffect(() => {
    if (!ordem || !userID) return;

    let intervalId: NodeJS.Timeout;

    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/internal/payments/compra-status?userId=${userID}&paymentId=${ordem}`);
        const data = await res.json();
         if(data.status==='PAID'){
        
          router.push(`/credit/${userID}`)
        } 
         
        // Se quiser tratar outros status, adicione aqui
      } catch (err) {
        // Silencia erros para não poluir o usuário
        // console.error("Erro ao checar status da compra:", err);
      }
    };

    intervalId = setInterval(checkStatus, 5000);

    // Checa imediatamente ao montar
    checkStatus();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [ordem, userID, router]);
 


 


  
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push(`/credit/${userID}`)
          return 0
        }
        return prev - 1
      })
    }, 60000) // 2 minutoa

    return () => clearInterval(timer)
  }, [router])

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0")
    const s = (sec % 60).toString().padStart(2, "0")
    return `${m}:${s}`
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-6">
      <h1 className="text-3xl font-bold text-[#117F43] mb-3">Pagamento Seguro PIX</h1>
      <p className="text-center max-w-md mb-6">
        Escaneie o QR Code abaixo para concluir seu pagamento.
      </p>

      {qrCodeUrl && (
        <div className="bg-white p-6 rounded-2xl mb-6 flex items-center justify-center shadow-lg border border-gray-200">
          <img src={qrCodeUrl} alt="QR Code PIX Oficial" className="w-64 h-64" />
        </div>
      )}

      <div className="text-[#117F43] text-xl font-semibold mb-6">
        Tempo restante: {formatTime(secondsLeft)}
      </div>

      <button
        onClick={() => router.push(`/credit/${userID}`	)}
        className="px-6 py-3 bg-[#117F43] text-white rounded-lg text-lg hover:bg-green-600 transition"
      >
        Voltar aos Créditos
      </button>
    </div>
  )
}
