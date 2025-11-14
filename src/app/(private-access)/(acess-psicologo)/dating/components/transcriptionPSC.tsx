"use client";


import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { FaBrain, FaDochub, FaEraser, FaFilePdf, FaStop, FaWalking, FaSave } from "react-icons/fa";
import { HiDocumentMagnifyingGlass } from "react-icons/hi2";
import { useSession } from "next-auth/react";
import { RiPlayList2Fill } from "react-icons/ri";
import TranscriptionModal from "./modalTranscription";;
import { showErrorMessage, showPersistentLoadingMessage, showSuccessMessage, updateToastMessage, } from "../../../../util/messages";
import { DocumentoModal } from "./modaldoc";
import { useAccessControl } from "@/app/context/AcessControl";
import { example1, example2, example3 } from '@/app/util/books';
import { useHistory } from "@/app/context/historyContext";



//interfaces
interface LiveTranscriptionProps {
  mensagem: string;
  usuario: string;
  sala: string
}

interface Docs {
  id: string
  name: string
  psicologoId: string
  prompt: string
}

//interface Paciente
interface Paciente {
  id: string
  nome: string
}

//interface livro
interface Livro {
  id: string
  name:string,
  resumo: string
}


//livros mocados
// livros mockados
const livromock: Livro[] = [
  {
    id: "1",
    name: "O mal estar da Civilização",
    resumo: example1
  },
  {
    id: "2",
    name: "O Homem em Busca de Sentido",
    resumo: example2
  },
  {
    id: "3",
    name: "Inteligência Emocional",
    resumo: example3
  }
];





