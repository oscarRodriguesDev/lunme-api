'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ValidadorLinkAnamnese({ token }: { token: string }) {
  const [valido, setValido] = useState<boolean | null>(null);
  const [mensagem, setMensagem] = useState('');
  const [segundosRestantes, setSegundosRestantes] = useState(10 * 60); // 10 minutos
  const router = useRouter();

  useEffect(() => {
    if (!token) return;

    let intervaloVerificacao: NodeJS.Timeout;
    let intervaloContador: NodeJS.Timeout;

    async function verificarLink() {
      try {
        const res = await fetch(`/api/amnp/${token}`);
        const data = await res.json();

        if (res.ok && data.autorizado) {
          setValido(true);
          setMensagem('');
        }

        if (!res.ok && data.autorizado) {
          setValido(false);
          setMensagem(data.erro || 'Link expirado ou inválido.');
          try {
            await fetch(`/api/amnp/${token}`, {
              method: 'DELETE',
            });
          } catch (error) {
            console.error('Erro ao deletar token:', error);
          }
          router.push('/link-error');
        }
      } catch (err) {
        setValido(false);
        setMensagem('Erro na verificação do link.');
        router.push('/link-error');
      }
    }

    verificarLink(); // valida na montagem

    intervaloVerificacao = setInterval(() => {
      verificarLink();
    }, 60000); // a cada 60 segundos

    intervaloContador = setInterval(() => {
      setSegundosRestantes((s) => {
        if (s <= 1) {
          clearInterval(intervaloVerificacao);
          clearInterval(intervaloContador);
          router.push('/link-error'); // expiração automática
          return 0;
        }
        return s - 1;
      });
    }, 1000); // a cada segundo

    return () => {
      clearInterval(intervaloVerificacao);
      clearInterval(intervaloContador);
    };
  }, [token, router]);

  function formatarTempo(segundos: number) {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    return `${String(minutos).padStart(2, '0')}:${String(segundosRestantes).padStart(2, '0')}`;
  }

  return (
    <div className="mt-4 text-sm text-center">
      {valido === null && <p>Verificando validade do link...</p>}

      {valido === true && (
        <>
          <p className="text-green-600 font-semibold">✅ Link válido</p>
          <p className="text-gray-600">
            Link expira em <span className="font-mono">{formatarTempo(segundosRestantes)}</span>
          </p>
        </>
      )}

      {valido === false && (
        <p className="text-red-600 font-semibold">
          ❌ Link inválido ou expirado: {mensagem}
        </p>
      )}
    </div>
  );
}
