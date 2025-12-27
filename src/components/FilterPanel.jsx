import './FilterPanel.css';

const KEYWORDS = [
    'select', 'where', 'distinct', 'group by', 'having', 'in',
    'join', 'like', 'null', 'case', 'order by', 'limit',
    'count', 'avg', 'sum', 'max', 'min'
];

const DIFFICULTIES = ['easy', 'medium', 'hard'];
const COMPLETION_OPTIONS = ['all', 'incomplete', 'complete'];

function FilterPanel({
    filters = {
        database: 'hospital',
        difficulty: 'all',
        completion: 'all',
        keywords: []
    },
    onFilterChange = () => {},
    databases = [],
    questionStats = { total: 0, filtered: 0, completed: 0 }
}) {
    const handleKeywordClick = (keyword) => {
        const newKeywords = (filters.keywords || []).includes(keyword)
            ? (filters.keywords || []).filter(k => k !== keyword)
            : [...(filters.keywords || []), keyword];
        onFilterChange({ ...filters, keywords: newKeywords });
    };

    const handleDifficultyClick = (diff) => {
        onFilterChange({
            ...filters,
            difficulty: filters.difficulty === diff ? 'all' : diff
        });
    };

    const handleCompletionClick = (comp) => {
        onFilterChange({ ...filters, completion: comp });
    };

    const handleDatabaseClick = (db) => {
        onFilterChange({ ...filters, database: db });
    };

    const clearKeywords = () => {
        onFilterChange({ ...filters, keywords: [] });
    };

    const currentKeywords = filters.keywords || [];

    return (
        <div className="filter-panel">
            <h3 className="filter-title">Filters</h3>

            {/* Database Filter */}
            <div className="filter-section">
                <h4>Database</h4>
                <div className="filter-buttons database-buttons">
                    {databases.map(db => (
                        <button
                            key={db.id}
                            className={`filter-btn database-btn ${filters.database === db.id ? 'active' : ''}`}
                            onClick={() => handleDatabaseClick(db.id)}
                            type="button"
                            aria-pressed={filters.database === db.id}
                        >
                            {db.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Difficulty Filter */}
            <div className="filter-section">
                <h4>Difficulty</h4>
                <div className="filter-buttons">
                    <button
                        className={`filter-btn ${filters.difficulty === 'all' ? 'active' : ''}`}
                        onClick={() => handleDifficultyClick('all')}
                        type="button"
                        aria-pressed={filters.difficulty === 'all'}
                    >
                        ALL
                    </button>
                    {DIFFICULTIES.map(diff => (
                        <button
                            key={diff}
                            className={`filter-btn difficulty-${diff} ${filters.difficulty === diff ? 'active' : ''}`}
                            onClick={() => handleDifficultyClick(diff)}
                            type="button"
                            aria-pressed={filters.difficulty === diff}
                        >
                            {diff.charAt(0).toUpperCase() + diff.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Completion Filter */}
            <div className="filter-section">
                <h4>Completion</h4>
                <div className="filter-buttons">
                    {COMPLETION_OPTIONS.map(comp => (
                        <button
                            key={comp}
                            className={`filter-btn ${filters.completion === comp ? 'active' : ''}`}
                            onClick={() => handleCompletionClick(comp)}
                            type="button"
                            aria-pressed={filters.completion === comp}
                        >
                            {comp.charAt(0).toUpperCase() + comp.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Keywords Filter */}
            <div className="filter-section">
                <div className="filter-header">
                    <h4>Keywords</h4>
                    {currentKeywords.length > 0 && (
                        <button 
                            className="clear-btn" 
                            onClick={clearKeywords}
                            type="button"
                            aria-label="Clear all keyword filters"
                        >
                            Clear
                        </button>
                    )}
                </div>
                <div className="filter-buttons keywords">
                    <button
                        className={`filter-btn ${currentKeywords.length === 0 ? 'active' : ''}`}
                        onClick={clearKeywords}
                        type="button"
                        aria-pressed={currentKeywords.length === 0}
                    >
                        ALL
                    </button>
                    {KEYWORDS.map(keyword => (
                        <button
                            key={keyword}
                            className={`filter-btn keyword-btn ${currentKeywords.includes(keyword) ? 'active' : ''}`}
                            onClick={() => handleKeywordClick(keyword)}
                            type="button"
                            aria-pressed={currentKeywords.includes(keyword)}
                        >
                            {keyword.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="filter-stats">
                <div className="stat">
                    <span className="stat-value">{questionStats.filtered || 0}</span>
                    <span className="stat-label">Showing</span>
                </div>
                <div className="stat">
                    <span className="stat-value">{questionStats.completed || 0}</span>
                    <span className="stat-label">Completed</span>
                </div>
                <div className="stat">
                    <span className="stat-value">{questionStats.total || 0}</span>
                    <span className="stat-label">Total</span>
                </div>
            </div>
        </div>
    );
}

export default FilterPanel;
