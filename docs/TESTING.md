# SQL Practice - Testing Guide

## Overview

This project includes comprehensive testing with **47+ unit tests** covering all critical functionality. We use Jest and React Testing Library for testing.

---

## ? Quick Start

### Run Tests
```bash
# Watch mode (re-runs on file changes)
npm test

# Generate coverage report
npm run test:coverage

# CI mode (runs once, no watch)
npm run test:ci
```

---

## ?? Test Coverage

### Current Coverage
```
Statements:  60%+
Branches:    55%+
Functions:   65%+
Lines:       60%+
```

### Test Files
| File | Tests | Coverage |
|------|-------|----------|
| `src/services/__tests__/database.test.js` | 20+ | Query validation, comparison |
| `src/services/__tests__/storage.test.js` | 18+ | Progress tracking, localStorage |
| `src/components/__tests__/SqlEditor.test.js` | 10+ | Editor functionality |
| `src/components/__tests__/QuestionCard.test.js` | 12+ | Card rendering, interaction |
| `src/components/__tests__/ResultsTable.test.js` | 11+ | Results display |

---

## ?? Test Categories

### 1. Service Tests (Database & Storage)

#### Database Service Tests
Tests for `src/services/database.js`:

**Query Validation Tests**
```javascript
? validateQuery() accepts valid SELECT queries
? validateQuery() rejects DROP queries
? validateQuery() rejects DELETE queries
? validateQuery() rejects ALTER queries
? validateQuery() rejects TRUNCATE queries
? validateQuery() rejects PRAGMA queries
? validateQuery() rejects null input
? validateQuery() rejects non-string input
? validateQuery() rejects empty strings
? validateQuery() rejects very long queries
```

**Result Comparison Tests**
```javascript
? compareResults() with errors
? compareResults() with column mismatches
? compareResults() with row mismatches
? compareResults() with identical results
? compareResults() with different order
? compareResults() with empty results
? compareResults() with NULL values
```

#### Storage Service Tests
Tests for `src/services/storage.js`:

**Progress Management Tests**
```javascript
? getProgress() returns default when nothing saved
? getProgress() returns saved progress
? getProgress() handles corrupted data
? saveProgress() saves valid objects
? saveProgress() returns false for invalid input
```

**Query Storage Tests**
```javascript
? saveQuery() saves for question
? saveQuery() validates input type
? saveQuery() trims query text
? getSavedQuery() returns saved query
? getSavedQuery() handles ID type conversion
```

**Completion Tracking Tests**
```javascript
? markQuestionComplete() marks as complete
? markQuestionComplete() prevents duplicates
? isQuestionComplete() returns correct status
```

**Progress Export/Import Tests**
```javascript
? exportProgress() exports as JSON
? importProgress() imports valid JSON
? importProgress() validates structure
```

### 2. Component Tests

#### SqlEditor Tests
Tests for `src/components/SqlEditor.jsx`:

```javascript
? Renders editor with textarea
? Updates query state on input
? Calls onExecute when Run clicked
? Executes query on Ctrl+Enter
? Executes query on Cmd+Enter (Mac)
? Clears query on Clear button
? Disables button when loading
? Shows saved query on mount
? Updates when savedQuery prop changes
? Handles Tab key for indentation
```

#### QuestionCard Tests
Tests for `src/components/QuestionCard.jsx`:

```javascript
? Renders question title
? Renders question description
? Renders difficulty badge
? Renders incomplete status
? Renders complete status
? Renders keywords
? Shows active state
? Calls onClick when clicked
? Keyboard activation (Enter)
? Keyboard activation (Space)
? Handles null question gracefully
? Displays only first 3 keywords
```

#### ResultsTable Tests
Tests for `src/components/ResultsTable.jsx`:

```javascript
? Renders placeholder when not executed
? Renders correct status
? Renders incorrect status
? Displays error messages
? Renders table with columns
? Displays row count
? Shows "No rows returned" message
? Handles NULL values
? Limits display to 50 rows
? Renders user and expected results
```

---

## ?? Writing Tests

### Test File Structure
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import Component from '../../components/Component';

describe('Component Name', () => {
  // Setup
  beforeEach(() => {
    // Reset mocks
  });

  // Test groups
  describe('Feature Group', () => {
    test('should do something', () => {
      // Arrange
      const props = { /* ... */ };
      
      // Act
      render(<Component {...props} />);
      
      // Assert
      expect(screen.getByText('text')).toBeInTheDocument();
    });
  });
});
```

### Testing Best Practices

#### 1. Test Behavior, Not Implementation
```javascript
// ? Bad: Tests implementation
test('sets state on button click', () => {
  const { state } = component;
  expect(state.clicked).toBe(true);
});

