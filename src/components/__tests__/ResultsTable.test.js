import { render, screen } from '@testing-library/react';
import ResultsTable from '../../components/ResultsTable';

describe('ResultsTable Component', () => {
  test('renders placeholder when not executed', () => {
    render(
      <ResultsTable 
        hasExecuted={false}
        isCorrect={null}
      />
    );
    
    expect(screen.getByText(/Run your query/i)).toBeInTheDocument();
  });

  test('renders correct status', () => {
    const result = {
      columns: ['id'],
      values: [[1]],
      error: null
    };

    render(
      <ResultsTable 
        userResult={result}
        expectedResult={result}
        hasExecuted={true}
        isCorrect={true}
      />
    );
    
    expect(screen.getByText(/Correct/i)).toBeInTheDocument();
  });

  test('renders incorrect status', () => {
    const userResult = {
      columns: ['id'],
      values: [[1]],
      error: null
    };
    
    const expectedResult = {
      columns: ['id'],
      values: [[2]],
      error: null
    };

    render(
      <ResultsTable 
        userResult={userResult}
        expectedResult={expectedResult}
        hasExecuted={true}
        isCorrect={false}
      />
    );
    
    expect(screen.getByText(/Not quite right/i)).toBeInTheDocument();
  });

  test('displays error message from user result', () => {
    const userResult = {
      columns: [],
      values: [],
      error: 'Syntax error'
    };

    render(
      <ResultsTable 
        userResult={userResult}
        expectedResult={{ columns: [], values: [], error: null }}
        hasExecuted={true}
        isCorrect={false}
      />
    );
    
    expect(screen.getByText('Syntax error')).toBeInTheDocument();
  });

  test('renders table with columns and rows', () => {
    const result = {
      columns: ['id', 'name'],
      values: [[1, 'John'], [2, 'Jane']],
      error: null
    };

    render(
      <ResultsTable 
        userResult={result}
        expectedResult={result}
        hasExecuted={true}
        isCorrect={true}
      />
    );
    
    expect(screen.getByText('id')).toBeInTheDocument();
    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();
  });

  test('displays row count', () => {
    const result = {
      columns: ['id'],
      values: [[1], [2], [3]],
      error: null
    };

    render(
      <ResultsTable 
        userResult={result}
        expectedResult={result}
        hasExecuted={true}
        isCorrect={true}
      />
    );
    
    expect(screen.getByText(/3 row/)).toBeInTheDocument();
  });

  test('displays "No rows returned" for empty results', () => {
    const result = {
      columns: ['id'],
      values: [],
      error: null
    };

    render(
      <ResultsTable 
        userResult={result}
        expectedResult={result}
        hasExecuted={true}
        isCorrect={true}
      />
    );
    
    expect(screen.getByText(/No rows returned/i)).toBeInTheDocument();
  });

  test('handles NULL values', () => {
    const result = {
      columns: ['id', 'email'],
      values: [[1, null], [2, 'test@example.com']],
      error: null
    };

    render(
      <ResultsTable 
        userResult={result}
        expectedResult={result}
        hasExecuted={true}
        isCorrect={true}
      />
    );
    
    expect(screen.getByText('NULL')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  test('limits display to 50 rows', () => {
    const values = Array.from({ length: 100 }, (_, i) => [i]);
    const result = {
      columns: ['id'],
      values,
      error: null
    };

    render(
      <ResultsTable 
        userResult={result}
        expectedResult={result}
        hasExecuted={true}
        isCorrect={true}
      />
    );
    
    expect(screen.getByText(/Showing first 50 rows/)).toBeInTheDocument();
  });

  test('renders both user and expected results', () => {
    const userResult = {
      columns: ['id'],
      values: [[1]],
      error: null
    };
    
    const expectedResult = {
      columns: ['id'],
      values: [[1]],
      error: null
    };

    render(
      <ResultsTable 
        userResult={userResult}
        expectedResult={expectedResult}
        hasExecuted={true}
        isCorrect={true}
      />
    );
    
    expect(screen.getByText('Your Result')).toBeInTheDocument();
    expect(screen.getByText('Expected Result')).toBeInTheDocument();
  });
});
