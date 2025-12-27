import './QuestionPanel.css';

function QuestionPanel({
    question = null,
    currentIndex = 0,
    totalQuestions = 0,
    onPrevious = () => {},
    onNext = () => {},
    isCompleted = false,
    showHint = false,
    onToggleHint = () => {},
    databaseName = ''
}) {
    if (!question) {
        return <div className="question-panel loading">Loading questions...</div>;
    }

    const getDifficultyClass = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case 'easy': return 'difficulty-easy';
            case 'medium': return 'difficulty-medium';
            case 'hard': return 'difficulty-hard';
            default: return '';
        }
    };

    const keywords = question.keywords || [];
    const hint = question.hint || 'No hint available';
    const category = question.category || 'General';

    return (
        <div className="question-panel">
            <div className="question-header">
                <div className="question-meta">
                    <span className="question-number">
                        Question {currentIndex + 1} of {totalQuestions}
                    </span>
                    <span className={`difficulty ${getDifficultyClass(question.difficulty)}`}>
                        {question.difficulty || 'medium'}
                    </span>
                    <span className="category">{category}</span>
                    {databaseName && (
                        <span className="database-badge">
                            📊 {databaseName.charAt(0).toUpperCase() + databaseName.slice(1)}
                        </span>
                    )}
                    {isCompleted && <span className="completed-badge">✓ Completed</span>}
                </div>
            </div>

            <h2 className="question-title">{question.title || 'Untitled Question'}</h2>

            <p className="question-description">{question.description || 'No description provided'}</p>

            {keywords.length > 0 && (
                <div className="question-keywords">
                    {keywords.map((kw, i) => (
                        <span key={`keyword-${i}`} className="keyword-chip">{kw}</span>
                    ))}
                </div>
            )}

            <div className="hint-section">
                <button
                    className={`hint-toggle ${showHint ? 'active' : ''}`}
                    onClick={onToggleHint}
                    type="button"
                    aria-expanded={showHint}
                >
                    {showHint ? '💡 Hide Hint' : '💡 Show Hint'}
                </button>
                {showHint && (
                    <div className="hint-content" role="region" aria-label="Question hint">
                        <strong>Hint:</strong> {hint}
                    </div>
                )}
            </div>

            <div className="question-navigation">
                <button
                    className="nav-btn"
                    onClick={onPrevious}
                    disabled={currentIndex === 0}
                    type="button"
                >
                    ← Previous
                </button>
                <button
                    className="nav-btn"
                    onClick={onNext}
                    disabled={currentIndex === totalQuestions - 1}
                    type="button"
                >
                    Next →
                </button>
            </div>
        </div>
    );
}

export default QuestionPanel;
