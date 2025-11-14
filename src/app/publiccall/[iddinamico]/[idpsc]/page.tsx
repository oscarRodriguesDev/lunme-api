'use client';



import { use, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Peer, { MediaConnection } from "peerjs";
import LiveTranscription from '../../components/transcriptPAC';
import { Mic, MicOff, Video, VideoOff, LogOut, Router } from "lucide-react";
import { useRouter } from "next/navigation";
import {  showErrorMessage, showInfoMessage } from "@/app/util/messages";

export default function PublicCallPage() {

  const [msg, setMsg] = useState<string>("");

  const audioContextRef = useRef<AudioContext | null>(null);

  const analyserRef = useRef<AnalyserNode | null>(null);
  
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

  const { iddinamico} = useParams();

  const {idpsc} = useParams();

  const [peerId, setPeerId] = useState<string>("");

  const [callActive, setCallActive] = useState<boolean>(false);

  const peerRef = useRef<Peer | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const currentCall = useRef<MediaConnection | null>(null);

  const [mic, setMic] = useState<boolean>(true);

  const [video, setVideo] = useState<boolean>(true);

  const [isPsychologist, setIsPsychologist] = useState<boolean>(true);

  const [transcription, setTranscription] = useState<string>("");

  const [textButton, setTextButton] = useState<string>("Ingessar na Consulta");

  const [hasShownAlert, setHasShownAlert] = useState(false);

  const router = useRouter();

  

  const monitorMicrophone = (stream: MediaStream) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    const audioContext = audioContextRef.current;
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256; // Definição do tamanho da análise de frequência
    analyserRef.current = analyser;

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    sourceRef.current = source;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const checkVolume = () => {
      analyser.getByteFrequencyData(dataArray);
      const volume = dataArray.reduce((a, b) => a + b) / dataArray.length; // Calcula o volume médio

      if (remoteAudioRef.current) {
        remoteAudioRef.current.muted = volume > 10; // Se estiver falando, muta o alto-falante
      }
      handleTranscription(transcription, !isPsychologist);
      requestAnimationFrame(checkVolume);
    };

    checkVolume();
  };


  const handleTranscription = (text: string, isPsychologist: boolean) => {
    // Definindo quem está falando, psicólogo ou paciente
    const speaker = isPsychologist ? 'psicologo' : 'paciente';

    // Atualizando a transcrição com o título correto
    setTranscription(prevTranscription => prevTranscription + `\n${speaker}: ${transcription}`);

  };



  const entrar = () => {
    if (!iddinamico) return; // Se não tem ID na URL, não faz nada

    const peer = new Peer(); // Cria um novo peer
    peerRef.current = peer;

    peer.on("open", async (id) => {
      setPeerId(id); // Define o ID do Peer

      try {
        // Envia o ID gerado para a API
        await fetch(`/api/save_peer?iddinamico=${iddinamico}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ iddinamico, peerId: id }),
        });
        setTextButton('Aguardando psicólogo...')
      } catch (error) {
        showErrorMessage("Erro ao enviar peerId para a API:" + error);
      }
    });
    peer.on("call", (call) => {
      // Primeiro tenta com vídeo e áudio
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .catch((error) => {
          showErrorMessage("Vídeo bloqueado, tentando somente áudio:" +  error);
          return navigator.mediaDevices.getUserMedia({ video: false, audio: true });
        
        })
        .then((stream) => {
          if (!stream) {
            throw new Error("Sem acesso ao microfone e câmera");
          }

          if (videoRef.current && stream.getVideoTracks().length > 0) {
            videoRef.current.srcObject = stream;
          }

          call.answer(stream);
          setCallActive(true);
          setTextButton('Psicologo entrou na sala!')
          currentCall.current = call;
          monitorMicrophone(stream);
          setMsg('Transcrevendo Chamada...');

          call.on("stream", (remoteStream) => {
            if (remoteVideoRef.current && remoteStream.getVideoTracks().length > 0) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
            if (remoteAudioRef.current) {
              remoteAudioRef.current.srcObject = remoteStream;
              remoteAudioRef.current.play();
            }
          });

          call.on("close", () => endCall());
        })
        .catch((finalError) => {
      
          showErrorMessage("Não foi possível acessar o microfone. Verifique as permissões do navegador." + finalError);
        });
    });

    return () => peer.destroy(); // Limpa o peer ao desmontar
  }


// Função para mutar/desmutar o microfone
const toggleMic = () => {
 setMic(!mic)
};


// Função para ligar/desligar o vídeo
const toggleVideo = () => {
  if (videoRef.current && videoRef.current.srcObject) {
    const stream = videoRef.current.srcObject as MediaStream;
    stream.getVideoTracks().forEach(track => {
      track.enabled = !track.enabled;
    });
    setVideo(prev => !prev);
  }
};


//desliga a chamada
  const endCall = () => {
    setMsg('');
    if (currentCall.current) currentCall.current.close();
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current?.srcObject) {
      (remoteVideoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      remoteVideoRef.current.srcObject = null;
    }
    setCallActive(false);

    //chamar tela de avaliação
    router.push(`/avaliacao/${idpsc}`);

  };


  useEffect(() => {
    if (!hasShownAlert) {
      showInfoMessage('Por favor, aguarde o psicólogo entrar na sala. Não saia desta página ou você poderá perder a conexão.');
      setHasShownAlert(true);
    }
  }, [hasShownAlert]);
 
  useEffect(() => {
    const handleUnload = () => {
      if (currentCall.current) {
        currentCall.current.close();
      }
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-4 relative">
    <div className="w-full flex justify-end p-4">
      <button
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 border ${
          textButton === "Aguardando psicólogo..."
            ? "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200"
            : "bg-gradient-to-r from-[#33564F] via-[#55FF00] to-[#55FF00] text-black border-[#3D975B] hover:from-[#55FF00] hover:via-[#33FF00] hover:to-[#33FF00]"
        }`}
        onClick={entrar}
      >
        {textButton}
      </button>
    </div>
  
    {/* Video Container */}
    <div className="relative w-full h-[calc(100vh-200px)] rounded-lg overflow-hidden border border-[#3D975B]">
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
  
      <div className="absolute bottom-4 right-4 w-48 h-36 rounded-lg overflow-hidden border-2 border-[#3D975B] shadow-lg">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
          muted
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 text-xs text-center">
          Você
        </div>
      </div>
  
      {/* Control Buttons */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 bg-[#1a1a1a]/90 p-3 rounded-full backdrop-blur-md shadow-md border border-[#3D975B]">
        <button
          className="p-3 rounded-full hover:bg-[#55FF00]/30 transition-colors"
          onClick={() => setMic(!mic)}
        >
          {mic ? <Mic size={20} className="text-white" /> : <MicOff size={20} className="text-red-500" />}
        </button>
        <button
          className="p-3 rounded-full hover:bg-[#55FF00]/30 transition-colors"
          onClick={() => setVideo(!video)}
        >
          {video ? <Video size={20} className="text-white" /> : <VideoOff size={20} className="text-red-500" />}
        </button>
        <button
          className="p-3 rounded-full hover:bg-red-600 transition-colors bg-red-500"
          onClick={endCall}
        >
          <LogOut size={20} className="text-white" />
        </button>
      </div>
    </div>
  
    {/* Transcription Area */}
    <div className="mt-4 bg-[#1a1a1a] rounded-lg p-4 h-[150px] overflow-y-auto border border-[#3D975B]">
      <LiveTranscription
        usuario={"Paciente"}
        mensagem={transcription}
        sala={iddinamico as string}
      />
    </div>
  </div>
  
  
  );
}
