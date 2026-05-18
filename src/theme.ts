import { createTheme } from '@mui/material/styles';

export const getTheme = (mode: 'light' | 'dark') => createTheme({
  palette: {
    mode,
    primary: {
      main: '#0d9488', // Teal 600
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#3b82f6', // Blue 500
    },
    background: {
      default: mode === 'light' ? '#f1f5f9' : '#0f172a',
      paper: mode === 'light' ? '#ffffff' : '#1e293b',
    },
    divider: mode === 'light' ? '#e2e8f0' : '#334155',
    text: {
      primary: mode === 'light' ? '#1e293b' : '#f8fafc',
      secondary: mode === 'light' ? '#64748b' : '#94a3b8',
    },
  },
  typography: {
    fontFamily: '"Inter", "system-ui", "-apple-system", sans-serif',
    h1: { fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.025em' },
    h2: { fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.025em' },
    h3: { fontSize: '1.5rem', fontWeight: 700 },
    h4: { fontSize: '1.25rem', fontWeight: 700 },
    h5: { fontSize: '1.125rem', fontWeight: 600 },
    h6: { fontSize: '1rem', fontWeight: 600 },
    body1: { fontSize: '0.875rem' },
    body2: { fontSize: '0.75rem' },
    button: { textTransform: 'none', fontWeight: 600, fontSize: '0.875rem' },
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: '6px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
      defaultProps: {
        elevation: 0,
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#f8fafc',
          '& .MuiTableCell-root': {
            fontWeight: 700,
            textTransform: 'uppercase',
            fontSize: '10px',
            letterSpacing: '0.05em',
            color: '#64748b',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(even)': {
            backgroundColor: '#f8fafc',
          },
        },
      },
    },
  },
});
