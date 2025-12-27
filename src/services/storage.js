const STORAGE_KEY = 'sql_practice_progress';
const STORAGE_VERSION = 1;

/**
 * Get saved progress from localStorage with version checking
 * @returns {{ currentQuestion: number, completedQuestions: string[], savedQueries: object }}
 */
export function getProgress() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            
            // Validate structure
            if (
                typeof parsed === 'object' &&
                Array.isArray(parsed.completedQuestions) &&
                typeof parsed.savedQueries === 'object'
            ) {
                return {
                    currentQuestion: parsed.currentQuestion || 0,
                    completedQuestions: parsed.completedQuestions || [],
                    savedQueries: parsed.savedQueries || {}
                };
            }
        }
    } catch (e) {
        console.warn('Failed to load progress:', e);
        // Clear corrupted data
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (clearError) {
            console.error('Failed to clear corrupted progress:', clearError);
        }
    }

    return {
        currentQuestion: 0,
        completedQuestions: [],
        savedQueries: {}
    };
}

/**
 * Save progress to localStorage with error handling
 * @param {object} progress - Progress object to save
 */
export function saveProgress(progress) {
    try {
        if (typeof progress !== 'object' || progress === null) {
            console.error('Invalid progress object');
            return false;
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        return true;
    } catch (e) {
        console.warn('Failed to save progress:', e);
        // Handle quota exceeded
        if (e.name === 'QuotaExceededError') {
            try {
                // Attempt to clear old saved queries to free space
                const progress = getProgress();
                progress.savedQueries = {};
                localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
                console.warn('Cleared saved queries to free space');
                return false;
            } catch (clearError) {
                console.error('Failed to clear queries:', clearError);
                return false;
            }
        }
        return false;
    }
}

/**
 * Mark a question as completed
 * @param {string | number} questionId - The question ID to mark complete
 */
export function markQuestionComplete(questionId) {
    const progress = getProgress();
    const idStr = String(questionId);
    
    if (!progress.completedQuestions.includes(idStr)) {
        progress.completedQuestions.push(idStr);
        return saveProgress(progress);
    }
    
    return true;
}

/**
 * Save the current question
 * @param {string | number} questionId - Current question ID
 */
export function saveCurrentQuestion(questionId) {
    const progress = getProgress();
    progress.currentQuestion = questionId;
    return saveProgress(progress);
}

/**
 * Save a query for a specific question
 * @param {string | number} questionId - The question ID
 * @param {string} query - The SQL query to save
 */
export function saveQuery(questionId, query) {
    if (typeof query !== 'string') {
        console.warn('Query must be a string');
        return false;
    }

    const progress = getProgress();
    const idStr = String(questionId);
    progress.savedQueries[idStr] = query.trim();
    return saveProgress(progress);
}

/**
 * Get saved query for a question
 * @param {string | number} questionId - The question ID
 * @returns {string}
 */
export function getSavedQuery(questionId) {
    const progress = getProgress();
    const idStr = String(questionId);
    return progress.savedQueries[idStr] || '';
}

/**
 * Check if a question is completed
 * @param {string | number} questionId - The question ID
 * @returns {boolean}
 */
export function isQuestionComplete(questionId) {
    const progress = getProgress();
    return progress.completedQuestions.includes(String(questionId));
}

/**
 * Reset all progress with confirmation
 * @returns {boolean} - Whether reset was successful
 */
export function resetProgress() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        return true;
    } catch (e) {
        console.error('Failed to reset progress:', e);
        return false;
    }
}

/**
 * Export progress as JSON (for backup)
 * @returns {string} - JSON string of progress
 */
export function exportProgress() {
    try {
        const progress = getProgress();
        return JSON.stringify(progress, null, 2);
    } catch (e) {
        console.error('Failed to export progress:', e);
        return '';
    }
}

/**
 * Import progress from JSON
 * @param {string} jsonString - JSON string of progress
 * @returns {boolean} - Whether import was successful
 */
export function importProgress(jsonString) {
    try {
        const progress = JSON.parse(jsonString);
        if (
            typeof progress === 'object' &&
            Array.isArray(progress.completedQuestions) &&
            typeof progress.savedQueries === 'object'
        ) {
            return saveProgress(progress);
        }
        console.error('Invalid progress format');
        return false;
    } catch (e) {
        console.error('Failed to import progress:', e);
        return false;
    }
}
