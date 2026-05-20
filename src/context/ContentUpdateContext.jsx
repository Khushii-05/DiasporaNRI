import { createContext, useContext, useState, useCallback } from 'react';

const ContentUpdateContext = createContext();

export function ContentUpdateProvider({ children }) {
  const [contentUpdated, setContentUpdated] = useState(0);

  const triggerContentUpdate = useCallback(() => {
    setContentUpdated(prev => prev + 1);
  }, []);

  return (
    <ContentUpdateContext.Provider value={{ contentUpdated, triggerContentUpdate }}>
      {children}
    </ContentUpdateContext.Provider>
  );
}

export function useContentUpdate() {
  const context = useContext(ContentUpdateContext);
  if (!context) {
    throw new Error('useContentUpdate must be used within ContentUpdateProvider');
  }
  return context;
}
