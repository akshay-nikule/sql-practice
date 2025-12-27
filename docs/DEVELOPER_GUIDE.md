# SQL Practice - Developer Quick Start Guide

## ?? Getting Started

### Prerequisites
- Node.js 16+ 
- npm 7+
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## ?? Project Structure

```
sql-practice/
??? src/
?   ??? components/          # React components
?   ?   ??? Header.jsx
?   ?   ??? SqlEditor.jsx
?   ?   ??? ResultsTable.jsx
?   ?   ??? QuestionPanel.jsx
?   ?   ??? QuestionCard.jsx
?   ?   ??? FilterPanel.jsx
?   ?   ??? SchemaViewer.jsx
?   ?   ??? ProgressBar.jsx
?   ??? services/            # Business logic
?   ?   ??? database.js      # SQL.js wrapper with validation
?   ?   ??? storage.js       # localStorage management
?   ??? context/             # React Context
?   ?   ??? ThemeContext.jsx
?   ??? data/                # Static data
?   ?   ??? questions.json
?   ?   ??? schema.sql
?   ?   ??? databases/
?   ?   ?   ??? hospital.sql
?   ?   ?   ??? university.sql
?   ?   ?   ??? company.sql
?   ??? assets/              # Images and static files
?   ??? App.jsx              # Main app component
?   ??? main.jsx             # Entry point
?   ??? App.css              # Global styles
?   ??? index.css
??? public/                  # Public assets
??? dist/                    # Production build output
??? package.json
??? vite.config.js           # Vite configuration
??? eslint.config.js         # ESLint configuration
??? BEST_PRACTICES.md        # Development guidelines
```

---

## ?? Key Files & Their Purpose

### Services Layer

#### `src/services/database.js`
Handles all SQL.js operations:
- `initDatabase(dbName)` - Initialize database
- `executeQuery(sql)` - Execute SQL with validation
- `compareResults(user, expected)` - Compare results
- `getTableNames()` - Get database tables
- `getTableSchema(table)` - Get table structure

**Key Feature**: Query validation prevents dangerous operations

```javascript
import { 
  initDatabase, 
  executeQuery, 
  compareResults 
} from './services/database';

// Execute query with automatic validation
const result = executeQuery('SELECT * FROM users');
if (result.error) {
  console.error('Query failed:', result.error);
} else {
  console.log('Results:', result.values);
}
```

#### `src/services/storage.js`
Manages user progress in localStorage:
- `saveProgress(data)` - Save progress with quota handling
- `getProgress()` - Load progress with validation
- `markQuestionComplete(id)` - Mark question as done
- `saveQuery(id, sql)` - Save query for later
- `importProgress(json)` / `exportProgress()` - Backup/restore

**Key Feature**: Automatic quota management prevents crashes

```javascript
import { 
  getProgress, 
  saveQuery, 
  markQuestionComplete 
} from './services/storage';

// Save work
saveQuery(questionId, sqlCode);

// Mark as complete
markQuestionComplete(questionId);

// Load progress
const progress = getProgress();
console.log('Completed:', progress.completedQuestions);
```

### Context Layer

#### `src/context/ThemeContext.jsx`
Global theme management:
- `useTheme()` - Hook to access theme
- `toggleTheme()` - Switch between light/dark

```javascript
import { useTheme } from './context/ThemeContext';

function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Current: {theme}
    </button>
  );
}
```

### Main App Component

#### `src/App.jsx`
Main application logic:
- Routes between question selection and practice views
- Manages all major state
- Handles database switching
- Coordinates question execution

**Key State**:
```javascript
const [viewMode, setViewMode] = useState('selection'); // selection | practice
const [currentQuestionId, setCurrentQuestionId] = useState(null);
const [filters, setFilters] = useState({
  database: 'hospital',
  difficulty: 'all',
  completion: 'all',
  keywords: []
});
```

---

## ?? Component Architecture

### Top-Level Data Flow
```
App
??? Header (theme, reset)
??? Main Content
?   ??? Question Selection View
?   ?   ??? QuestionList ? QuestionCard (x multiple)
?   ?   ??? FilterPanel
?   ?   ??? SchemaViewer
?   ?
?   ??? Practice View
?       ??? LeftPanel
?       ?   ??? QuestionPanel
?       ?   ??? SchemaViewer
?       ??? RightPanel
?           ??? SqlEditor
?           ??? ResultsTable
```

