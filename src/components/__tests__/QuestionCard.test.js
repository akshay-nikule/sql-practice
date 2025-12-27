import { render, screen, fireEvent } from '@testing-library/react';
import QuestionCard from '../../components/QuestionCard';

describe('QuestionCard Component', () => {
  const mockQuestion = {
    id: 1,
    title: 'Test Question',
    description: 'Test Description',
    difficulty: 'easy',
    keywords: ['SELECT', 'WHERE', 'JOIN'],
    category: 'Basics'
  };

  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  test('renders question card with title', () => {
    render(<QuestionCard question={mockQuestion} onClick={mockOnClick} />);
    
    expect(screen.getByText('Test Question')).toBeInTheDocument();
  });

  test('renders question description', () => {
    render(<QuestionCard question={mockQuestion} onClick={mockOnClick} />);
    
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  test('renders difficulty badge', () => {
    render(<QuestionCard question={mockQuestion} onClick={mockOnClick} />);
    
    expect(screen.getByText(/EASY/i)).toBeInTheDocument();
  });

  test('renders incomplete status by default', () => {
    render(<QuestionCard question={mockQuestion} onClick={mockOnClick} />);
    
    expect(screen.getByText(/INCOMPLETE/i)).toBeInTheDocument();
  });

  test('renders complete status when isCompleted true', () => {
    render(
      <QuestionCard 
        question={mockQuestion} 
        onClick={mockOnClick}
        isCompleted={true}
      />
    );
    
    expect(screen.getByText(/COMPLETE/i)).toBeInTheDocument();
  });

  test('renders keywords', () => {
    render(<QuestionCard question={mockQuestion} onClick={mockOnClick} />);
    
    expect(screen.getByText('SELECT')).toBeInTheDocument();
    expect(screen.getByText('WHERE')).toBeInTheDocument();
  });

  test('shows active state when isActive true', () => {
    const { container } = render(
      <QuestionCard 
        question={mockQuestion} 
        onClick={mockOnClick}
        isActive={true}
      />
    );
    
    const card = container.querySelector('.question-card');
    expect(card).toHaveClass('active');
  });

  test('calls onClick when card clicked', () => {
    render(<QuestionCard question={mockQuestion} onClick={mockOnClick} />);
    
    const card = screen.getByText('Test Question').closest('.question-card');
    fireEvent.click(card);
    
    expect(mockOnClick).toHaveBeenCalled();
  });

  test('calls onClick on keyboard activation (Enter)', () => {
    render(<QuestionCard question={mockQuestion} onClick={mockOnClick} />);
    
    const card = screen.getByText('Test Question').closest('.question-card');
    fireEvent.keyDown(card, { key: 'Enter' });
    
    expect(mockOnClick).toHaveBeenCalled();
  });

  test('calls onClick on keyboard activation (Space)', () => {
    render(<QuestionCard question={mockQuestion} onClick={mockOnClick} />);
    
    const card = screen.getByText('Test Question').closest('.question-card');
    fireEvent.keyDown(card, { key: ' ' });
    
    expect(mockOnClick).toHaveBeenCalled();
  });

  test('renders question ID', () => {
    render(<QuestionCard question={mockQuestion} onClick={mockOnClick} />);
    
    expect(screen.getByText('#1')).toBeInTheDocument();
  });

  test('renders with default props', () => {
    render(<QuestionCard question={mockQuestion} />);
    
    expect(screen.getByText('Test Question')).toBeInTheDocument();
  });

  test('handles null question gracefully', () => {
    const { container } = render(<QuestionCard question={null} />);
    
    expect(container.firstChild).toBeNull();
  });

  test('displays only first 3 keywords', () => {
    const questionWith5Keywords = {
      ...mockQuestion,
      keywords: ['SELECT', 'WHERE', 'JOIN', 'GROUP', 'HAVING']
    };
    
    render(<QuestionCard question={questionWith5Keywords} onClick={mockOnClick} />);
    
    const keywordElements = screen.getAllByText(/SELECT|WHERE|JOIN|GROUP|HAVING/);
    expect(keywordElements.length).toBeLessThanOrEqual(3);
  });
});
