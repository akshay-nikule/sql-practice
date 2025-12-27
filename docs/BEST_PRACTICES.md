# SQL Practice - Production Best Practices Guide

## 1. Error Handling Strategy

### Principle: Fail Gracefully
Every operation should have a fallback:

```javascript
// ? Bad: Crashes silently
try {
  executeQuery(sql);
} catch (error) {
  // Ignoring error
}

// ? Good: Proper error handling
try {
  const result = executeQuery(sql);
  if (result.error) {
    return { 
      columns: [], 
      values: [], 
      error: 'Query execution failed. Please check your syntax.' 
    };
  }
  return result;
} catch (error) {
  console.error('Unexpected error:', error);
  return { 
    columns: [], 
    values: [], 
    error: 'An unexpected error occurred. Please try again.' 
  };
}
```

### Error Classification:
1. **User Errors**: Invalid query syntax, wrong database
   - Show helpful error messages
   - Suggest corrections
   
2. **System Errors**: Database initialization, storage quota
   - Log full error details
   - Show generic user-friendly message
   - Suggest action (reload page, clear cache)

3. **Network Errors**: Service Worker failures, offline
   - Gracefully degrade
   - Show offline status
   - Queue operations for later

---

## 2. Data Validation Pattern

### Always Validate User Input
```javascript
// ? Example: Query Validation
function validateQuery(sql) {
  // Check type
  if (!sql || typeof sql !== 'string') {
    return false;
  }
  
  // Check length
  const trimmed = sql.trim();
  if (trimmed.length === 0 || trimmed.length > 10000) {
    return false;
  }
  
  // Check content
  const upperSql = trimmed.toUpperCase();
  const dangerousKeywords = ['DROP', 'DELETE', 'ALTER'];
  if (dangerousKeywords.some(kw => upperSql.startsWith(kw))) {
    return false;
  }
  
  return true;
}

// ? Example: Storage Data Validation
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
        return parsed;
      }
    }
  } catch (e) {
    // Corrupted data - clear and use default
    localStorage.removeItem(STORAGE_KEY);
  }
  
  return getDefaultProgress();
}
```

### Validation Checklist:
- [ ] Type checking (`typeof`, `instanceof`, `Array.isArray`)
- [ ] Length/size bounds checking
- [ ] Null/undefined checking
- [ ] Format validation (email, URL, etc.)
- [ ] Range validation (min/max values)
- [ ] Enum validation (allowed values)

---

## 3. Performance Optimization

### Memoization Pattern
```javascript
// ? Memoize expensive computations
const filteredQuestions = useMemo(() => {
  return questions.filter(q => {
    // Complex filtering logic
    return true;
  });
}, [questions, filters.database, filters.difficulty]);

// ? Memoize event handlers
const handleSelectQuestion = useCallback((question) => {
  setCurrentQuestionId(question.id);
}, []);

// ? Memoize derived data
const questionStats = useMemo(() => ({
  total: questions.length,
  completed: questions.filter(q => isComplete(q)).length
}), [questions]);
```

### Performance Checklist:
- [ ] useCallback for event handlers
- [ ] useMemo for expensive computations
- [ ] Proper dependency arrays
- [ ] No inline function definitions in JSX
- [ ] No new object creation in render
- [ ] Lazy loading for components

---

## 4. State Management Best Practices

### Colocate State
```javascript
// ? Bad: Moving state up unnecessary
function App() {
  const [isEditorExpanded, setIsEditorExpanded] = useState(false);
  
  return <Editor isExpanded={isEditorExpanded} />;
}

// ? Good: Keep state where it's used
function App() {
  return <Editor />;
}

function Editor() {
  const [isExpanded, setIsExpanded] = useState(false);
  // ...
}
```

### Derived State
```javascript
// ? Bad: Redundant state
const [completed, setCompleted] = useState(0);
const [total, setTotal] = useState(0);

// ? Good: Compute from source
const completed = questions.filter(q => q.isComplete).length;
const total = questions.length;
```

### State Update Pattern
```javascript
// ? Good: Function-based updates
setCompletedQuestions(prev => [...prev, newId]);

// ? Good: Immutable updates
setFilters(prev => ({
  ...prev,
  keywords: [...prev.keywords, newKeyword]
}));

// ? Good: Atomic updates
setState(prev => ({
  ...prev,
  ...newChanges
}));
```

---

## 5. localStorage Management

