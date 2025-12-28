import './ResultsTable.css';

function ResultsTable({
    userResult = { columns: [], values: [], error: null },
    expectedResult = { columns: [], values: [], error: null },
    isCorrect = null,
    hasExecuted = false,
    isMobile = false
}) {
    if (!hasExecuted) {
        return (
            <div className={`results-container ${isMobile ? 'mobile' : ''}`}>
                <div className="results-placeholder">
                    <div className="placeholder-icon">📊</div>
                    <p>Run your query to see results here</p>
                </div>
            </div>
        );
    }

    const renderTable = (result, title, type) => {
        if (!result) {
            return (
                <div className={`result-section ${type}`}>
                    <h4>{title}</h4>
                    <div className="error-message">
                        <span className="error-icon">❌</span>
                        <span>No data available</span>
                    </div>
                </div>
            );
        }

        if (result.error) {
            return (
                <div className={`result-section ${type}`}>
                    <h4>{title}</h4>
                    <div className="error-message">
                        <span className="error-icon">❌</span>
                        <span>{result.error}</span>
                    </div>
                </div>
            );
        }

        const hasColumns = result.columns && result.columns.length > 0;
        const hasValues = result.values && result.values.length > 0;

        if (!hasValues) {
            return (
                <div className={`result-section ${type}`}>
                    <h4>{title}</h4>
                    <div className="empty-result">
                        No rows returned
                    </div>
                </div>
            );
        }

        return (
            <div className={`result-section ${type}`}>
                <h4>
                    {title}
                    <span className="row-count">{result.values.length} row(s)</span>
                </h4>
                <div className="table-wrapper">
                    <table role="table">
                        {hasColumns && (
                            <thead>
                                <tr>
                                    {result.columns.map((col, i) => (
                                        <th key={`${type}-header-${i}`}>{col}</th>
                                    ))}
                                </tr>
                            </thead>
                        )}
                        <tbody>
                            {result.values.slice(0, 50).map((row, rowIdx) => (
                                <tr key={`${type}-row-${rowIdx}`}>
                                    {row.map((cell, cellIdx) => (
                                        <td key={`${type}-cell-${rowIdx}-${cellIdx}`}>
                                            {cell === null || cell === undefined ? (
                                                <span className="null-value">NULL</span>
                                            ) : (
                                                String(cell)
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {result.values.length > 50 && (
                        <div className="more-rows">
                            Showing first 50 rows of {result.values.length}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className={`results-container ${isMobile ? 'mobile' : ''}`}>
            {isCorrect !== null && (
                <div className={`result-status ${isCorrect ? 'correct' : 'incorrect'}`} role="status" aria-live="polite">
                    {isCorrect ? (
                        <>
                            <span className="status-icon">✅</span>
                            <span>Correct! Your query produces the expected result.</span>
                        </>
                    ) : (
                        <>
                            <span className="status-icon">❌</span>
                            <span>Not quite right. Compare your result with the expected output.</span>
                        </>
                    )}
                </div>
            )}

            <div className={`results-grid ${isMobile ? 'stacked' : ''}`}>
                {!isMobile ? (
                    <>
                        {renderTable(userResult, 'Your Result', 'user')}
                        {renderTable(expectedResult, 'Expected Result', 'expected')}
                    </>
                ) : (
                    <>
                        {renderTable(userResult, 'Your Result', 'user')}
                        {isCorrect === false && renderTable(expectedResult, 'Expected Result', 'expected')}
                    </>
                )}
            </div>
        </div>
    );
}

export default ResultsTable;
