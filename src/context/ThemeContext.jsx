import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        try {
            const saved = localStorage.getItem('sql_practice_theme');
            return saved && (saved === 'light' || saved === 'dark') ? saved : 'light';
        } catch (error) {
            console.warn('Failed to read theme from localStorage:', error);
            return 'light';
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('sql_practice_theme', theme);
        } catch (error) {
            console.warn('Failed to save theme to localStorage:', error);
        }

        // Apply theme to document
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const value = {
        theme,
        toggleTheme
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}
