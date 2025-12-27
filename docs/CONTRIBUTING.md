# Contributing to SQL Practice

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the SQL Practice project.

---

## ?? Code of Conduct

- Be respectful and inclusive
- Welcome diverse perspectives
- Keep discussions professional
- Report issues constructively

---

## ?? Getting Started

### 1. Fork the Repository
```bash
# Click "Fork" on GitHub
git clone https://github.com/YOUR_USERNAME/sql-practice.git
cd sql-practice
```

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-fix-name
```

### 3. Set Up Development
```bash
npm install
npm run dev
```

### 4. Make Changes
- Write code following project standards
- Add tests for new features
- Update documentation
- Run linter: `npm run lint`

### 5. Test Your Changes
```bash
npm test                  # Run tests
npm run test:coverage     # Check coverage
npm run build            # Build for production
```

### 6. Commit and Push
```bash
git add .
git commit -m "Add amazing feature"
git push origin feature/your-feature-name
```

### 7. Create Pull Request
- Go to GitHub
- Click "New Pull Request"
- Fill in description
- Link related issues
- Wait for review

---

## ? Pull Request Checklist

Before submitting a PR, ensure:
- [ ] Code follows project style
- [ ] All tests pass (`npm test`)
- [ ] Coverage didn't decrease
- [ ] No console errors/warnings
- [ ] Documentation updated
- [ ] Commit messages are clear
- [ ] No unrelated changes included

---

## ?? Reporting Issues

### Bug Report Template
```markdown
## Description
Brief description of the issue

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: (Windows/Mac/Linux)
- Browser: (Chrome/Firefox/Safari)
- Node version: (16.0.0)

## Screenshots
If applicable, add screenshots
```

### Feature Request Template
```markdown
## Description
What feature would you like?

## Motivation
Why do you need this feature?

## Proposed Solution
How should it work?

## Alternatives
Any alternative approaches?
```

---

## ?? Development Guidelines

### Code Style
- Use ES6+ syntax
- Use meaningful variable names
- Keep functions small and focused
- Add JSDoc comments for functions
- Follow existing code patterns

### Testing Requirements
- Write tests for new features
- Update tests for modified features
- Aim for >80% coverage
- Test happy path and error cases
- Test edge cases

### Documentation
- Update README if adding features
- Document new functions with JSDoc
- Update CHANGELOG
- Add inline comments for complex logic

---

## ?? Project Structure

```
src/
??? components/        # React components
??? services/         # Business logic
??? context/          # Context providers
??? data/             # Static data
??? assets/           # Images, etc
```

### Adding a New Component
1. Create component in `src/components/`
2. Create tests in `src/components/__tests__/`
3. Export from main component
4. Document usage in README

### Adding a New Service
1. Create service in `src/services/`
2. Create tests in `src/services/__tests__/`
3. Document public API with JSDoc
4. Use in appropriate components

---

## ?? Testing Guidelines

### Write Tests For
- ? User interactions
- ? Error handling
- ? Edge cases
- ? Component rendering
- ? Service functions

### Don't Test
- ? React library internals
- ? Third-party libraries
- ? Simple assignments
- ? Styling details

### Test Example
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import Component from './Component';

describe('Component', () => {
  test('should render correctly', () => {
    render(<Component />);
    expect(screen.getByText('expected')).toBeInTheDocument();
  });

  test('should handle user interaction', () => {
    render(<Component />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('result')).toBeInTheDocument();
  });
});
```

---

## ?? Commit Message Guidelines

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style (no logic change)
- `refactor:` Code refactor
- `test:` Test addition/update
- `chore:` Build, deps, config

### Example
```
feat(SqlEditor): Add syntax highlighting

Implement syntax highlighting for SQL keywords.
Improves readability of SQL queries.

Closes #123
```

---

## ?? Code Review Process

### What We Look For
- Code quality and style
- Test coverage
- Documentation
- Performance impact
- Security implications
- Breaking changes

### Reviewer Responsibilities
- Provide constructive feedback
- Ask clarifying questions
- Suggest improvements
- Approve when satisfied

### Author Responsibilities
- Respond to feedback
- Make requested changes
- Resolve conflicts
- Keep PR updated

---

## ?? Additional Resources

### Documentation
- [README.md](../README.md) - Project overview
- [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) - Development guide
- [BEST_PRACTICES.md](./BEST_PRACTICES.md) - Code standards
- [TESTING.md](./TESTING.md) - Testing guide

### External
- [Git Conventions](https://www.conventionalcommits.org/)
- [React Best Practices](https://react.dev)
- [Testing Best Practices](https://testing-library.com)

---

## ?? Recognition

Contributors will be:
- Added to the contributors list
- Thanked in release notes
- Recognized for their efforts

---

## ? Questions?

- Check existing issues and PRs
- Read documentation files
- Ask in discussions
- Email maintainers

---

**Thank you for contributing to SQL Practice! ??**

Last Updated: December 27, 2024
