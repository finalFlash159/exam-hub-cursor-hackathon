import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n/config';

const PreferencesContext = createContext(null);

const DEFAULT_PREFERENCES = {
  language: 'vi',
  theme: 'light',
};

export const PreferencesProvider = ({ children }) => {
  const [preferences, setPreferences] = useState(() => {
    // Load from localStorage on mount
    try {
      const saved = localStorage.getItem('userPreferences');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return { ...DEFAULT_PREFERENCES, ...parsed };
        } catch (e) {
          console.error('Failed to parse preferences:', e);
          // Clear corrupted data
          localStorage.removeItem('userPreferences');
          return DEFAULT_PREFERENCES;
        }
      }
      return DEFAULT_PREFERENCES;
    } catch (e) {
      console.error('Failed to access localStorage:', e);
      return DEFAULT_PREFERENCES;
    }
  });

  // Persist to localStorage whenever preferences change
  useEffect(() => {
    try {
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      
      // Update i18n language
      if (preferences.language && i18n) {
        i18n.changeLanguage(preferences.language).catch(err => {
          console.error('Failed to change language:', err);
        });
        localStorage.setItem('userLanguage', preferences.language);
      }
    } catch (e) {
      console.error('Failed to persist preferences:', e);
    }
  }, [preferences]);

  const updatePreference = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const updatePreferences = (newPreferences) => {
    setPreferences(prev => ({
      ...prev,
      ...newPreferences,
    }));
  };

  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
  };

  const value = {
    preferences,
    updatePreference,
    updatePreferences,
    resetPreferences,
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within PreferencesProvider');
  }
  return context;
};

