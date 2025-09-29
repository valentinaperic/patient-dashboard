'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#8272f5',         
      contrastText: '#ffffff',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: '#8272f5',
          color: '#ffffff',
          fontWeight: 600,
          textTransform: 'none',
          '&:hover': {
            backgroundColor: '#6b5ce6',
          },
        },
      },
    },
  },
});

export default theme;