### Quota Handling
```javascript
// ? Handle quota exceeded gracefully
export function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      // Clear non-critical data
      progress.savedQueries = {};
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        console.warn('Cleared saved queries to free space');
        return false; // Partial success
      } catch (clearError) {
        console.error('Cannot save any data:', clearError);
        return false;
      }
    }
    return false;
  }
}
```

### localStorage Best Practices:
- [ ] Always wrap in try-catch
- [ ] Check for null return values
- [ ] Validate parsed JSON
- [ ] Have fallback defaults
- [ ] Version data for migrations
- [ ] Monitor storage size
- [ ] Clear old/unused data

---

## 6. Async Operation Handling

### Pattern: Async Data Loading
```javascript
// ? Proper async handling
useEffect(() => {
  let isMounted = true;
  
  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await initDatabase(dbName);
      
      if (isMounted) {
        setData(result);
      }
    } catch (error) {
      if (isMounted) {
        setError(error.message);
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };
  
  loadData();
  
  // Cleanup
  return () => {
    isMounted = false;
  };
}, [dbName]);
```

### Promise Caching
```javascript
// ? Prevent duplicate async operations
let initPromise = null;

async function initSqlEngine() {
  if (SQL) return SQL;
  if (initPromise) return initPromise;
  
  initPromise = (async () => {
    try {
      const sql = await initSqlJs();
      SQL = sql;
      return sql;
    } catch (error) {
      initPromise = null;
      throw error;
    }
  })();
  
  return initPromise;
}
```

---

## 7. React Best Practices

### Component Structure
```javascript
// ? Good component structure
function MyComponent({ 
  // Props with defaults
  data = [],
  onAction = () => {},
  isLoading = false 
}) {
  // State
  const [state, setState] = useState(null);
  
  // Memoized values
  const memoizedData = useMemo(() => computeData(data), [data]);
  
  // Memoized callbacks
  const handleClick = useCallback(() => {
    onAction();
  }, [onAction]);
  
  // Effects (ordered by dependency)
  useEffect(() => {
    // Initialize
  }, []);
  
  useEffect(() => {
    // React to prop changes
  }, [data]);
  
  // Handlers
  const handleSubmit = (e) => {
    e.preventDefault();
    // ...
  };
  
  // Render
  return (
    <div>
      {/* Content */}
    </div>
  );
}
```

### Hook Rules
- [ ] Only call hooks at top level
- [ ] Only call hooks from React functions
- [ ] useEffect dependencies are complete
- [ ] useCallback dependencies are correct
- [ ] useMemo dependencies are optimal

---

## 8. Accessibility Standards

### ARIA Attributes
```javascript
// ? Proper ARIA usage
<button
  onClick={handleClick}
  type="button"
  aria-label="Delete question"
  aria-pressed={isSelected}
  aria-busy={isLoading}
  disabled={isDisabled}
>
  ?
</button>

// ? Dynamic content
<div role="status" aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

// ? Progress indication
<div role="progressbar" aria-valuenow={50} aria-valuemin="0" aria-valuemax="100">
  50%
</div>
```

### Keyboard Navigation
```javascript
// ? Handle keyboard activation
<div
  role="button"
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
  tabIndex={0}
>
  Clickable Area
</div>
```

### Accessibility Checklist:
- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Color contrast is sufficient
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Focus indicators visible
- [ ] Error messages are clear
- [ ] ARIA labels where needed

---

## 9. Testing Strategy

### Unit Test Example
```javascript
describe('database.js', () => {
  describe('validateQuery', () => {
    test('rejects DROP queries', () => {
      expect(validateQuery('DROP TABLE users')).toBe(false);
    });
    
    test('accepts SELECT queries', () => {
      expect(validateQuery('SELECT * FROM users')).toBe(true);
    });
    
    test('rejects non-string input', () => {
      expect(validateQuery(null)).toBe(false);
      expect(validateQuery(undefined)).toBe(false);
      expect(validateQuery(123)).toBe(false);
    });
  });
  
  describe('compareResults', () => {
    test('returns false if user has error', () => {
      const user = { error: 'Syntax error', columns: [], values: [] };
      const expected = { error: null, columns: ['id'], values: [[1]] };
      expect(compareResults(user, expected)).toBe(false);
    });
    
    test('returns true for matching results regardless of order', () => {
      const user = { 
        error: null, 
        columns: ['id', 'name'], 
        values: [[2, 'B'], [1, 'A']] 
      };
      const expected = { 
        error: null, 
        columns: ['id', 'name'], 
        values: [[1, 'A'], [2, 'B']] 
      };
      expect(compareResults(user, expected)).toBe(true);
    });
  });
});
```