### Component Responsibilities

| Component | Props | State | Purpose |
|-----------|-------|-------|---------|
| Header | onReset | - | Top navigation, theme toggle |
| QuestionCard | question, isCompleted, onClick | - | Display single question |
| FilterPanel | filters, onFilterChange | - | Filter questions |
| SqlEditor | onExecute, savedQuery | query | SQL input and execution |
| ResultsTable | userResult, expectedResult | - | Display query results |
| QuestionPanel | question, showHint | - | Display question details |
| SchemaViewer | currentDatabase | tables, schemas | Show database schema |
| ProgressBar | completed, total, questions | - | Show progress |

---

## ?? Common Workflows

### Adding a New Question
1. Edit `src/data/questions.json`
2. Add question object:
```json
{
  "id": 101,
  "title": "Question Title",
  "description": "What to do",
  "category": "Joins",
  "keywords": ["join", "select"],
  "difficulty": "medium",
  "database": "hospital",
  "hint": "Try using INNER JOIN",
  "expectedQuery": "SELECT * FROM ...",
  "expectedOutput": {
    "columns": ["col1", "col2"],
    "rows": [[1, 'a'], [2, 'b']]
  }
}
```

### Adding a New Database
1. Create SQL schema file in `src/data/databases/`
2. Import in `src/services/database.js`:
```javascript
import newdbSQL from '../data/databases/newdb.sql?raw';
```
3. Add to databases object:
```javascript
const databases = {
  // ... existing
  newdb: { sql: newdbSQL, db: null }
};
```
4. Update questions.json with new database reference

### Modifying Error Handling
Look for try-catch blocks:
```javascript
try {
  // Operation
} catch (error) {
  console.error('Context:', error);
  // Handle gracefully
}
```

---

## ?? Debugging Tips

### Browser DevTools
1. **Console**: Check for errors
```javascript
console.log('Debug:', variable);
console.error('Error:', error);
console.table(arrayOfObjects);
```

2. **Application Tab**: Check localStorage
- `sql_practice_progress` - User progress
- `sql_practice_theme` - Theme preference

3. **React DevTools**: Inspect components
- View props and state
- Track re-renders
- Profile performance

### Common Issues

**Issue**: Query not saving
- Check localStorage quota (F12 > Application)
- Check browser console for errors
- Verify saveQuery is called

**Issue**: Schema not loading
- Check if database is initialized
- Verify table names in database
- Check browser console

**Issue**: Results not showing
- Check if query executed successfully
- Check for SQL syntax errors
- Verify expected query is valid

---

## ??? Development Commands

### Start Development
```bash
npm run dev
```
Starts Vite dev server on http://localhost:5173

### Build for Production
```bash
npm run build
```
Creates optimized build in `dist/` directory

### Preview Build
```bash
npm run preview
```
Serve the production build locally

### Lint Code
```bash
npm run lint
```
Check code for style issues

---

## ?? Code Style Guide

### Function Naming
```javascript
// ? Good
handleExecuteQuery()
validateQuery()
saveProgress()

// ? Avoid
executeQuery()  // confusing with service function
process()       // too generic
save()          # too generic
```

### Component Structure
```javascript
// ? Good order
function Component({ prop1, prop2 = 'default' }) {
  // 1. State
  const [state, setState] = useState();
  
  // 2. Memoized values
  const memoized = useMemo(() => {}, [deps]);
  
  // 3. Memoized callbacks
  const handler = useCallback(() => {}, [deps]);
  
  // 4. Effects
  useEffect(() => {}, [deps]);
  
  // 5. Event handlers
  const handleClick = () => {};
  
  // 6. Render
  return <div>{/* JSX */}</div>;
}
```

### Error Messages
```javascript
// ? User-friendly
"Query syntax error. Check your WHERE clause."

// ? Technical
"SyntaxError: Unexpected token WHERE"
```

---

## ?? Testing Commands (When Tests Added)

```bash
# Run unit tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- FilterPanel.test.jsx

# Watch mode
npm test -- --watch
```