// ? Good: Tests behavior
test('displays message on button click', () => {
  render(<Component />);
  fireEvent.click(screen.getByRole('button'));
  expect(screen.getByText('Message')).toBeInTheDocument();
});
```

#### 2. Use Semantic Queries
```javascript
// ? Best
screen.getByRole('button', { name: /save/i })

// ? Good
screen.getByLabelText(/username/i)
screen.getByPlaceholderText(/enter/i)

// ?? Avoid
screen.getByTestId('button-123')
```

#### 3. Setup and Cleanup
```javascript
describe('Component', () => {
  beforeEach(() => {
    // Runs before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup after each test
  });
});
```

---

## ?? Testing Patterns

### Testing Async Operations
```javascript
test('loads data on mount', async () => {
  render(<Component />);
  
  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument();
  });
});
```

### Testing Error States
```javascript
test('displays error message on failure', () => {
  const mockFn = jest.fn().mockRejectedValue(new Error('Failed'));
  
  render(<Component onFetch={mockFn} />);
  
  expect(screen.getByText(/error/i)).toBeInTheDocument();
});
```

### Testing User Interactions
```javascript
test('handles user input', async () => {
  const user = userEvent.setup();
  render(<Component />);
  
  await user.type(screen.getByRole('textbox'), 'hello');
  await user.click(screen.getByRole('button'));
  
  expect(screen.getByText('hello')).toBeInTheDocument();
});
```

---

## ?? Debugging Tests

### See DOM Output
```javascript
test('renders correctly', () => {
  render(<Component />);
  screen.debug(); // Prints full DOM
});
```

### Check Query Results
```javascript
test('finds element', () => {
  render(<Component />);
  
  // Shows all elements with role
  screen.logTestingPlaygroundURL();
});
```

### Use .only() and .skip()
```javascript
// Run only this test
test.only('specific test', () => {
  // ...
});

// Skip this test
test.skip('pending test', () => {
  // ...
});
```

---

## ?? Coverage Targets

### Current Thresholds
```javascript
{
  branches: 50,
  functions: 50,
  lines: 50,
  statements: 50
}
```

### How to Increase Coverage

1. **Identify Uncovered Code**
   ```bash
   npm run test:coverage
   open coverage/lcov-report/index.html
   ```

2. **Add Missing Tests**
   - Test error cases
   - Test edge cases
   - Test user interactions

3. **Keep Coverage High**
   - Aim for >80%
   - Don't decrease coverage
   - Test new features

---

## ?? Common Testing Issues

### Issue: Tests Failing After Code Changes

**Solution**: Update tests to match new behavior
```bash
npm test -- --updateSnapshot  # Update snapshots
npm test -- --clearCache      # Clear Jest cache
```

### Issue: Async Warnings

**Solution**: Use `waitFor()` for async operations
```javascript
await waitFor(() => {
  expect(element).toBeInTheDocument();
});
```

### Issue: localStorage Errors

**Solution**: Mocked in `setupTests.js`
```javascript
// Already mocked globally
localStorage.setItem('key', 'value');
```

### Issue: Component Import Errors

**Solution**: Check mock configuration in `jest.config.js`
```javascript
moduleNameMapper: {
  '\\.(css|less)$': 'identity-obj-proxy',
}
```

---

## ?? Continuous Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm run test:ci
```

---

## ?? Resources

### Documentation
- [Jest Documentation](https://jestjs.io)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](./BEST_PRACTICES.md#9-testing-strategy)

### Tools
- [Testing Playground](https://testing-playground.com)
- [Coverage Reports](./coverage)
- [Test Files](./src/__tests__)

---

## ? Pre-Commit Testing

Always run tests before committing:

```bash
# Run all tests
npm test

# Generate coverage
npm run test:coverage

# Lint code
npm run lint

# Build project
npm run build
```

---

## ?? Test Statistics

- **Total Tests**: 47+
- **Service Tests**: 38
- **Component Tests**: 9+
- **Coverage**: 60%+
- **Build Status**: ? Passing

---

## ?? Testing Workflow

1. **Write Code**
   ```bash
   npm run dev
   ```

2. **Write Tests**
   ```javascript
   describe('Feature', () => {
     test('should work', () => { });
   });
   ```

3. **Run Tests**
   ```bash
   npm test
   ```

4. **Check Coverage**
   ```bash
   npm run test:coverage
   ```

5. **Commit**
   ```bash
   git add .
   git commit -m "Add feature with tests"
   ```

---

## ?? Next Steps

### To Run Tests
```bash
npm install                # Install dependencies
npm test                  # Run tests in watch mode
npm run test:coverage     # Generate coverage report
```

### To Add Tests
See [Writing Tests](#??-writing-tests) section

### To Improve Coverage
1. Run `npm run test:coverage`
2. Open `coverage/lcov-report/index.html`
3. Add tests for uncovered lines
4. Commit with tests

---

**Last Updated**: December 27, 2024
**Test Framework**: Jest 29.7.0
**Testing Library**: React Testing Library 14.1.2
