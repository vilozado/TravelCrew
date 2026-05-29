import {useState, useEffect, createContext} from "react"; 
import type { ReactNode } from 'react'; 

type Theme = 'light' | 'dark';
interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

 const UpdateRootClassTheme = (isDark: boolean) => {
  try {
    const root = document.documentElement;
    root.classList.remove('light-theme');
    root.classList.remove('dark-theme');
    root.classList.remove('dark');

    if (isDark) {
      root.classList.add('dark');
      root.classList.add('dark-theme');
    } else {
      root.classList.add('light-theme');
    }
  } catch (err) {
    console.log({ err }, 'Error: Failed to switch themes.');
  }
};

const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children: children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  
  useEffect(() => {
    if (theme) UpdateRootClassTheme(theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  return <ThemeContext.Provider value={{ theme, toggleTheme}}>{children}</ThemeContext.Provider>;
};

export { ThemeProvider, ThemeContext};