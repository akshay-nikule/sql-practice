import './QuestionCard.css';

function QuestionCard({ 
    question = {}, 
    isCompleted = false, 
    onClick = () => {}, 
    isActive = false 
}) {
    if (!question || !question.id) {
        return null;
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

    return (
        <div
            className={`question-card ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
            onClick={onClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick();
                }
            }}
            role="button"
            tabIndex={0}
            aria-pressed={isActive}
        >
            <div className="card-header">
                <span className={`difficulty-badge ${getDifficultyClass(question.difficulty)}`}>
                    {(question.difficulty || 'medium').toUpperCase()}
                </span>
                <span className={`status-badge ${isCompleted ? 'complete' : 'incomplete'}`}>
                    {isCompleted ? '✓ COMPLETE' : 'INCOMPLETE'}
                </span>
            </div>

            <h4 className="card-title">{question.title || 'Untitled'}</h4>

            <p className="card-description">{question.description || 'No description'}</p>

            <div className="card-footer">
                <div className="card-keywords">
                    {keywords.slice(0, 3).map((kw, i) => (
                        <span key={`keyword-${question.id}-${i}`} className="keyword-tag">{kw}</span>
                    ))}
                </div>
                <span className="card-id">#{question.id}</span>
            </div>
        </div>
    );
}

export default QuestionCard;
