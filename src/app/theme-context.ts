import React, { createContext, useContext } from "react";

export type ThemeContextType = {
  theme: string;
  setTheme: (t: string) => void;
};

// Change default to dark mode
export const ThemeContext = createContext<ThemeContextType>({ 
  theme: "dark", 
  setTheme: () => {} 
});

export const useTheme = () => useContext(ThemeContext);
