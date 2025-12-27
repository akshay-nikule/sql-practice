import {
  validateQuery,
  compareResults,
  getTableNames,
  getTableSchema
} from '../../services/database';

describe('database.js - Query Validation', () => {
  describe('validateQuery', () => {
    test('accepts valid SELECT queries', () => {
      expect(validateQuery('SELECT * FROM users')).toBe(true);
      expect(validateQuery('SELECT id, name FROM users WHERE id = 1')).toBe(true);
      expect(validateQuery('  SELECT * FROM users  ')).toBe(true);
    });

    test('rejects DROP queries', () => {
      expect(validateQuery('DROP TABLE users')).toBe(false);
      expect(validateQuery('DROP DATABASE test')).toBe(false);
    });

    test('rejects DELETE queries', () => {
      expect(validateQuery('DELETE FROM users')).toBe(false);
    });

    test('rejects ALTER queries', () => {
      expect(validateQuery('ALTER TABLE users ADD COLUMN email')).toBe(false);
    });

    test('rejects TRUNCATE queries', () => {
      expect(validateQuery('TRUNCATE TABLE users')).toBe(false);
    });

    test('rejects PRAGMA queries', () => {
      expect(validateQuery('PRAGMA table_info(users)')).toBe(false);
    });

    test('rejects null input', () => {
      expect(validateQuery(null)).toBe(false);
      expect(validateQuery(undefined)).toBe(false);
    });

    test('rejects non-string input', () => {
      expect(validateQuery(123)).toBe(false);
      expect(validateQuery({})).toBe(false);
      expect(validateQuery([])).toBe(false);
    });

    test('rejects empty strings', () => {
      expect(validateQuery('')).toBe(false);
      expect(validateQuery('   ')).toBe(false);
    });

    test('rejects very long queries', () => {
      const longQuery = 'SELECT * FROM users WHERE ' + 'id = 1 OR '.repeat(2000);
      expect(validateQuery(longQuery)).toBe(false);
    });

    test('accepts queries with various SQL keywords', () => {
      expect(validateQuery('SELECT * FROM users WHERE active = true')).toBe(true);
      expect(validateQuery('SELECT * FROM users LIMIT 10')).toBe(true);
      expect(validateQuery('SELECT DISTINCT category FROM products')).toBe(true);
    });
  });

  describe('compareResults', () => {
    test('returns false if user result has error', () => {
      const userResult = { error: 'Syntax error', columns: [], values: [] };
      const expectedResult = { error: null, columns: ['id'], values: [[1]] };
      
      expect(compareResults(userResult, expectedResult)).toBe(false);
    });

    test('returns false if expected result has error', () => {
      const userResult = { error: null, columns: ['id'], values: [[1]] };
      const expectedResult = { error: 'Invalid query', columns: [], values: [] };
      
      expect(compareResults(userResult, expectedResult)).toBe(false);
    });

    test('returns false if column counts differ', () => {
      const userResult = { error: null, columns: ['id', 'name'], values: [[1, 'John']] };
      const expectedResult = { error: null, columns: ['id'], values: [[1]] };
      
      expect(compareResults(userResult, expectedResult)).toBe(false);
    });

    test('returns false if row counts differ', () => {
      const userResult = { error: null, columns: ['id'], values: [[1], [2]] };
      const expectedResult = { error: null, columns: ['id'], values: [[1]] };
      
      expect(compareResults(userResult, expectedResult)).toBe(false);
    });

    test('returns true for identical results', () => {
      const userResult = { error: null, columns: ['id', 'name'], values: [[1, 'John']] };
      const expectedResult = { error: null, columns: ['id', 'name'], values: [[1, 'John']] };
      
      expect(compareResults(userResult, expectedResult)).toBe(true);
    });

    test('returns true for results with same data but different order', () => {
      const userResult = { 
        error: null, 
        columns: ['id', 'name'], 
        values: [[2, 'Jane'], [1, 'John']] 
      };
      const expectedResult = { 
        error: null, 
        columns: ['id', 'name'], 
        values: [[1, 'John'], [2, 'Jane']] 
      };
      
      expect(compareResults(userResult, expectedResult)).toBe(true);
    });

    test('returns true for empty results', () => {
      const userResult = { error: null, columns: [], values: [] };
      const expectedResult = { error: null, columns: [], values: [] };
      
      expect(compareResults(userResult, expectedResult)).toBe(true);
    });

    test('handles null and undefined values correctly', () => {
      const userResult = { 
        error: null, 
        columns: ['id', 'email'], 
        values: [[1, null], [2, undefined]] 
      };
      const expectedResult = { 
        error: null, 
        columns: ['id', 'email'], 
        values: [[2, undefined], [1, null]] 
      };
      
      expect(compareResults(userResult, expectedResult)).toBe(true);
    });

    test('returns false for different data values', () => {
      const userResult = { 
        error: null, 
        columns: ['id', 'name'], 
        values: [[1, 'John']] 
      };
      const expectedResult = { 
        error: null, 
        columns: ['id', 'name'], 
        values: [[1, 'Jane']] 
      };
      
      expect(compareResults(userResult, expectedResult)).toBe(false);
    });
  });

  describe('Schema Methods', () => {
    test('getTableNames returns array', () => {
      const result = getTableNames();
      expect(Array.isArray(result)).toBe(true);
    });

    test('getTableSchema returns array', () => {
      const result = getTableSchema('users');
      expect(Array.isArray(result)).toBe(true);
    });

    test('getTableSchema handles invalid table names', () => {
      const result = getTableSchema(null);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });
});
