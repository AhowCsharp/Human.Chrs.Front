import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  return useContext(LanguageContext);
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('EN'); // 或其他預設語言

  const chooseLang = (value) => {
    if (value === 'tw') {
      setLanguage('TW');
    } else if (value === 'en') {
      setLanguage('EN');
    }
  };

  return (
    <LanguageContext.Provider value={{ language, chooseLang }}>
      {children}
    </LanguageContext.Provider>
  );
};