export default function LiveTranscription({ usuario, mensagem, sala }: LiveTranscriptionProps) {

  const [transcription, setTranscription] = useState<string>("");
  const [recognition, setRecognition] = useState<any>(null);
  const [listening, setListening] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [titulo, setTitulo] = useState<string>("");
  const [analise, setAnalise] = useState<string>('nenhuma analise')
  //const [ligado, setLigado] = useState<boolean>(false) //usar essa variavel pra controlar quando vai transcrever
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [tipoSelecionado, setTipoSelecionado] = useState<string>();
  const [prompt, setPrompt] = useState<string>('me de uma visão geral do paciente');
  const { userID } = useAccessControl();
  const [paciente, setPaciente] = useState<Paciente[]>([])
  const [selecionado, setSelecionado] = useState<string>('Paciente Avulso');
  const [idpaciente, setIdPaciente] = useState<string>('');

  const{logAction} = useHistory();

const user= useSession();
const psicologo = user.data?.user?.name || 'Não definido';
const crp =  user.data?.user?.crp || 'N/A';


 
  const [livros, setLivros] = useState<Livro[]>([]);
//recuperar livros

/* 
useEffect(() => {
  if (!userID) return;

  const fetchLivros = async () => {
    try {
      const response = await fetch(`/api/internal/upbook/?psicologoId=${userID}`);

      if (!response.ok) {
        setLivros(livromock);
          console.log('livros',livros);
        return;
      }

      const data: Livro[] = await response.json();

      // Se não vier livros no array, usa o mock
      if (!data || data.length === 0) {
        setLivros(livromock);
         console.log('livros',livros);
        return;
      }

      setLivros(data);
      console.log('livros', data);
    } catch (err: any) {
      // Se der erro na requisição, também usa mock
      setLivros(livromock);
      console.error('Erro ao buscar livros:', err);
    }
  };

  fetchLivros();
}, [userID]); 

 */

//percorrer e retornar todos os resumos numa unica string
/* 
function getBasedBooks(livros: Livro[]) {
  let nomes = "";
  livros.forEach((livro) => {
    nomes += livro.name +',';
  });
  console.log('nomes:', nomes)
  return nomes;
}
 */



  //gera os insights
  const handleGenerate = () => {
    if (tipoSelecionado) {
   
      // Chama a função que gera o insight/documento
      handleGetInsights(transcription);
      setShowModal(false);
    } else {
      alert('Selecione um tipo de documento primeiro!');
    }
  };


  //verifica reconhecimento de voz
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Seu navegador não suporta reconhecimento de voz.");
      return;
    }

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
        setTranscription((prev) => {
          const updatedTranscription = /* prev +  */`${usuario}: ${transcript}`; //solução para não repetir a transcrição foi tirar a prev
          saveMessage(updatedTranscription); // Salvar transcrição na API
          return updatedTranscription;
        });
      }
    };

    recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(`Erro no reconhecimento: ${event.error}`);
    };

    setRecognition(recognitionInstance);
    // Verifica as novas mensagens a cada 5 segundos
    const intervalId = setInterval(() => {
    }, 5000); // Ajuste o intervalo conforme necessário

    return () => {
      recognitionInstance.stop();
      clearInterval(intervalId); // Limpar o intervalo quando o componente for desmontado
    };
  }, []);





  //busca e atualiza as mensagens
  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/message?sala=${sala}`, { method: 'GET' });

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


  //savar as mensagens no server
  const saveMessage = async (transcript: string) => {
    try {
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sala, transcript }), // <-- ADICIONA AQUI
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar a mensagem.");
      }

      // Após salvar a mensagem, busca as mensagens novamente
      handleClearTranscription();
      await fetchMessages();
    } catch (error) {
      setError(`Erro ao salvar a mensagem: ${error}`);
    }
  };


  //iniciar o reconheciemtno de fala
  const handleStartListening = () => {
    if (!recognition) {
      showErrorMessage("Reconhecimento de voz não foi inicializado corretamente.");
      return;
    }
    setListening(true);
    recognition.start();
  };


  //para o reconheciemtno de fala
  const handleStopListening = () => {
    if (!recognition) return;
    setListening(false);
    recognition.stop();
  };


  //limpa a transcrição
  const handleClearTranscription = () => {
    setTranscription("");
  };


  //gera o pdf
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
       logAction(`Você gerou um pdf do documendo de sua reunião com ${selecionado} `,userID);

  }


  //gera a análise
  const handleGetInsights = async (mensagem: string) => {
    if(!selecionado){
      showErrorMessage('Selecione um paciente antes de gerar a análise.');
      return;
    }
    const toastId = showPersistentLoadingMessage('Gerando documentação da consulta...');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); //120 segundos
    try {
      const response = await fetch(`/api/internal/insight/psicochat/?tipo=${tipoSelecionado}&&userId=${userID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
           message: mensagem,
           prompt:prompt,
           nomePaciente: selecionado,
           nomePsicologo:psicologo, //aqui tem que vim o nome do psicologo logado
           crpPsicologo: crp //aqui tem que vim o crp do psicologo logado
          }),
        signal: controller.signal,
      });


      clearTimeout(timeoutId);

      if (!response.ok) {
        updateToastMessage(toastId, 'Erro ao gerar relatório.', 'error');
        throw new Error(`Erro na requisição: ${response.statusText}`);
      }
      const data = await response.json();
      updateToastMessage(toastId, 'Relatório gerado com sucesso!', 'success');
      logAction(`Você solicitou um documento do tipo ${tipoSelecionado} de sua reunião com ${selecionado} `,userID);
      const respostaGPT = data.response || "Nenhuma resposta gerada.";
      setAnalise(respostaGPT);

      return respostaGPT;

    } catch (error) {
      showErrorMessage("Ocorreu um erro! " + error);
      return ;
    }
  };



  //busca os documentos para gerar as transcrições
  const fetchDocumentos = async (tipo: string) => {
    try {
      const response = await fetch(`/api/internal/uploads/doc-model/?psicologoId=${userID}`)
      if (!response.ok) throw new Error("Erro ao buscar documentos")

      const data: Docs[] = await response.json()

      const documentoSelecionado = data.find(doc => doc.name === tipo)

      if (documentoSelecionado) {
        // let base= getBasedBooks(livros); //não ta usando mais livros
        const prompt = `${documentoSelecionado.prompt}\n\n -` 
        
        setPrompt(prompt || `Houve um erro ao carregar os docuementos, Chat, 
          informeao usuario que não foi possível carregar os documentos, e por isso não foi possivel gerar o documento.`);
       
      }

    } catch (error) {
      console.error("Erro ao buscar documentos:", error)
    }
  }


  //buscar pacientes
  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await fetch(`/api/internal/register_pacientes?psicologoId=${userID}`)
        if (!response.ok) throw new Error('Erro ao buscar pacientes')
        const data = await response.json()
        setPaciente(data)
      } catch (error) {
        console.error('Erro ao buscar paciente:', error)
      }
    }

    fetchPacientes()
  },[userID] )



  //salva a trancrição no banco de dados
  async function saveTranscription(id: string) {
    const formattedTranscription = `*--${new Date().toLocaleString()}\n${transcription.trim()}--*\n`;

    try {
      const response = await fetch('/api/internal/prontuario/save-transcription', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pacienteId: id,
          transcription: formattedTranscription, // <-- agora está correto
        }),
      });

      if (!response.ok) {
        showErrorMessage('Erro ao salvar transcrição');
      } else {
        showSuccessMessage('Transcrição salva com sucesso!');
        
      }

      const data = await response.json();
      console.log('Transcrição salva com sucesso:', data);

      return data;
    } catch (error) {
      console.error('Erro ao salvar transcrição:', error);
      showErrorMessage('Erro ao salvar transcrição');
      throw error;
    }

  }

  


  //seleciona o tipo de documento que vai gerar a analise
  const handleSelectTipo = (tipo: string) => {
    setTipoSelecionado(tipo);
    fetchDocumentos(tipo);

  };



  return (

    <>
    {/* Modal para geração de documento */}
    {showModal && (
      <DocumentoModal
        onClose={() => setShowModal(false)}
        onGenerate={handleGenerate}
        onSelectTipo={handleSelectTipo}
        tipoSelecionado={tipoSelecionado}
        prompt={prompt}
      />
    )}
  
    {/* Modal com transcrição completa */}
    <TranscriptionModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      transcription={analise}
    />
  
    {/* Contêiner fixo no canto inferior direito */}
    <div className="fixed bottom-6 right-6 w-[320px] max-h-[65vh] bg-[#0F1113] bg-opacity-90 backdrop-blur-sm text-[#E6FAF6] rounded-xl shadow-2xl flex flex-col p-4 z-50 border-2 border-[#55FF00]">
  
      {/* Título */}
      <h1 className="text-md font-semibold text-center mb-2 text-[#55FF00]">{titulo}</h1>
  
      {/* Erro */}
      {error && (
        <p className="text-red-500 text-center text-sm mb-2">{error}</p>
      )}
  
      {/* Área de transcrição */}
      <div className="flex-1 overflow-y-auto p-2 text-sm border border-[#55FF00]/30 rounded max-h-[40vh]">
        {transcription ? (
          <p className="whitespace-pre-wrap">{transcription}</p>
        ) : (
          <p className="text-gray-500 text-center italic">Aguardando transcrição...</p>
        )}
      </div>
  
      {/* Select estilizado */}
      <select
        className="mt-3 bg-[#0F1113] text-[#E6FAF6] border border-[#55FF00] text-sm rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#55FF00] transition"
        value={selecionado}
        onChange={(e) => { setSelecionado(e.target.value); setIdPaciente(e.target.value); }}
      >
        <option value="Paciente Avulso">Paciente Avulso</option>
        {paciente.map((p) => (
          <option key={p.id} value={p.id}>{p.nome}</option>
        ))}
      </select>
  
      {/* Botões de ação */}
      <div className="grid grid-cols-4 gap-2 mt-4">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#33564F] hover:bg-[#55FF00] transition p-2 rounded-md flex items-center justify-center"
          title="Ver Transcrição"
        >
          <HiDocumentMagnifyingGlass size={16} />
        </button>
  
        <button
          onClick={handleClearTranscription}
          className="bg-[#33564F] hover:bg-[#55FF00] transition p-2 rounded-md flex items-center justify-center"
          title="Limpar Transcrição"
        >
          <FaEraser size={16} />
        </button>
  
        <button
          onClick={() => setShowModal(true)}
          className="bg-yellow-600 hover:bg-yellow-400 transition p-2 rounded-md flex items-center justify-center"
          title="Análise"
        >
          <FaBrain size={16} />
        </button>
  
        <button
          onClick={() => saveTranscription(idpaciente)}
          className="bg-green-600 hover:bg-green-400 transition p-2 rounded-md flex items-center justify-center"
          title="Salvar Transcrição"
        >
          <FaSave size={16} />
        </button>
  
        {!listening ? (
          <button
            onClick={handleStartListening}
            className="col-span-4 bg-red-600 hover:bg-red-500 transition p-2 rounded-md flex items-center justify-center mt-2"
            title="Iniciar Transcrição"
          >
            <RiPlayList2Fill size={16} />
          </button>
        ) : (
          <button
            onClick={handleStopListening}
            className="col-span-4 bg-red-600 hover:bg-red-500 transition p-2 rounded-md flex items-center justify-center mt-2"
            title="Parar Transcrição"
          >
            <FaStop size={16} />
          </button>
        )}
      </div>
    </div>
  </>
  


  );
}