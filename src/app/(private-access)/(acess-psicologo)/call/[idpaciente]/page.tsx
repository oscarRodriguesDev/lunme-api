'use client';

import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";
import Peer, { MediaConnection } from "peerjs";
import LiveTranscription from "../../dating/components/transcriptionPSC";;
import HeadPage from "@/app/(private-access)/components/headPage";
import { FaMicrophone, FaMicrophoneSlash, FaVideo } from "react-icons/fa";
import { FcEndCall, FcMissedCall } from "react-icons/fc";
import { MdWifiCalling3 } from "react-icons/md";
import { showErrorMessage } from "@/app/util/messages";
import { useHistory } from "@/app/context/historyContext";
import { useAccessControl } from "@/app/context/AcessControl";
import { example1, example2, example3 } from '@/app/util/books';


interface Livro {
  id: string
  resumo: string
}





const livromock = [
  {
    id: "1",
    resumo: example1
  },
  {
    id: "2",
    resumo: example2
  },
  {
    id: "3",
    resumo: example3
  }
];




export default function Home() {

  const user = useSession();
  const [peerId, setPeerId] = useState<string>("");
  const { logAction } = useHistory();
  const [remoteId, setRemoteId] = useState<string>("")
  const [msg, setMsg] = useState<string>("Aguardando transcrição");
  const [callActive, setCallActive] = useState<boolean>(false);
  const peerRef = useRef<Peer | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const currentCall = useRef<MediaConnection | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const params = useParams();
  const searchParams = useSearchParams();
  const iddinamico = params.idpaciente;
  const idpaciente = searchParams.get('iddinamico');//
  const [isPsychologist, setIsPsychologist] = useState<boolean>(true);
  const [transcription, setTranscription] = useState<string>("");
  const { userID } = useAccessControl(); // id do psccologo logado
  const [isMicrophoneOn, setIsMicrophoneOn] = useState<boolean>(true);
  const [isVideoOn, setIsVideoOn] = useState<boolean>(true);

  //função para ativar e desativar video
  function toggleVideo(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    setIsVideoOn((prev) => {
      const newState = !prev;
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getVideoTracks().forEach(track => {
          track.enabled = newState;
        });
      }
      return newState;
    });
  }
  const psicologo = user.data?.user?.name || 'N/A';
  const crp =  user.data?.user?.crp || 'N/A';
  console.log('CRP do psicólogo:', crp);
  console.log('Nome do psicólogo:', psicologo);

  //vunção para ativar e desativar microfone
  function toggleMicrophone(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    setIsMicrophoneOn((prev) => {
      const newState = !prev;
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getAudioTracks().forEach(track => {
          track.enabled = newState;
        });
      }
      return newState;
    });
  }


  // Monitora o volume do microfone
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

      /*  if (remoteAudioRef.current) {
         remoteAudioRef.current.muted = volume > 10; // Se estiver falando, muta o alto-falante
       } */
      handleTranscription('text', isPsychologist);
      requestAnimationFrame(checkVolume);
    };

    checkVolume();
  };



  // Inicia a chamada
  useEffect(() => {
    if (!iddinamico) {
      return;
    }

    const peer = new Peer(uuidv4());
    peerRef.current = peer;

    peer.on("open", (id) => setPeerId(id));
    peer.on("call", (call) => {
      // Primeiro tenta com vídeo e áudio
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .catch((error) => {
          showErrorMessage("Vídeo bloqueado, tentando somente áudio:", error);
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
          showErrorMessage("Não foi possível acessar o microfone. Verifique as permissões do navegador.");
        });
    });


    return () => {
      peer.destroy(); // Limpa instância ao desmontar
    };
  }, [iddinamico]);



  //estabelece a conexão
  const callPeer = () => {
    setMsg('Transcrevendo Chamada...');
    setRemoteId(idpaciente as string);

    if (!remoteId || !peerRef.current) return;

    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: {
        echoCancellation: true, // Reduz eco do próprio microfone
        noiseSuppression: true, // Ajuda a reduzir ruídos
        autoGainControl: false  // Evita que o volume mude sozinho
      }
    }).then((stream) => {
      if (videoRef.current) videoRef.current.srcObject = stream;

      const call = peerRef.current?.call(remoteId, stream);
      call?.on("stream", (remoteStream) => {
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
      });
    });
  };



  //finaliza a chamada
  const endCall = () => {
    setMsg('');

    if (currentCall.current) {
      currentCall.current.close();
    }
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current?.srcObject) {
      (remoteVideoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      remoteVideoRef.current.srcObject = null;
    }
    setCallActive(false);

  };




  //realiza a transcrição
  const handleTranscription = (text: string, isPsychologist: boolean) => {
    const speaker = isPsychologist ? 'psicologo' : 'paciente';
    setTranscription(prevTranscription => prevTranscription + `\n${speaker}: ${text}`);
  };





  return (

    <>
    <HeadPage title="Sala de Reunião" icon={<FaVideo size={20} />} />
  
    <div className="relative flex flex-col items-center justify-center w-[98%] h-[83vh] bg-[#0F1113] text-[#E6FAF6] rounded-xl overflow-hidden shadow-2xl p-4">
  
      {/* Vídeo do paciente */}
      <div className="relative w-full h-full rounded-lg overflow-hidden shadow-inner border-4 border-[#55FF00]">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-[#55FF00] px-3 py-1 rounded-md text-sm font-medium shadow-md">
          Paciente
        </div>
      </div>
  
      {/* Vídeo do psicólogo em PiP */}
      <div className="absolute bottom-6 left-6 w-52 h-52 rounded-lg overflow-hidden shadow-lg border-2 border-[#55FF00]">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-[#55FF00] px-2 py-1 rounded text-xs font-semibold">
          Psicólogo
        </div>
      </div>
  
      {/* Botões de ação */}
      <div className="absolute bottom-6 flex gap-4">
        {/* iniciar chamada */}
        <button
          onClick={callPeer}
          className={`p-3 rounded-full shadow-md transition-all duration-200 
            ${callActive ? "bg-[#33564F] hover:bg-[#55FF00]" : "bg-gray-800 hover:bg-gray-700"} 
            hover:scale-105 active:scale-95`}
        >
          <MdWifiCalling3 size={22} color={callActive ? "white" : "#E6FAF6"} />
        </button>
  
        {/* encerrar chamada */}
        <button
          onClick={endCall}
          className={`p-3 rounded-full shadow-md transition-all duration-200 
            ${callActive ? "bg-red-600 hover:bg-red-700" : "bg-gray-800 hover:bg-red-500"} 
            hover:scale-105 active:scale-95`}
        >
          <FcEndCall size={22} />
        </button>
  
        {/* toggle microfone */}
        <button
          onClick={toggleMicrophone}
          className={`p-3 rounded-full shadow-md transition-all duration-200 
            ${isMicrophoneOn ? "bg-[#33564F] hover:bg-[#55FF00]" : "bg-gray-800 hover:bg-gray-700"} 
            hover:scale-105 active:scale-95`}
        >
          {isMicrophoneOn ? (
            <FaMicrophone size={22} color="white" />
          ) : (
            <FaMicrophoneSlash size={22} color="#E6FAF6" />
          )}
        </button>
  
        {/* toggle vídeo */}
        <button
          onClick={toggleVideo}
          className={`p-3 rounded-full shadow-md transition-all duration-200 
            ${isVideoOn ? "bg-[#33564F] hover:bg-[#55FF00]" : "bg-gray-800 hover:bg-gray-700"} 
            hover:scale-105 active:scale-95`}
        >
          <FaVideo size={22} color={isVideoOn ? "white" : "#E6FAF6"} />
        </button>
      </div>
  
      {/* Transcrição ao lado superior direito */}
      <div className="absolute top-6 right-6 w-[300px] max-h-[300px] bg-[#0F1113] bg-opacity-90 rounded-lg p-4 shadow-lg overflow-y-auto border-2 border-[#55FF00]">
        <h3 className="text-sm font-semibold mb-2 text-[#55FF00]">Transcrição ao Vivo</h3>
        <LiveTranscription
          usuario="Psicologo"
          mensagem={transcription}
          sala={iddinamico as string}
        />
      </div>
    </div>
  </>
  


  );
}