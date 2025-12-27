import { useState, useEffect } from 'react';
import './SqlEditor.css';

function SqlEditor({ onExecute, savedQuery = '', isLoading = false }) {
    const [query, setQuery] = useState(savedQuery);

    // Update query when savedQuery prop changes
    useEffect(() => {
        setQuery(savedQuery);
    }, [savedQuery]);

    const handleExecute = () => {
        const trimmedQuery = query.trim();
        if (trimmedQuery) {
            onExecute(trimmedQuery);
        }
    };

    const handleKeyDown = (e) => {
        if (!e.target) return;

        // Ctrl/Cmd + Enter to run query
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            handleExecute();
            return;
        }

        // Tab key for indentation
        if (e.key === 'Tab') {
            e.preventDefault();
            const { selectionStart: start, selectionEnd: end } = e.target;
            const newValue = query.substring(0, start) + '  ' + query.substring(end);
            setQuery(newValue);
            
            // Schedule cursor position update after state change
            setTimeout(() => {
                if (e.target) {
                    e.target.selectionStart = e.target.selectionEnd = start + 2;
                }
            }, 0);
        }
    };

    const handleClear = () => {
        setQuery('');
    };

    return (
        <div className="sql-editor">
            <div className="editor-header">
                <h3>SQL Editor</h3>
                <span className="shortcut-hint">Ctrl + Enter to run</span>
            </div>

            <textarea
                className="editor-textarea"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write your SQL query here..."
                spellCheck="false"
                aria-label="SQL query editor"
            />

            <div className="editor-actions">
                <button
                    className="btn btn-primary"
                    onClick={handleExecute}
                    disabled={isLoading || !query.trim()}
                    aria-busy={isLoading}
                >
                    {isLoading ? 'Running...' : '▶ Run Query'}
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={handleClear}
                    type="button"
                >
                    Clear
                </button>
            </div>
        </div>
    );
}

export default SqlEditor;
