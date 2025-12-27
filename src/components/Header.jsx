import rpaLogo from '../assets/rpa-logo.png';
import { useTheme } from '../context/ThemeContext';
import './Header.css';

function Header({ onReset = () => {} }) {
    const { theme, toggleTheme } = useTheme();

    const handleResetClick = () => {
        try {
            onReset();
        } catch (error) {
            console.error('Error during reset:', error);
            alert('An error occurred while resetting progress');
        }
    };

    return (
        <header className="app-header" role="banner">
            <div className="header-brand">
                <div className="logo">
                    <img 
                        src={rpaLogo} 
                        alt="Ravi Programming Academy Logo" 
                        className="logo-image"
                        loading="eager"
                    />
                    <div className="logo-text">
                        <h1>SQL Practice</h1>
                        <span className="tagline">Ravi Programming Academy</span>
                    </div>
                </div>
            </div>

            <div className="header-actions">
                <button
                    className="theme-toggle"
                    onClick={toggleTheme}
                    title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                    aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                    type="button"
                >
                    {theme === 'dark' ? '☀️' : '🌙'}
                    <span className="theme-label">{theme === 'dark' ? 'Light' : 'Dark'}</span>
                </button>
                <button 
                    className="reset-btn" 
                    onClick={handleResetClick} 
                    title="Reset all progress"
                    aria-label="Reset all progress"
                    type="button"
                >
                    ↺ Reset
                </button>
            </div>
        </header>
    );
}

export default Header;