---

## ?? Important Imports

### Services
```javascript
import { 
  initDatabase, 
  executeQuery, 
  compareResults,
  isDatabaseReady 
} from './services/database';

import {
  getProgress,
  saveProgress,
  getSavedQuery,
  saveQuery,
  markQuestionComplete
} from './services/storage';
```

### Context
```javascript
import { useTheme } from './context/ThemeContext';
```

### Data
```javascript
import questionsData from './data/questions.json';
```

---

## ?? Security Considerations

### Input Validation
All queries are validated before execution:
```javascript
validateQuery(sql) // Blocks DROP, DELETE, ALTER, etc.
```

### Data Validation
localStorage data is validated on load:
```javascript
getProgress() // Returns default if corrupted
```

### Safe JSON Operations
```javascript
try {
  JSON.parse(data);
} catch (e) {
  // Use default
}
```

---

## ? Performance Tips

### Avoid
```javascript
// ? Creates new function on every render
<button onClick={() => handleClick()}>Click</button>

// ? Creates new object on every render
const obj = { x: 1, y: 2 };

// ? Missing dependencies
useEffect(() => {}, [])
```

### Use Instead
```javascript
// ? Memoized callback
const handleClick = useCallback(() => {}, [deps]);
<button onClick={handleClick}>Click</button>

// ? Memoized object
const obj = useMemo(() => ({ x: 1, y: 2 }), [deps]);

// ? Complete dependencies
useEffect(() => {}, [dep1, dep2])
```

---

## ?? Deployment

### Build
```bash
npm run build
```
Creates `dist/` directory ready for deployment

### Serve
Deploy the `dist/` directory to your hosting:
```bash
# Using simple HTTP server
npx http-server dist/

# Or deploy to production server
# (AWS, Netlify, Vercel, etc.)
```

### Environment Setup
1. Set up error tracking (Sentry)
2. Configure analytics
3. Set up monitoring
4. Configure caching headers

---

## ?? Getting Help

### Documentation
- `docs/BEST_PRACTICES.md` - How to code
- `docs/TESTING.md` - Testing information
- `docs/CONTRIBUTING.md` - Contributing guidelines

### Debugging
1. Check browser console (F12)
2. Check localStorage (F12 > Application)
3. Use React DevTools extension
4. Check network requests (F12 > Network)

### Common Solutions

**App won't load**
- Clear cache (Ctrl+Shift+Delete)
- Check localStorage quota
- Open browser console for errors

**Query results wrong**
- Check expected query syntax
- Verify data in database
- Compare with expected results

**Progress not saving**
- Check localStorage is enabled
- Check storage quota
- Try clearing old data

---

## ? Pre-Commit Checklist

Before committing code:
- [ ] Code follows style guide
- [ ] Tests pass (when added)
- [ ] No console errors
- [ ] No console warnings
- [ ] Built successfully
- [ ] No hardcoded values
- [ ] Proper error handling
- [ ] Comments for complex logic

---

## ?? Quick Reference

### Key Files to Know
| Task | File |
|------|------|
| Add question | `src/data/questions.json` |
| Modify database | `src/data/databases/*.sql` |
| Fix validation | `src/services/database.js` |
| Fix storage | `src/services/storage.js` |
| Add feature | `src/App.jsx` |
| Style component | `src/components/*.css` |

### Key Functions
| Function | Purpose |
|----------|---------|
| `initDatabase()` | Initialize DB |
| `executeQuery()` | Run SQL with validation |
| `saveProgress()` | Save with quota handling |
| `getProgress()` | Load with validation |
| `compareResults()` | Check if query correct |

---

## ?? Next Development

### High Priority
- [ ] Add unit tests (Jest)
- [ ] Add E2E tests (Cypress)
- [ ] Set up error tracking
- [ ] Add performance monitoring

### Medium Priority
- [ ] Add more questions
- [ ] Add more databases
- [ ] User authentication
- [ ] Cloud sync

### Low Priority
- [ ] Mobile app
- [ ] Collaborative features
- [ ] Query suggestions
- [ ] Leaderboard

---

**Last Updated**: December 27, 2024
**Status**: ? Ready for Development
