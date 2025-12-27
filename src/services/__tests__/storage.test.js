import {
  getProgress,
  saveProgress,
  saveQuery,
  getSavedQuery,
  markQuestionComplete,
  isQuestionComplete,
  resetProgress,
  exportProgress,
  importProgress
} from '../../services/storage';

describe('storage.js - Progress Management', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.getItem.mockReturnValue(null);
  });

  describe('getProgress', () => {
    test('returns default progress when nothing saved', () => {
      const progress = getProgress();
      
      expect(progress).toEqual({
        currentQuestion: 0,
        completedQuestions: [],
        savedQueries: {}
      });
    });

    test('returns saved progress when available', () => {
      const testProgress = {
        currentQuestion: 5,
        completedQuestions: [1, 2, 3],
        savedQueries: { '1': 'SELECT * FROM users' }
      };

      localStorage.getItem.mockReturnValue(JSON.stringify(testProgress));
      const progress = getProgress();

      expect(progress).toEqual(testProgress);
    });

    test('returns default progress on corrupted data', () => {
      localStorage.getItem.mockReturnValue('corrupted data');
      
      const progress = getProgress();

      expect(progress).toEqual({
        currentQuestion: 0,
        completedQuestions: [],
        savedQueries: {}
      });
    });

    test('returns default progress on invalid structure', () => {
      localStorage.getItem.mockReturnValue(JSON.stringify({
        currentQuestion: 5,
        // Missing required fields
      }));

      const progress = getProgress();

      expect(progress).toEqual({
        currentQuestion: 0,
        completedQuestions: [],
        savedQueries: {}
      });
    });
  });

  describe('saveProgress', () => {
    test('saves valid progress object', () => {
      const progress = {
        currentQuestion: 5,
        completedQuestions: [1, 2],
        savedQueries: {}
      };

      const result = saveProgress(progress);

      expect(result).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'sql_practice_progress',
        JSON.stringify(progress)
      );
    });

    test('returns false for invalid input', () => {
      const result = saveProgress(null);
      expect(result).toBe(false);
    });

    test('returns false for non-object input', () => {
      expect(saveProgress('string')).toBe(false);
      expect(saveProgress(123)).toBe(false);
    });
  });

  describe('saveQuery', () => {
    test('saves query for a question', () => {
      const questionId = 1;
      const query = 'SELECT * FROM users';

      saveQuery(questionId, query);

      expect(localStorage.setItem).toHaveBeenCalled();
    });

    test('returns false for non-string query', () => {
      const result = saveQuery(1, { query: 'test' });
      expect(result).toBe(false);
    });

    test('trims query before saving', () => {
      const questionId = 1;
      const query = '  SELECT * FROM users  ';

      saveQuery(questionId, query);

      const callArgs = localStorage.setItem.mock.calls[0];
      const savedData = JSON.parse(callArgs[1]);
      expect(savedData.savedQueries['1']).toBe('SELECT * FROM users');
    });
  });

  describe('getSavedQuery', () => {
    test('returns empty string when no query saved', () => {
      const query = getSavedQuery(999);
      expect(query).toBe('');
    });

    test('returns saved query for question', () => {
      localStorage.getItem.mockReturnValue(
        JSON.stringify({
          currentQuestion: 0,
          completedQuestions: [],
          savedQueries: { '1': 'SELECT * FROM users' }
        })
      );

      const query = getSavedQuery(1);
      expect(query).toBe('SELECT * FROM users');
    });

    test('handles string and number IDs', () => {
      localStorage.getItem.mockReturnValue(
        JSON.stringify({
          currentQuestion: 0,
          completedQuestions: [],
          savedQueries: { '1': 'SELECT * FROM users' }
        })
      );

      expect(getSavedQuery(1)).toBe('SELECT * FROM users');
      expect(getSavedQuery('1')).toBe('SELECT * FROM users');
    });
  });

  describe('markQuestionComplete', () => {
    test('marks question as completed', () => {
      markQuestionComplete(1);

      expect(localStorage.setItem).toHaveBeenCalled();
      const callArgs = localStorage.setItem.mock.calls[0];
      const savedData = JSON.parse(callArgs[1]);
      expect(savedData.completedQuestions).toContain('1');
    });

    test('does not duplicate completed questions', () => {
      localStorage.getItem.mockReturnValue(
        JSON.stringify({
          currentQuestion: 0,
          completedQuestions: ['1'],
          savedQueries: {}
        })
      );

      markQuestionComplete(1);

      const callArgs = localStorage.setItem.mock.calls[0];
      const savedData = JSON.parse(callArgs[1]);
      expect(savedData.completedQuestions).toEqual(['1']);
    });
  });

  describe('isQuestionComplete', () => {
    test('returns false when question not completed', () => {
      localStorage.getItem.mockReturnValue(
        JSON.stringify({
          currentQuestion: 0,
          completedQuestions: [],
          savedQueries: {}
        })
      );

      expect(isQuestionComplete(1)).toBe(false);
    });

    test('returns true when question completed', () => {
      localStorage.getItem.mockReturnValue(
        JSON.stringify({
          currentQuestion: 0,
          completedQuestions: ['1'],
          savedQueries: {}
        })
      );

      expect(isQuestionComplete(1)).toBe(true);
    });
  });

  describe('resetProgress', () => {
    test('clears all progress', () => {
      resetProgress();

      expect(localStorage.removeItem).toHaveBeenCalledWith('sql_practice_progress');
    });

    test('returns true on success', () => {
      const result = resetProgress();
      expect(result).toBe(true);
    });
  });

  describe('exportProgress', () => {
    test('exports progress as JSON string', () => {
      localStorage.getItem.mockReturnValue(
        JSON.stringify({
          currentQuestion: 5,
          completedQuestions: [1, 2],
          savedQueries: { '1': 'SELECT *' }
        })
      );

      const exported = exportProgress();
      const parsed = JSON.parse(exported);

      expect(parsed.currentQuestion).toBe(5);
      expect(parsed.completedQuestions).toContain(1);
    });

    test('returns empty string on error', () => {
      localStorage.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = exportProgress();
      expect(result).toBe('');
    });
  });

  describe('importProgress', () => {
    test('imports valid progress JSON', () => {
      const progressJson = JSON.stringify({
        currentQuestion: 5,
        completedQuestions: [1, 2],
        savedQueries: { '1': 'SELECT *' }
      });

      const result = importProgress(progressJson);
      expect(result).toBe(true);
    });

    test('returns false for invalid JSON', () => {
      const result = importProgress('invalid json');
      expect(result).toBe(false);
    });

    test('returns false for missing required fields', () => {
      const invalidJson = JSON.stringify({
        currentQuestion: 5
        // Missing completedQuestions and savedQueries
      });

      const result = importProgress(invalidJson);
      expect(result).toBe(false);
    });

    test('returns false for non-object data', () => {
      const result = importProgress(JSON.stringify(['array']));
      expect(result).toBe(false);
    });
  });
});
