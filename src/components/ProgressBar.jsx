import './ProgressBar.css';

function ProgressBar({ 
    completed = 0, 
    total = 0, 
    questions = [], 
    currentIndex = 0 
}) {
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    const safePercentage = Math.min(100, Math.max(0, percentage));

    return (
        <div className="progress-container">
            <div className="progress-header">
                <span className="progress-text">
                    <strong>{completed}</strong> of <strong>{total}</strong> completed
                </span>
                <span className="progress-percentage" aria-label={`${Math.round(safePercentage)}% progress`}>
                    {Math.round(safePercentage)}%
                </span>
            </div>

            <div className="progress-bar" role="progressbar" aria-valuenow={Math.round(safePercentage)} aria-valuemin="0" aria-valuemax="100">
                <div
                    className="progress-fill"
                    style={{ width: `${safePercentage}%` }}
                />
            </div>

            {questions.length > 0 && (
                <div className="question-dots">
                    {questions.map((q, idx) => {
                        if (!q) return null;
                        
                        const isCompleted = q.isCompleted || false;
                        const isCurrent = idx === currentIndex;
                        const title = `Question ${idx + 1}${q.title ? `: ${q.title}` : ''}`;
                        
                        return (
                            <button
                                key={q.id || idx}
                                className={`dot ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''}`}
                                title={title}
                                aria-label={title}
                                onClick={() => q.onClick && typeof q.onClick === 'function' && q.onClick(idx)}
                                type="button"
                                aria-current={isCurrent ? 'step' : undefined}
                            >
                                {isCompleted ? '✓' : idx + 1}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default ProgressBar;
