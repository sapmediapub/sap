
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { DEFAULT_CONTRACT_TEMPLATE } from '../utils/legalTemplate';

const CONTRACT_STORAGE_KEY = 'sap-media-contract-template';

interface ContractContextType {
  contractTemplate: string;
  setContractTemplate: (template: string) => void;
}

const ContractContext = createContext<ContractContextType | undefined>(undefined);

export const ContractProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [contractTemplate, setContractTemplateState] = useState<string>(() => {
    try {
      const storedTemplate = localStorage.getItem(CONTRACT_STORAGE_KEY);
      return storedTemplate ? storedTemplate : DEFAULT_CONTRACT_TEMPLATE;
    } catch (error) {
      console.error("Failed to read contract template from localStorage", error);
      return DEFAULT_CONTRACT_TEMPLATE;
    }
  });

  const setContractTemplate = (template: string) => {
    try {
      localStorage.setItem(CONTRACT_STORAGE_KEY, template);
      setContractTemplateState(template);
    } catch (error) {
      console.error("Failed to save contract template to localStorage", error);
    }
  };

  return (
    <ContractContext.Provider value={{ contractTemplate, setContractTemplate }}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContractTemplate = (): ContractContextType => {
  const context = useContext(ContractContext);
  if (context === undefined) {
    throw new Error('useContractTemplate must be used within a ContractProvider');
  }
  return context;
};