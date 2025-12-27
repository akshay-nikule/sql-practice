import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SqlEditor from '../../components/SqlEditor';

describe('SqlEditor Component', () => {
  const mockOnExecute = jest.fn();

  beforeEach(() => {
    mockOnExecute.mockClear();
  });

  test('renders editor with textarea', () => {
    render(<SqlEditor onExecute={mockOnExecute} />);
    
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
  });

  test('updates query state on input', () => {
    render(<SqlEditor onExecute={mockOnExecute} />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'SELECT * FROM users' } });
    
    expect(textarea.value).toBe('SELECT * FROM users');
  });

  test('calls onExecute when Run Query button clicked', () => {
    render(<SqlEditor onExecute={mockOnExecute} />);
    
    const textarea = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /Run Query/i });
    
    fireEvent.change(textarea, { target: { value: 'SELECT * FROM users' } });
    fireEvent.click(button);
    
    expect(mockOnExecute).toHaveBeenCalledWith('SELECT * FROM users');
  });

  test('does not call onExecute with empty query', () => {
    render(<SqlEditor onExecute={mockOnExecute} />);
    
    const button = screen.getByRole('button', { name: /Run Query/i });
    fireEvent.click(button);
    
    expect(mockOnExecute).not.toHaveBeenCalled();
  });

  test('executes query on Ctrl+Enter', () => {
    render(<SqlEditor onExecute={mockOnExecute} />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'SELECT * FROM users' } });
    fireEvent.keyDown(textarea, { key: 'Enter', ctrlKey: true });
    
    expect(mockOnExecute).toHaveBeenCalled();
  });

  test('executes query on Cmd+Enter (Mac)', () => {
    render(<SqlEditor onExecute={mockOnExecute} />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'SELECT * FROM users' } });
    fireEvent.keyDown(textarea, { key: 'Enter', metaKey: true });
    
    expect(mockOnExecute).toHaveBeenCalled();
  });

  test('clears query on Clear button click', () => {
    render(<SqlEditor onExecute={mockOnExecute} />);
    
    const textarea = screen.getByRole('textbox');
    const clearButton = screen.getByRole('button', { name: /Clear/i });
    
    fireEvent.change(textarea, { target: { value: 'SELECT * FROM users' } });
    fireEvent.click(clearButton);
    
    expect(textarea.value).toBe('');
  });

  test('disables Run button when loading', () => {
    render(<SqlEditor onExecute={mockOnExecute} isLoading={true} />);
    
    const button = screen.getByRole('button', { name: /Running/i });
    expect(button).toBeDisabled();
  });

  test('shows saved query on mount', () => {
    render(<SqlEditor onExecute={mockOnExecute} savedQuery="SELECT * FROM users" />);
    
    const textarea = screen.getByRole('textbox');
    expect(textarea.value).toBe('SELECT * FROM users');
  });

  test('updates when savedQuery prop changes', () => {
    const { rerender } = render(
      <SqlEditor onExecute={mockOnExecute} savedQuery="SELECT 1" />
    );
    
    let textarea = screen.getByRole('textbox');
    expect(textarea.value).toBe('SELECT 1');
    
    rerender(<SqlEditor onExecute={mockOnExecute} savedQuery="SELECT 2" />);
    
    textarea = screen.getByRole('textbox');
    expect(textarea.value).toBe('SELECT 2');
  });

  test('handles Tab key for indentation', () => {
    render(<SqlEditor onExecute={mockOnExecute} />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'SELECT' } });
    fireEvent.keyDown(textarea, { key: 'Tab' });
    
    // Tab should add 2 spaces
    expect(textarea.value).toContain('  ');
  });
});
