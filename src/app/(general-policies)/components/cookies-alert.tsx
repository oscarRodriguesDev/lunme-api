'use client';

import { useState, useEffect } from 'react';
import { FaCookieBite } from 'react-icons/fa';
import { showErrorMessage } from '../../util/messages';

const CookiesAlert = () => {

  const [showAlert, setShowAlert] = useState(false);
  const [ip, setIp] = useState<string>("");
  const [consent, setConsent] = useState<boolean | null>(null);


  /**
   *  Recupera o ip do usuario que faz o aceite de cookies, dado coletado serve para
   *  comprovar consentimento do usuario para uso de cookies
   * @return ip
   *  
   * */
  const getClientIp = async (): Promise<string> => {
    const res = await fetch('https://api.ipify.org?format=json');
    const { ip } = await res.json();
    return ip;
  };

  /**
   * Verifica se o usuario ja eceitou os cookies no servidor
   * @param ip;
   * @return data - registro de aceitre do cookie no servidor
   */
  const getRemoteConsent = async (ip: string) => {
    const res = await fetch('/api/cookies-consent', {
      headers: { 'x-forwarded-for': ip }
    });
    return { status: res.status, data: await res.json() };
  };


  /**
   * Registra o aceite do usuario no banco de de dados
   * @param ip 
   * @param value
   * obs-  destaca-se que somente respostas positivas são registradas no banco de dados
   */
  const postConsent = async (ip: string, value: boolean) => {
    await fetch('/api/cookies-consent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': ip
      },
      body: JSON.stringify({
        accepted: value,
        timestamp: new Date(),
      })
    });
  };


  /**
   * Deleta o aceite ao uso de cookies do banco de dados
   * @param ip
   * 
   */
  const deleteConsent = async (ip: string) => {
    await fetch('/api/cookies-consent', {
      method: 'DELETE',
      headers: { 'x-forwarded-for': ip }
    });
  };


  /**
   * Sincroniza o aceite do usuario de acordo com a opção local, sempre a a opção local prevalece sobre
   * a opção no banco de dados (para caso o usuario decida não mais permitir uso de cookies)
   */

  const syncCookieConsentWithServer = async () => {
    try {
      const ip = await getClientIp();
      setIp(ip);

      const { status, data } = await getRemoteConsent(ip);
      const localConsent = localStorage.getItem('cookieConsent');

      const remoteConsent = data?.permission?.toString(); // ou `data?.permissão`

      const hasLocalConsent = localConsent !== null;

      if (status === 404 && hasLocalConsent) {
        await postConsent(ip, localConsent === 'true');
      }

      if (status === 200) {
        if (!hasLocalConsent) {
          await deleteConsent(ip);
          setConsent(null);
          setShowAlert(true);
        } else if (remoteConsent !== localConsent) {
          await deleteConsent(ip);
          setShowAlert(true);
        }
      }

    } catch (err) {
      showErrorMessage('Erro ao sincronizar consentimento: ' + err);
    }
  };




  useEffect(() => {
    syncCookieConsentWithServer();
  }, []);



  useEffect(() => {
    const loadCookieConsent = () => {
      const storedConsentValue = localStorage.getItem('cookieConsent');

      if (storedConsentValue === null) {
        setShowAlert(true);
        return;
      }

      setConsent(storedConsentValue === 'true');
    };

    loadCookieConsent();
  }, []);



  const postConsentToServer = async () => {
    const response = await fetch('/api/cookies-consent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accepted: true,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao salvar consentimento no servidor');
    }
  };

  const acceptCookieConsent = async () => {
    setConsent(true);
    localStorage.setItem('cookieConsent', 'true');
    setShowAlert(false);

    try {
      await postConsentToServer();
    } catch (error) {
      showErrorMessage('Erro ao registrar consentimento: ' + error);
    }
  };



  const notAcceptCookieConsent = () => {
    setShowAlert(false);
  };




  if (!showAlert) return null;

  return (

    <>
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 bg-opacity-70 text-white p-4 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <FaCookieBite className="text-2xl" />
            <div>
              <p className="font-semibold">Uso de Cookies</p>
              <p className="text-sm">
                Utilizamos cookies para melhorar sua experiência. Ao continuar navegando, você concorda com nossa política de cookies.
              //criar a pagina de politica de cookies
              </p>
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={notAcceptCookieConsent}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
            >
              Recusar
            </button>
            <button
              onClick={acceptCookieConsent}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            >
              Aceitar
            </button>
          </div>
        </div>
      </div>

    </>
  );
};

export default CookiesAlert;
