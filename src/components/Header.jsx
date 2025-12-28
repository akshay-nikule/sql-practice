import { useState } from 'react';
import rpaLogo from '../assets/rpa-logo.png';
import { useTheme } from '../context/ThemeContext';
import './Header.css';

function Header({ 
  onReset = () => {},
  isDesktop = true,
  currentDatabase = 'hospital',
  onDatabaseChange = () => {},
  onShowQuestions = () => {}
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
                        <div className="menu-section">
                            <label>Database:</label>
                            <div className="db-options">
                                {databases.map(db => (
                                    <button
                                        key={db}
                                        className={`db-option ${currentDatabase === db ? 'active' : ''}`}
                                        onClick={() => handleDatabaseChange(db)}
                                    >
                                        {db.charAt(0).toUpperCase() + db.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
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
                    <div className="logo-text">
                        <h1>SQL Practice</h1>
                        <span className="tagline">Ravi Programming Academy</span>
                    </div>
                </div>
            </div>

            <div className="header-database">
                <label>Database:</label>
                <select 
                    value={currentDatabase} 
                    onChange={(e) => onDatabaseChange(e.target.value)}
                    aria-label="Select database"
                >
                    {databases.map(db => (
                        <option key={db} value={db}>
                            {db.charAt(0).toUpperCase() + db.slice(1)}
                        </option>
                    ))}
                </select>
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
