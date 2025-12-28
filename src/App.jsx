import { useState, useEffect, useCallback, useMemo } from 'react';
import { useIsDesktop } from './hooks/useMediaQuery';
import Header from './components/Header';
import QuestionPanel from './components/QuestionPanel';
import SqlEditor from './components/SqlEditor';
import ResultsTable from './components/ResultsTable';
import FilterPanel from './components/FilterPanel';
import QuestionCard from './components/QuestionCard';
import SchemaViewer from './components/SchemaViewer';
import {
  initDatabase,
  executeQuery,
  getExpectedResult,
  compareResults,
  isDatabaseReady,
  getAvailableDatabases,
  switchDatabase,
  getCurrentDatabase
} from './services/database';
import {
  getProgress,
  saveCurrentQuestion,
  markQuestionComplete,
  getSavedQuery,
  saveQuery,
  resetProgress
} from './services/storage';
import questionsData from './data/questions.json';
import './App.css';

// View modes
const VIEW_MODES = {
  SELECTION: 'selection',
  PRACTICE: 'practice'
};

function App() {
  const isDesktop = useIsDesktop();
  
  const [isLoading, setIsLoading] = useState(true);
  const [dbReady, setDbReady] = useState(false);
  const [initError, setInitError] = useState(null);
  const [viewMode, setViewMode] = useState(VIEW_MODES.SELECTION);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [hasExecuted, setHasExecuted] = useState(false);
  const [userResult, setUserResult] = useState({ columns: [], values: [], error: null });
  const [expectedResult, setExpectedResult] = useState({ columns: [], values: [], error: null });
  const [isCorrect, setIsCorrect] = useState(null);
  const [completedQuestions, setCompletedQuestions] = useState([]);
  
  // Mobile/Tablet sheet states
  const [showQuestionsSheet, setShowQuestionsSheet] = useState(false);
  const [showSchemaSheet, setShowSchemaSheet] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    database: 'hospital',
    difficulty: 'all',
    completion: 'all',
    keywords: []
  });

  const questions = questionsData.questions || [];
  const databases = getAvailableDatabases();

  const currentQuestion = useMemo(() =>
    questions.find(q => q.id === currentQuestionId),
    [questions, currentQuestionId]
  );

  // Filter questions based on current filters
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      // Database filter
      if (q.database !== filters.database) return false;

      // Difficulty filter
      if (filters.difficulty !== 'all' && q.difficulty !== filters.difficulty) return false;

      // Completion filter
      const isComplete = completedQuestions.includes(q.id);
      if (filters.completion === 'complete' && !isComplete) return false;
      if (filters.completion === 'incomplete' && isComplete) return false;

      // Keywords filter
      if (filters.keywords.length > 0) {
        const qKeywords = q.keywords || [];
        const hasKeyword = filters.keywords.some(kw =>
          qKeywords.some(qkw => qkw && qkw.toLowerCase().includes(kw.toLowerCase()))
        );
        if (!hasKeyword) return false;
      }

      return true;
    });
  }, [questions, filters, completedQuestions]);

  // Question stats
  const questionStats = useMemo(() => {
    const dbQuestions = questions.filter(q => q.database === filters.database);
    return {
      total: dbQuestions.length,
      filtered: filteredQuestions.length,
      completed: dbQuestions.filter(q => completedQuestions.includes(q.id)).length
    };
  }, [questions, filters.database, filteredQuestions, completedQuestions]);

  // Initialize database
  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        setInitError(null);
        
        await initDatabase(filters.database);
        setDbReady(true);

        // Load saved progress
        const progress = getProgress();
        setCompletedQuestions(progress.completedQuestions || []);
      } catch (error) {
        console.error('Failed to initialize database:', error);
        setInitError(error.message || 'Failed to initialize database');
        setDbReady(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    init();
  }, []);

  // Switch database when filter changes
  useEffect(() => {
    const switchDb = async () => {
      if (dbReady && filters.database !== getCurrentDatabase()) {
        try {
          await switchDatabase(filters.database);
        } catch (error) {
          console.error('Failed to switch database:', error);
          setInitError(error.message || 'Failed to switch database');
        }
      }
    };
    
    switchDb();
  }, [filters.database, dbReady]);

  // Reset results when changing questions
  useEffect(() => {
    setHasExecuted(false);
    setUserResult({ columns: [], values: [], error: null });
    setExpectedResult({ columns: [], values: [], error: null });
    setIsCorrect(null);
    setShowHint(false);
  }, [currentQuestionId]);

  const handleExecuteQuery = useCallback((query) => {
    if (!isDatabaseReady() || !currentQuestion) {
      setUserResult({ columns: [], values: [], error: 'Database not ready' });
      return;
    }

    setIsExecuting(true);
    setHasExecuted(true);

    try {
      const userRes = executeQuery(query);
      const expectedRes = getExpectedResult(currentQuestion.expectedQuery);
      const correct = compareResults(userRes, expectedRes);

      setUserResult(userRes);
      setExpectedResult(expectedRes);
      setIsCorrect(correct);

      // Save query
      saveQuery(currentQuestion.id, query);

      // Mark as complete if correct
      if (correct && !completedQuestions.includes(currentQuestion.id)) {
        markQuestionComplete(currentQuestion.id);
        setCompletedQuestions(prev => [...prev, currentQuestion.id]);
      }
    } catch (error) {
      console.error('Error executing query:', error);
      setUserResult({ 
        columns: [], 
        values: [], 
        error: 'An error occurred while executing your query' 
      });
      setIsCorrect(false);
    } finally {
      setIsExecuting(false);
    }
  }, [currentQuestion, completedQuestions]);

  const handleSelectQuestion = useCallback((question) => {
    // Switch database if needed
    if (question.database !== filters.database) {
      setFilters(prev => ({ ...prev, database: question.database }));
    }
    setCurrentQuestionId(question.id);
    setViewMode(VIEW_MODES.PRACTICE);
    saveCurrentQuestion(question.id);
    
    // Close mobile sheets after selection
    if (!isDesktop) {
      setShowQuestionsSheet(false);
    }
  }, [filters.database, isDesktop]);

  const handleBackToSelection = useCallback(() => {
    setViewMode(VIEW_MODES.SELECTION);
    setCurrentQuestionId(null);
  }, []);

  const handleNavigate = useCallback((direction) => {
    const currentIndex = filteredQuestions.findIndex(q => q.id === currentQuestionId);
    let newIndex = currentIndex + direction;

    if (newIndex < 0) newIndex = 0;
    if (newIndex >= filteredQuestions.length) newIndex = filteredQuestions.length - 1;

    if (newIndex !== currentIndex && filteredQuestions[newIndex]) {
      handleSelectQuestion(filteredQuestions[newIndex]);
    }
  }, [filteredQuestions, currentQuestionId, handleSelectQuestion]);

  const handleReset = useCallback(() => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      const success = resetProgress();
      if (success) {
        setCompletedQuestions([]);
        setCurrentQuestionId(null);
        setViewMode(VIEW_MODES.SELECTION);
        setHasExecuted(false);
        setUserResult({ columns: [], values: [], error: null });
        setExpectedResult({ columns: [], values: [], error: null });
        setIsCorrect(null);
      } else {
        alert('Failed to reset progress. Please try again.');
      }
    }
  }, []);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loader">
          <div className="loader-icon">⚡</div>
          <h2>Loading SQL Practice...</h2>
          <p>Initializing databases</p>
        </div>
      </div>
    );
  }

  if (!dbReady) {
    return (
      <div className="error-screen">
        <div className="error-content">
          <div className="error-icon">❌</div>
          <h2>Failed to Initialize</h2>
          <p>{initError || 'Could not load the SQLite database. Please refresh the page.'}</p>
          <button onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      </div>
    );
  }

  // Question Selection View
  if (viewMode === VIEW_MODES.SELECTION) {
    return (
      <div className="app selection-app">
        <Header onReset={handleReset} isDesktop={isDesktop} />

        <main className="main-content selection-view">
          <div className="selection-left">
            <div className="selection-header">
              <h2>Question Selection</h2>
              <p>Choose a question to practice</p>
            </div>

            <div className="question-list">
              {filteredQuestions.length === 0 ? (
                <div className="no-questions">
                  <p>No questions match your filters.</p>
                  <button onClick={() => setFilters(prev => ({ ...prev, keywords: [], difficulty: 'all', completion: 'all' }))}>
                    Clear Filters
                  </button>
                </div>
              ) : (
                filteredQuestions.map(question => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    isCompleted={completedQuestions.includes(question.id)}
                    isActive={currentQuestionId === question.id}
                    onClick={() => handleSelectQuestion(question)}
                  />
                ))
              )}
            </div>
          </div>

          {isDesktop && (
            <div className="selection-right">
              <FilterPanel
                filters={filters}
                onFilterChange={setFilters}
                databases={databases}
                questionStats={questionStats}
              />

              <SchemaViewer currentDatabase={filters.database} />
            </div>
          )}
        </main>
      </div>
    );
  }

  // Practice View
  const currentIndex = filteredQuestions.findIndex(q => q.id === currentQuestionId);

  return (
    <div className="app practice-app">
      <Header 
        onReset={handleReset}
        isDesktop={isDesktop}
        currentDatabase={filters.database}
        onDatabaseChange={(db) => setFilters(prev => ({ ...prev, database: db }))}
        onShowQuestions={() => setShowQuestionsSheet(true)}
      />

      <main className="main-content practice-view">
        {isDesktop ? (
          <>
            <div className="left-panel">
              <button className="back-btn" onClick={handleBackToSelection}>
                ← Back to Questions
              </button>

              <QuestionPanel
                question={currentQuestion}
                currentIndex={currentIndex}
                totalQuestions={filteredQuestions.length}
                onPrevious={() => handleNavigate(-1)}
                onNext={() => handleNavigate(1)}
                isCompleted={completedQuestions.includes(currentQuestion?.id)}
                showHint={showHint}
                onToggleHint={() => setShowHint(!showHint)}
                databaseName={filters.database}
              />

              <SchemaViewer currentDatabase={filters.database} />
            </div>

            <div className="right-panel">
              <SqlEditor
                onExecute={handleExecuteQuery}
                savedQuery={getSavedQuery(currentQuestion?.id)}
                isLoading={isExecuting}
              />

              <ResultsTable
                userResult={userResult}
                expectedResult={expectedResult}
                isCorrect={isCorrect}
                hasExecuted={hasExecuted}
              />
            </div>
          </>
        ) : (
          <>
            <div className="mobile-container">
              <div className="mobile-question-banner">
                <h3>{currentQuestion?.title || 'Loading...'}</h3>
                <span className={`difficulty ${getDifficultyClass(currentQuestion?.difficulty)}`}>
                  {currentQuestion?.difficulty}
                </span>
              </div>

              <SqlEditor
                onExecute={handleExecuteQuery}
                savedQuery={getSavedQuery(currentQuestion?.id)}
                isLoading={isExecuting}
                isMobile={true}
              />

              <ResultsTable
                userResult={userResult}
                expectedResult={expectedResult}
                isCorrect={isCorrect}
                hasExecuted={hasExecuted}
                isMobile={true}
              />

              <button 
                className="mobile-fab"
                onClick={() => setShowSchemaSheet(true)}
                title="View Schema"
              >
                📊
              </button>
            </div>

            {/* Mobile Sheets */}
            {showQuestionsSheet && (
              <MobileQuestionsSheet
                questions={filteredQuestions}
                currentQuestionId={currentQuestionId}
                completedQuestions={completedQuestions}
                onSelectQuestion={handleSelectQuestion}
                onClose={() => setShowQuestionsSheet(false)}
              />
            )}

            {showSchemaSheet && (
              <MobileSchemaSheet
                currentDatabase={filters.database}
                onClose={() => setShowSchemaSheet(false)}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

function getDifficultyClass(difficulty) {
  switch (difficulty?.toLowerCase()) {
    case 'easy': return 'difficulty-easy';
    case 'medium': return 'difficulty-medium';
    case 'hard': return 'difficulty-hard';
    default: return '';
  }
}

function MobileQuestionsSheet({ questions, currentQuestionId, completedQuestions, onSelectQuestion, onClose }) {
  return (
    <div className="mobile-sheet-overlay" onClick={onClose}>
      <div className="mobile-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="mobile-sheet-header">
          <h3>Questions</h3>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>
        <div className="mobile-sheet-content">
          {questions.map(q => (
            <div
              key={q.id}
              className={`mobile-question-item ${currentQuestionId === q.id ? 'active' : ''} ${completedQuestions.includes(q.id) ? 'completed' : ''}`}
              onClick={() => onSelectQuestion(q)}
            >
              <div className="question-item-content">
                <strong>{q.title}</strong>
                <small>{q.category}</small>
              </div>
              {completedQuestions.includes(q.id) && <span className="check-mark">✓</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileSchemaSheet({ currentDatabase, onClose }) {
  return (
    <div className="mobile-sheet-overlay" onClick={onClose}>
      <div className="mobile-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="mobile-sheet-header">
          <h3>Schema - {currentDatabase}</h3>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>
        <div className="mobile-sheet-content">
          <SchemaViewer currentDatabase={currentDatabase} />
        </div>
      </div>
    </div>
  );
}

export default App;
