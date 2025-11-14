// utils/message.ts
import { toast, ToastOptions,Id } from 'react-toastify';




const defaultOptions: ToastOptions = {
  autoClose: 10000, // <-- aqui define o tempo padrão (10 segundos)
};

// Função para exibir mensagens de sucesso
export const showSuccessMessage = (message: string, options?: ToastOptions) => {
  toast.success(message, { ...defaultOptions, ...options });
};

// Função para exibir mensagens de erro
export const showErrorMessage = (message: string, options?: ToastOptions) => {
  toast.error(message, { ...defaultOptions, ...options });
};

// Função para exibir mensagens de carregamento
export const showLoadingMessage = (message: string, options?: ToastOptions) => {
  toast.info(message, { ...defaultOptions, ...options });
};

// Função para exibir mensagens informativas
export const showInfoMessage = (message: string, options?: ToastOptions) => {
  toast.info(message, { ...defaultOptions, ...options });
};


// Função exibe mensagem por tempo determinada nela mesmo
export const showInfoMessageControlTime = (
  message: string,
  time:10000, // padrão 10s
  options?: ToastOptions
) => {
  toast.info(message, { ...defaultOptions, ...options, autoClose: time });
};


// Exibe um toast de carregamento persistente e retorna o ID
export const showPersistentLoadingMessage = (
  message: string,
  options?: ToastOptions
): Id => {
  return toast.loading(message, { ...defaultOptions, ...options, autoClose: false });
};

// Atualiza o toast existente
export const updateToastMessage = (
  toastId: Id,
  message: string,
  type: 'success' | 'error' | 'info' | 'warning' = 'info',
  options?: ToastOptions
) => {
  toast.update(toastId, {
    render: message,
    type,
    isLoading: false,
    autoClose: options?.autoClose ?? 5000,
    ...options,
  });
};





// Função genérica que pode exibir qualquer tipo de mensagem
export const showCustomMessage = (
  type: 'success' | 'error' | 'info' | 'warning',
  message: string,
  options?: ToastOptions
) => {
  switch (type) {
    case 'success':
      return toast.success(message, { ...defaultOptions, ...options });
    case 'error':
      return toast.error(message, { ...defaultOptions, ...options });
    case 'info':
      return toast.info(message, { ...defaultOptions, ...options });
    case 'warning':
      return toast.warning(message, { ...defaultOptions, ...options });
    default:
      return toast(message, { ...defaultOptions, ...options });
  }
};
