
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import {
  CssBaseline,
  ThemeProvider,
  createTheme
} from '@mui/material';

import App from './App.jsx';
import './index.css';

// Create the MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#5b45e0'
    },
    secondary: {
      main: '#ff8a4c'
    },
    background: {
      default: '#f7f7fc',
      paper: '#ffffff'
    },
    text: {
      primary: '#20213a',
      secondary: '#70718a'
    }
  },

  typography: {
    fontFamily: '"Inter", "Roboto", Arial, sans-serif',

    button: {
      textTransform: 'none',
      fontWeight: 700
    },

    h1: {
      fontWeight: 850
    },

    h2: {
      fontWeight: 850
    },

    h4: {
      fontWeight: 800
    }
  },

  shape: {
    borderRadius: 16
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 18px'
        }
      }
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18
        }
      }
    }
  }
});

// Render the React application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <BrowserRouter>
        <App />
      </BrowserRouter>

    </ThemeProvider>
  </React.StrictMode>
);
