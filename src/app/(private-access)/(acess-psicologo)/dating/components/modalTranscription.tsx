import { useEffect, useState } from 'react';
import { marked } from 'marked';
import jsPDF from 'jspdf';
import { showErrorMessage, showInfoMessage, showSuccessMessage } from '../../../../util/messages';
import { useAccessControl } from '@/app/context/AcessControl';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  transcription: string;
};


interface Paciente {
  id: string
  nome: string
  // outros campos que precisar
}

export default function TranscriptionModal({ isOpen, onClose, transcription }: ModalProps) {
  const [htmlContent, setHtmlContent] = useState('');
  const { userID } = useAccessControl();
  const [aberto, setAberto] = useState<boolean>(false);
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [selecionado, setSelecionado] = useState<string>('');
  const [idpaciente, setIdPaciente] = useState<string>('');

  const formattedHtml = htmlContent.replace(/\n/g, '<br />');

  useEffect(() => {
    if (transcription) {
      const cleanMarkdown = transcription.replace(/\\n/g, '\n');
      const html: string | any = marked(cleanMarkdown);
      setHtmlContent(html);
    } else {
      // Se não houver transcrição, renderiza um placeholder.
      setHtmlContent('<p><em>Nenhuma transcrição encontrada.</em></p>');
    }
  }, [transcription]);



  // Função para salvar o PDF de forma responsiva.
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
    const lineHeight = 7;
    const maxWidth = pageWidth - marginLeft * 2;
    let yPos = marginTop;

    const wrapText = (text: string): string[] => {
      return doc.splitTextToSize(text, maxWidth);
    };

    const safeAddPage = () => {
      if (yPos + lineHeight > pageHeight - marginTop) {
        doc.addPage();
        yPos = marginTop;
      }
    };

    const renderMarkdownLine = (line: string) => {
      safeAddPage();

      // Subtítulos numerados (ex: "1. Seção", "2. Outra seção")
      if (line.match(/^\d+\.\s+/)) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        const subtitle = line.replace(/^\d+\.\s+/, match => match); // mantém o "1. " visível
        const wrapped = wrapText(subtitle);
        wrapped.forEach(wrapLine => {
          doc.text(wrapLine, marginLeft, yPos);
          yPos += lineHeight;
        });
        return;
      }

      // Títulos
      if (line.startsWith("### ")) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(line.replace("### ", ""), marginLeft, yPos);
      } else if (line.startsWith("## ")) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text(line.replace("## ", ""), marginLeft, yPos);
        doc.text(line.replace("** ", ""), marginLeft, yPos);
      } else if (line.startsWith("# ")) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text(line.replace("# ", ""), marginLeft, yPos);
      }

      // Listas
      else if (line.match(/^[-*] /)) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        const wrapped = wrapText("• " + line.slice(2));
        wrapped.forEach(wrapLine => {
          doc.text(wrapLine, marginLeft, yPos);
          yPos += lineHeight;
        });
        return;
      }

      // Texto normal com negrito ou itálico simples
      else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        let formattedLine = line
          .replace(/\*\*(.*?)\*\*/g, "$1".toUpperCase()) // simula negrito com maiúsculas
          .replace(/\*(.*?)\*/g, "_$1_"); // simula itálico com underscores

        const wrapped = wrapText(formattedLine);
        wrapped.forEach(wrapLine => {
          doc.text(wrapLine, marginLeft, yPos);
          yPos += lineHeight;
        });
        return;
      }

      yPos += lineHeight;
    };


    const renderMarkdownText = (markdown: string) => {
      const lines = markdown.split("\n");

      lines.forEach((line, index) => {
        const isLastLine = index === lines.length - 1;

        if (line.trim() === "") {
          // Só pula linha se a próxima não for outra linha em branco
          const nextLine = lines[index + 1];
          if (nextLine && nextLine.trim() !== "") {
            yPos += lineHeight / 1.5; // espaçamento menor para quebras
          }
        } else {
          renderMarkdownLine(line);
        }

        if (isLastLine) {
          yPos += lineHeight;
        }
      });
    };

    // PDF
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Transcrição da Sessão", marginLeft, yPos);
    yPos += lineHeight * 1.5;

    renderMarkdownText(transcription);

    // Linha horizontal de separação (se couber)
    if (yPos + lineHeight < pageHeight - marginTop) {
      doc.line(marginLeft, yPos, pageWidth - marginLeft, yPos);
      yPos += lineHeight;
    }

    //salvando como nome direrenciado
    doc.save(`relatorio_${new Date().toISOString().split('T')[0]}.pdf`);

  }



  function handleSavePDF2(): void {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const marginLeft = 10;
    const marginTop = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const lineHeight = 7;
    const maxWidth = pageWidth - marginLeft * 2;
    let yPos = marginTop;

    const wrapText = (text: string): string[] => {
      return doc.splitTextToSize(text, maxWidth);
    };

    const safeAddPage = () => {
      if (yPos + lineHeight > pageHeight - marginTop) {
        doc.addPage();
        yPos = marginTop;
      }
    };

    const cleanFormatting = (text: string): string => {
      return text
        .replace(/^#+\s*/, "") // remove ##, ### etc. no início da linha
        .replace(/\*\*(.*?)\*\*/g, "$1") // remove **negrito**
        .replace(/\*(.*?)\*/g, "$1")     // remove *itálico*
        .trim();
    };

    const renderMarkdownLine = (line: string) => {
      safeAddPage();

      // Subtítulos numerados (ex: "1. Seção", "2. Outra seção")
      if (/^\d+\.\s+/.test(line)) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        const subtitle = cleanFormatting(line);
        const wrapped = wrapText(subtitle);
        wrapped.forEach(wrapLine => {
          doc.text(wrapLine, marginLeft, yPos);
          yPos += lineHeight;
        });
        return;
      }

      // Títulos
      if (line.startsWith("### ")) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(cleanFormatting(line), marginLeft, yPos);
      } else if (line.startsWith("## ")) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text(cleanFormatting(line), marginLeft, yPos);
      } else if (line.startsWith("# ")) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text(cleanFormatting(line), marginLeft, yPos);
      }

      // Listas
      else if (/^[-*] /.test(line)) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        const listItem = "• " + cleanFormatting(line.slice(2));
        const wrapped = wrapText(listItem);
        wrapped.forEach(wrapLine => {
          doc.text(wrapLine, marginLeft, yPos);
          yPos += lineHeight;
        });
        return;
      }

      // Texto comum
      else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        const plainText = cleanFormatting(line);
        const wrapped = wrapText(plainText);
        wrapped.forEach(wrapLine => {
          doc.text(wrapLine, marginLeft, yPos);
          yPos += lineHeight;
        });
        return;
      }

      yPos += lineHeight;
    };

    const renderMarkdownText = (markdown: string) => {
      const lines = markdown.split("\n");

      lines.forEach((line, index) => {
        const isLastLine = index === lines.length - 1;

        if (line.trim() === "") {
          const nextLine = lines[index + 1];
          if (nextLine && nextLine.trim() !== "") {
            yPos += lineHeight / 1.5;
          }
        } else {
          renderMarkdownLine(line);
        }

        if (isLastLine) {
          yPos += lineHeight;
        }
      });
    };

    //Cabeçalho do PDF
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Transcrição da Sessão", marginLeft, yPos);
    yPos += lineHeight * 1.5;

    renderMarkdownText(transcription);

    // Linha de separação
    if (yPos + lineHeight < pageHeight - marginTop) {
      doc.line(marginLeft, yPos, pageWidth - marginLeft, yPos);
      yPos += lineHeight;
    }

    doc.save(`relatorio_${new Date().toISOString().split('T')[0]}.pdf`);
  }


  //save transcription
  async function saveTranscription(id: string) {
    const formattedTranscription = `*--${new Date().toLocaleString()}\n${htmlContent.trim()}--*\n`;

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


  //buscar pacientes
  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await fetch(`/api/internal/register_pacientes?psicologoId=${userID}`)
        if (!response.ok) throw new Error('Erro ao buscar pacientes')
        const data = await response.json()
        setPacientes(data)
      } catch (error) {
        console.error('Erro ao buscar paciente:', error)
      }
    }

    fetchPacientes()
  }, [userID])




  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50">
      <div className="bg-[#0F1113] p-6 rounded-2xl shadow-2xl max-w-3xl w-full relative border-2 border-[#55FF00] text-[#E6FAF6]">

        {/* Botão de fechar */}
        <button
          className="absolute top-3 right-3 text-[#E6FAF6] hover:text-[#55FF00] text-xl transition"
          onClick={onClose}
        >
          ✖
        </button>


   <div
  id="transcription-content"
  className="prose prose-invert max-h-[70vh] overflow-y-auto p-4 bg-[#0F1F1E]/80 rounded-lg shadow-inner text-[#E6FAF6] scrollbar-thin scrollbar-thumb-[#4FD1C5]/70 scrollbar-track-[#0F1F1E]/50"
  dangerouslySetInnerHTML={{ __html: formattedHtml }}
/>



        {/* Botões de ação */}
        <div className="mt-6 flex flex-col sm:flex-row justify-end sm:items-center gap-3">

          <button
            onClick={handleSavePDF2}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
          >
            Baixar PDF
          </button>

          <div className="relative">
            <button
              onClick={() => setAberto(!aberto)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition"
            >
              Selecione seu paciente
            </button>

            {aberto && (
              <select
                className="absolute mt-2 bg-[#0F1113] text-[#E6FAF6] border border-[#55FF00] rounded-md p-2 w-full z-10"
                value={selecionado}
                onChange={(e) => {
                  setSelecionado(e.target.value);
                  setAberto(false);
                  setIdPaciente(e.target.value);
                }}
              >
                <option value="">Selecione</option>
                {pacientes.map((paciente) => (
                  <option key={paciente.id} value={paciente.id}>
                    {paciente.nome}
                  </option>
                ))}
              </select>
            )}
          </div>

          <button
            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md transition"
            onClick={() => saveTranscription(idpaciente)}
          >
            Salvar transcrição
          </button>
        </div>
      </div>
    </div>

  );
}
