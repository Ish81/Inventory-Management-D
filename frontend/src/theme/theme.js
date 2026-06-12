/**
 * src/theme/theme.js — Material UI Theme Configuration
 * ======================================================
 *
 * WHAT IS THIS FILE?
 * Material UI (MUI) lets you customize colors, fonts, spacing, and more
 * in one central place. This file defines YOUR app's design system.
 *
 * WHY A THEME?
 * Without a theme, you'd set colors manually in every component:
 *   <Button style={{ backgroundColor: "#1976d2" }}>  ← repeated 100 times
 *
 * With a theme, MUI applies your colors automatically:
 *   <Button color="primary">  ← uses theme.palette.primary.main
 *
 * Change the theme once → every component updates automatically.
 */

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  // COLOR PALETTE
  // These colors will be used throughout the app
  palette: {
    mode: "light", // "light" or "dark"
    primary: {
      main: "#1565C0", // Deep Blue — professional, trustworthy
      light: "#42A5F5",
      dark: "#0D47A1",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#00897B", // Teal — fresh accent color
      light: "#4DB6AC",
      dark: "#00695C",
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#2E7D32", // Green — for "active", "success", "stock in"
    },
    warning: {
      main: "#F57C00", // Orange — for "low stock", "warnings"
    },
    error: {
      main: "#C62828", // Red — for "errors", "stock out", "critical alerts"
    },
    background: {
      default: "#F5F7FA", // Light gray background
      paper: "#FFFFFF", // White cards/surfaces
    },
  },

  // TYPOGRAPHY (FONTS)
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },

  // COMPONENT OVERRIDES
  // Customize default MUI component styles
  components: {
    // Make all cards have a subtle shadow and rounded corners
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        },
      },
    },
    // Make all buttons have rounded corners
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none", // Don't uppercase button text
          fontWeight: 600,
        },
      },
    },
    // Make paper surfaces (modals, dialogs) have rounded corners
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;
