/**
 * Design System Configuration
 * Compact professional style for consistent sizing across the application
 */

export const DESIGN_SYSTEM = {
  // === TYPOGRAPHY SIZES ===
  typography: {
    // Headers
    pageTitle: '1.25rem',        // h4 - Page titles (Dashboard, Exam List)
    sectionTitle: '1.125rem',    // Quick actions sections
    cardTitle: '1rem',           // Card headers, subtitles
    subHeader: '0.938rem',       // Secondary headers (Manage Exams in sidebar)
    
    // Body text
    bodyLarge: '0.875rem',       // Standard body text
    bodyMedium: '0.813rem',      // Default body (table content, buttons)
    bodySmall: '0.75rem',        // Small body text
    bodyXSmall: '0.688rem',      // Caption text, descriptions
    bodyTiny: '0.625rem',        // Tiny text (badges, micro labels)
  },

  // === ICON SIZES ===
  icons: {
    xlarge: 32,    // QuickActionCard icons
    large: 28,     // StatCard icons
    medium: 20,    // Action button circles
    regular: 18,   // Standard buttons
    small: 16,     // Table actions, compact buttons
    xsmall: 14,    // Chips, inline icons
  },

  // === COMPONENT HEIGHTS ===
  heights: {
    // Buttons
    buttonLarge: 40,
    buttonMedium: 36,
    buttonRegular: 32,
    buttonSmall: 28,
    buttonTiny: 26,
    
    // Inputs
    inputRegular: 32,
    inputSmall: 28,
    inputTiny: 26,
    
    // Cards & Stats
    statIconBox: 28,
    actionIconBox: 20,
    
    // Chips
    chipRegular: 20,
    chipSmall: 18,
    chipTiny: 16,
  },

  // === SPACING SCALE ===
  spacing: {
    // Page-level
    pageTop: { xs: 1, md: 1 },
    pageHorizontal: { xs: 1.5, md: 2 },
    pageBottom: 5,
    
    // Section spacing
    sectionGap: 2,
    sectionGapCompact: 1.5,
    sectionGapTight: 1,
    
    // Component padding
    cardPadding: 2,
    cardPaddingCompact: 1.5,
    cardPaddingTight: 1.25,
    paperPadding: 1.25,
    paperPaddingCompact: 1,
    
    // Element spacing
    elementGap: 1.5,
    elementGapCompact: 1,
    elementGapTight: 0.75,
    
    // Micro spacing
    microGap: 0.5,
    microGapTight: 0.25,
  },

  // === BORDER RADIUS ===
  borderRadius: {
    large: 2,      // QuickActionCards
    regular: 1.5,  // Standard cards, papers
    small: 1,      // Buttons, chips
    tiny: 0.75,    // Badges, micro elements
    round: 0.5,    // Very small rounded corners
  },

  // === RESPONSIVE BREAKPOINTS ===
  responsive: {
    // Grid columns
    statsGrid: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
    
    // Component widths
    searchWidth: { xs: 140, sm: 180 },
    selectMinWidth: { xs: 100, sm: 120 },
    tableMinWidth: { xs: 120, md: 180 },
    
    // Display visibility
    hideOnMobile: { xs: 'none', sm: 'inline-flex' },
    hideOnTablet: { xs: 'none', md: 'table-cell' },
  },

  // === SHADOWS ===
  shadows: {
    subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    card: '0 2px 4px rgba(0, 0, 0, 0.08)',
    hover: '0 4px 8px rgba(0, 0, 0, 0.12)',
  },

  // === COLORS (Semantic) ===
  colors: {
    primary: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    purple: '#8b5cf6',
    indigo: '#6366f1',
    pink: '#f43f5e',
    
    // Backgrounds (light mode)
    primaryBg: 'rgba(59, 130, 246, 0.08)',
    successBg: 'rgba(16, 185, 129, 0.08)',
    warningBg: 'rgba(245, 158, 11, 0.08)',
    errorBg: 'rgba(239, 68, 68, 0.08)',
    purpleBg: 'rgba(139, 92, 246, 0.08)',
    grayBg: 'rgba(107, 114, 128, 0.08)',
  },

  // === TABLE SPECIFIC ===
  table: {
    cellPaddingY: {
      header: 1,
      body: 0.75,
    },
    headerBg: 'grey.50',
    hoverBg: 'rgba(59, 130, 246, 0.02)',
  },

  // === SIDEBAR SPECIFIC ===
  sidebar: {
    // Main navigation sidebar
    widthExpanded: 200,
    widthCollapsed: 64,
    transitionDuration: '0.3s',
    transitionEasing: 'ease',
    
    // Logo
    logoSize: 32,
    logoPadding: 1.5,
    logoGap: 1,
    logoTextSize: 'cardTitle', // 1rem
    
    // Menu items
    menuItemPaddingY: 0.75,
    menuItemPaddingX: 1.5,
    menuItemBorderRadius: 1,
    menuIconSize: 18,
    menuTextSize: 'bodySmall', // 0.75rem
    menuIconMinWidth: 32,
    menuListPaddingX: 1.5,
    menuListPaddingY: 1.5,
    
    // Tooltip
    tooltipEnterDelay: 500,
    
    // Folder sidebar (for ExamListPage)
    folderWidth: 220,
    folderItemHeight: 32,
    folderIconSize: 18,
    folderBadgeSize: 16,
    paddingPerLevel: 12,
  },
};

export default DESIGN_SYSTEM;


