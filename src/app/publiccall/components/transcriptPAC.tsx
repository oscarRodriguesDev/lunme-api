"use client";



import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { FaBrain, FaEraser, FaFilePdf, FaStop } from "react-icons/fa";
import { RiPlayList2Fill } from "react-icons/ri";
import { useParams } from "next/navigation";
import { showErrorMessage, showInfoMessage } from "@/app/util/messages";
import Notiflix from "notiflix";
import PopupAjuda from "./modalInfo";

//interface de transcrição
interface LiveTranscriptionProps {
  mensagem: string;
  usuario: string;
  sala: string
}


export default function LiveTranscription({ usuario, mensagem, sala }: LiveTranscriptionProps) {

  const [transcription, setTranscription] = useState<string>("");
  const [recognition, setRecognition] = useState<any>(null);
  const [listening, setListening] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [titulo, setTitulo] = useState<string>("");
  const [analise, setAnalise] = useState<string>("nenhuma analise");
  const [mostrarPopup, setMostrarPopup] = useState(true);



  //busca mensagens da sala
  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/message/?sala=${sala}`, { method: 'GET' });

      if (!response.ok) {
        throw new Error("Erro ao recuperar mensagens.");
      }

      const data = await response.json();

      if (data.transcript) {
        const cleanedTranscript = data.transcript;

        // Só atualiza se o texto limpo for realmente novo
        if (cleanedTranscript !== transcription) {
          setTranscription(cleanedTranscript);
        }
      }
    } catch (error) {
      setError(`Erro ao carregar mensagens: ${error}`);
    }
  };



  //salva transcrição no server
  const saveMessage = async (transcript: string) => {
    try {
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sala, transcript }),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar a mensagem.");
      }

      // Após salvar a mensagem, busca as mensagens novamente
      handleClearTranscription()
      await fetchMessages();
    } catch (error) {
      setError(`Erro ao salvar a mensagem: ${error}`);
    }
  };



  //faz o reconheciemtno de voz
  const handleStartListening = () => {
    if (!recognition) {
      showErrorMessage("Reconhecimento de voz não foi inicializado corretamente.");
      return
    }
    setListening(true);
    recognition.start();
    setError('')
  };



  //para reconhecimento de voz
  const handleStopListening = () => {
    if (!recognition) return;
    setListening(false);
    recognition.stop();
  };



  /**
   * @deprecated
   * Essa função não será utilizada no lado paciente
   */
  const handleClearTranscription = () => {
    setTranscription("");
  };




  /**
   * @deprecated
   * essa função não será usada no lado paciente
   */
  function handleSavePDF(): void {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const marginLeft = 10;
    const marginTop = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const lineHeight = 7; // Espaçamento entre linhas
    const maxWidth = pageWidth - marginLeft * 2;

    let yPos = marginTop;

    const wrapText = (text: string): string[] => {
      return doc.splitTextToSize(text, maxWidth);
    };

    const addTextToPDF = (text: string): void => {
      const lines = wrapText(text);
      lines.forEach((line) => {
        if (yPos + lineHeight > pageHeight - marginTop) {
          doc.addPage();
          yPos = marginTop;
        }
        doc.text(line, marginLeft, yPos);
        yPos += lineHeight;
      });
    };

    addTextToPDF(transcription);
    yPos += lineHeight * 2;

    addTextToPDF("Análise detalhada da conversa:\n");
    yPos += lineHeight;

    addTextToPDF(analise);

    doc.save("transcricao.pdf");
  }




  /**
   * @deprecated 
   * não utilizada mais no lado paciente
   */
  const handleGetInsights = async (mensagem: string) => {
    try {
      const response = await fetch('/api/psicochat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: mensagem }),
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
      }

      const data = await response.json();
      const respostaGPT = data.response || "Nenhuma resposta gerada.";
      setAnalise(respostaGPT);
      return respostaGPT;


    } catch (error) {
      showErrorMessage("Erro ao buscar insights:" + error);
      return "Erro ao obter resposta.";
    }
  };




  //reconhecimetno de voz automatico
  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Seu navegador não suporta reconhecimento de voz.");
      return;
    }
    // Função para pedir permissão e iniciar a transcrição
    const requestMicrophonePermission = async () => {
      try {
        // Tentamos acessar o microfone. O prompt de permissão é exibido automaticamente.
        await navigator.mediaDevices.getUserMedia({ audio: true });
        Notiflix.Confirm.show(
          'Ligar Transcrição?',
          'Para uma melhor experiencia precisamos que autorize a transcrição de sua reuniçao',
          'Sim',
          'Não',
          () => {
            const recognitionInstance = new SpeechRecognition();
            recognitionInstance.continuous = true;
            recognitionInstance.interimResults = false;
            recognitionInstance.lang = "PT-BR";
            recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
              let transcript = "";
              for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                  transcript = result[0].transcript + "\n";
                }
              }
              if (transcript.trim()) {
                setTranscription((prev) => `${usuario}: ${transcript}`);
                saveMessage(`${usuario}: ${transcript}`); // Salvar transcrição na API
              }
            };
            recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
              showInfoMessage('A transcrição foi desativada')
            };
            setRecognition(recognitionInstance);
            recognitionInstance.start();
          },
          () => {
            setError("Transcrição não autorizada!");
            return;
          }
        )
      } catch (err) {
        setError("Permissão para usar o microfone não concedida.");
      }
    };


    requestMicrophonePermission();


    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);




  return (
    <div>
      {error && (
        <>

          <div>
            <button
              className="bg-[#3D975B] text-white px-4 py-2 rounded-md shadow hover:bg-[#337f4d] transition-colors duration-200 text-sm font-medium"
              onClick={() => setMostrarPopup(true)}
            >
              Como ativar Transcrição e/ou Microfone
            </button>

            <PopupAjuda mostrar={mostrarPopup} onFechar={() => setMostrarPopup(false)} />
          </div>


        </>



      )}
      <div className=" w-96 ml-10 pb-4 rounded-lg p-4 overflow-y-auto h-full ">
        <h1 className="text-lg font-semibold text-center mb-2 text-white">{titulo}</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="  flex-1 overflow-y-auto p-2 rounded-md text-sm text-white  max-h-[60vh] ">
          {transcription ? (
            <p className="whitespace-pre-wrap hidden">{transcription}</p>
          ) : (
            <p className="text-gray-800 text-center">{'Aguardando transcrição...'}</p>
          )}
        </div>
      </div>


      {/* Botoes */}
      <div className="absolute top-5  mt-auto mb-auto w-24">
        <div className="pb-1">




        </div>

    


        {!listening ? (
          <button
            onClick={handleStartListening}
            className="bg-red-600 text-white px-4 py-2 ml-1 rounded-md hover:bg-red-500 transition"
            title="Iniciar Transcrição"
          >
            <RiPlayList2Fill size={10} />
          </button>
        ) : (
          <button
            onClick={handleStopListening}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500 transition"
            title="Parar Transcrição"
          >
            <FaStop size={10} />

          </button>
        )}
      </div>
    </div>
  );
}