'use client';

import { useState, useEffect } from 'react';
import PrivacyPolicy from './termsAndPolicies';
import { showErrorMessage, showSuccessMessage } from '../../util/messages';

interface ModalConsentProps {
  show: boolean;
  onConsent: (consent: boolean) => void;
  userData: {
    nome: string;
    cpf: string;
  };
}

const ModalConsent: React.FC<ModalConsentProps> = ({ show, onConsent, userData }) => {
  const [consentData, setConsentData] = useState({
    data: '',
    hora: '',
    ip: '',
    nome: '',
    cpf: ''
  });

  useEffect(() => {
    const now = new Date();
    const data = now.toLocaleDateString('pt-BR');
    const hora = now.toLocaleTimeString('pt-BR');

    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(ipData => {
        setConsentData({
          data,
          hora,
          ip: ipData.ip,
          nome: userData.nome,
          cpf: userData.cpf
        });
      })
      .catch(error =>  showErrorMessage('Erro ao obter IP: ' + error));
  }, [userData]);

  const handleClose = () => {
    onConsent(false);
  };

  const handleAccept = async () => {
    try {
      const response = await fetch('/api/consent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(consentData),
      });

      if (response.ok) {
        onConsent(true);
      showSuccessMessage('Consentimento registrado com sucesso! Seus dados foram salvos de forma segura.');
      } else {
        showErrorMessage('Erro ao salvar consentimento' );
      }
    } catch (error) {
      /* nesse caso tenho que verificar no sistema se o cpf está la para dar tratativa */
      showErrorMessage("Erro ao salvar consentimento, talvez você ja tenha usado esse cpf");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full max-h-[90%]  mx-4 overflow-auto">
        <h2 className="text-2xl font-bold mb-4">Termo de Consentimento</h2>
        <PrivacyPolicy/>

        <p className="mb-4 text-gray-700">
          Ao aceitar este termo, você concorda com a coleta, armazenamento e processamento dos seus dados pessoais conforme descrito abaixo:
        </p>

      

        <div className="flex justify-end gap-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 transition"
          >
            Recusar
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConsent;