### Testing Checklist:
- [ ] Happy path tests
- [ ] Error path tests
- [ ] Edge cases (null, empty, large values)
- [ ] Integration tests
- [ ] E2E tests
- [ ] Performance benchmarks
- [ ] Accessibility tests

---

## 10. Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] No console errors
- [ ] No console warnings
- [ ] Code reviewed
- [ ] Performance optimized
- [ ] Bundle size analyzed
- [ ] Error tracking configured

### Deployment
- [ ] Environment variables set
- [ ] Build successful
- [ ] Sourcemaps excluded from production
- [ ] Cache headers configured
- [ ] CDN configured
- [ ] SSL/TLS enabled
- [ ] Security headers set

### Post-Deployment
- [ ] Health checks passing
- [ ] Error tracking active
- [ ] Performance monitoring
- [ ] User feedback monitored
- [ ] Analytics verified
- [ ] Rollback plan ready

---

## 11. Debugging Tips

### Browser DevTools
```javascript
// ? Use debugger statement
function handleClick() {
  debugger; // Pauses execution
  doSomething();
}

// ? Use console methods
console.log('Variable:', variable);
console.warn('Warning:', warning);
console.error('Error:', error);
console.table(arrayOfObjects);
console.group('Group name');
console.time('timer-name');
```

### React DevTools
- Inspect component tree
- View props and state
- Track render reasons
- Profile performance

### Network DevTools
- Monitor API calls
- Check response times
- Verify caching
- Debug CORS issues

---

## 12. Documentation Guidelines

### Code Comments
```javascript
// ? Good: Explains WHY, not WHAT
// We cache the initialization promise to prevent multiple
// concurrent database initialization attempts
let initPromise = null;

// ? Bad: Explains obvious code
const name = 'John'; // Set name to John
```

### JSDoc Comments
```javascript
/**
 * Execute a SQL query on the current database
 * @param {string} sql - The SQL query to execute
 * @returns {{ columns: string[], values: any[][], error: string | null }}
 * @throws {Error} If database is not initialized
 */
export function executeQuery(sql) {
  // ...
}
```

### README Structure
- Overview
- Installation
- Usage
- API Documentation
- Configuration
- Contributing
- License

---

## 13. Security Best Practices

### Input Validation
- [ ] Validate all user input
- [ ] Sanitize for output context
- [ ] Use allowlists when possible
- [ ] Never trust client-side validation alone

### Output Encoding
- [ ] HTML encoding for HTML context
- [ ] URL encoding for URLs
- [ ] JSON encoding for JSON
- [ ] SQL parameterization (if backend)

### Storage Security
- [ ] Don't store sensitive data in localStorage
- [ ] Use HTTPS only
- [ ] Implement CSRF protection
- [ ] Set secure cookies

---

## 14. Monitoring & Logging

### Production Logging
```javascript
// ? Structured logging
console.error('Database initialization failed', {
  database: 'hospital',
  error: error.message,
  timestamp: new Date().toISOString(),
  userId: getCurrentUser()?.id
});

// ? Error tracking
if (typeof window !== 'undefined' && window.Sentry) {
  window.Sentry.captureException(error);
}
```

### Metrics to Track
- Page load time
- Query execution time
- Error rate
- Feature usage
- User retention

---

## 15. Common Pitfalls to Avoid

### ? Avoid:
1. **Modifying state directly**: Use setState
2. **Missing dependency arrays**: Add all dependencies
3. **Infinite loops**: Check effect dependencies
4. **Memory leaks**: Clean up in return function
5. **Unhandled promises**: Always add .catch()
6. **Console.logs in production**: Use proper logging
7. **Hardcoded values**: Use constants
8. **Global state**: Use Context API
9. **Prop drilling**: Use composition or Context
10. **Type coercion**: Use explicit type conversions

---

## Summary

This guide establishes patterns for:
- ? Robust error handling
- ? Input validation
- ? Performance optimization
- ? Proper state management
- ? Accessibility compliance
- ? Comprehensive testing
- ? Safe deployment
- ? Effective monitoring

By following these patterns, the SQL Practice application will be **reliable, performant, accessible, and maintainable**.

---

**Last Updated**: December 27, 2024
