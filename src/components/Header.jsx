import { useState } from 'react';
import rpaLogo from '../assets/rpa-logo.png';
import { useTheme } from '../context/ThemeContext';
import './Header.css';

function Header({
    onReset = () => { },
    isDesktop = true,
    currentDatabase = 'hospital',
    onDatabaseChange = () => { },
    onShowQuestions = () => { }
}) {
    const { theme, toggleTheme } = useTheme();
    const [showMenu, setShowMenu] = useState(false);

    const handleResetClick = () => {
        try {
            onReset();
        } catch (error) {
            console.error('Error during reset:', error);
            alert('An error occurred while resetting progress');
        }
    };

    const handleDatabaseChange = (db) => {
        onDatabaseChange(db);
        setShowMenu(false);
    };

    const databases = ['hospital', 'university', 'company'];

    if (!isDesktop) {
        return (
            <header className="app-header mobile-header" role="banner">
                <div className="mobile-header-top">
                    <button
                        className="menu-toggle"
                        onClick={() => setShowMenu(!showMenu)}
                        aria-label="Toggle menu"
                    >
                        ☰
                    </button>
                    <h1>SQL Practice</h1>
                    <button
                        className="theme-toggle"
                        onClick={toggleTheme}
                        title={`Switch theme`}
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                </div>

                {showMenu && (
                    <div className="mobile-menu">
                        <button className="menu-item" onClick={onShowQuestions}>
                            📋 Questions
                        </button>
                        <button className="menu-item" onClick={handleResetClick}>
                            ↺ Reset Progress
                        </button>
                    </div>
                )}
            </header>
        );
    }

    return (
        <header className="app-header desktop-header" role="banner">
            <div className="header-brand">
                <div className="logo">
                    <img src={rpaLogo} alt="RPA Logo" className="logo-image" />
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
                    title={`Switch theme`}
                    aria-label="Toggle theme"
                    type="button"
                >
                    {theme === 'dark' ? '☀️' : '🌙'}
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
