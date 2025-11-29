/**
 * Sidebar Context
 * Manages sidebar collapse/expand state with hover behavior
 */

import { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  // Collapsed state (persisted in localStorage)
  // Default: true (collapsed)
  const [collapsed, setCollapsed] = useState(() => {
    const stored = localStorage.getItem('sidebarCollapsed');
    return stored ? JSON.parse(stored) : true;
  });
  
  // Hover state (temporary, not persisted)
  const [isHovered, setIsHovered] = useState(false);
  
  // Computed: sidebar is expanded if not collapsed OR currently hovering
  const isExpanded = !collapsed || isHovered;
  
  // Toggle collapsed state (lock/unlock sidebar)
  const toggleSidebar = () => {
    setCollapsed(prev => {
      const newValue = !prev;
      localStorage.setItem('sidebarCollapsed', JSON.stringify(newValue));
      return newValue;
    });
  };
  
  return (
    <SidebarContext.Provider 
      value={{ 
        collapsed, 
        isHovered,
        isExpanded,
        toggleSidebar,
        setIsHovered 
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
};

