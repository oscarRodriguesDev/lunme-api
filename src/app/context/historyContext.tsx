


'use client';

import React, { createContext, useContext } from 'react';

interface HistoryContextType {
  logAction: (descricao: string, psicologoId:string|any,tipo?: string) => void;
}

const HistoryContext = createContext<HistoryContextType | null>(null);

export const HistoryProvider = ({ children }: { children: React.ReactNode }) => {
  const logAction = async (descricao: string,psicologoId:string, tipo: string='geral') => {
    try {
      await fetch('/api/internal/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          psicologoId,
          descricao,
          tipo,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Erro ao registrar histórico:', error);
    }
  };

  return (
    <HistoryContext.Provider value={{ logAction }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) throw new Error('useHistory deve ser usado dentro do HistoryProvider');
  return context;
};
