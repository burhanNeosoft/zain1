"use client";
import { createContext, useContext, useEffect, useState } from "react";

export const ThemeContext = createContext({
  theme: "dark", // Default to dark
  setTheme: (theme: string) => {},
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState("dark"); // Start with dark
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check localStorage first
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // If no saved theme, check system preference
      /* const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light"); */
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("theme", theme);
      // Apply dark class to html element
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme, mounted]);

  // Apply dark mode immediately on mount to prevent flash
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  if (!mounted) {
    return <div className="dark">{children}</div>; // Show dark mode during SSR
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;