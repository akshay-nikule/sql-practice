# SQL Practice - Ravi Programming Academy

An offline-first SQL learning platform for students. Practice SQL queries directly in your browser with instant feedback!

**Live Demo:** [https://akshaybhaiya1404.github.io/sql-practice/](https://akshaybhaiya1404.github.io/sql-practice/)

## Features

- **65 SQL Questions** - From basic SELECT to complex JOINs
- **3 Databases** - Hospital, University, Company (all with Indian names)
- **Offline Ready** - Works without internet using sql.js (SQLite in browser)
- **Light/Dark Theme** - Toggle between themes
- **Progress Tracking** - Your progress is saved locally
- **Instant Feedback** - Compare your results with expected output
- **Filter by Topic** - Filter questions by keywords, difficulty, completion

## Tech Stack

- **Frontend:** React 18 + Vite
- **Database:** sql.js (SQLite compiled to WebAssembly)
- **Styling:** CSS with CSS Variables for theming
- **Storage:** localStorage for progress persistence

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/AkshayBhaiya1404/sql-practice.git

# Navigate to project
cd sql-practice

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Project Structure

```
sql-practice/
  src/
    components/         # React components
      Header.jsx
      SqlEditor.jsx
      ResultsTable.jsx
      QuestionPanel.jsx
      QuestionCard.jsx
      FilterPanel.jsx
      SchemaViewer.jsx
    services/           # Business logic
      database.js       # sql.js wrapper
      storage.js        # localStorage helper
    context/            # React Context
      ThemeContext.jsx
    data/               # Static data
      questions.json    # 65 SQL questions
      databases/        # SQL schema files
        hospital.sql
        university.sql
        company.sql
    assets/             # Images and static files
    App.jsx             # Main component
    main.jsx            # Entry point
    index.css           # Global styles
  public/               # Static public files
  index.html
  vite.config.js
  package.json
```

## Database Schemas

### Hospital Database
- `patients` - Patient records with Indian names
- `doctors` - Doctor information
- `departments` - Hospital departments
- `admissions` - Patient admission records

### University Database
- `students` - Student records
- `professors` - Professor information
- `courses` - Course catalog
- `enrollments` - Student course enrollments
- `departments` - University departments

### Company Database
- `employees` - Employee records
- `departments` - Company departments
- `projects` - Project information
- `assignments` - Employee project assignments

## Question Categories

| Category | Easy | Medium | Hard | Total |
|----------|------|--------|------|-------|
| SELECT Basics | 5 | - | - | 5 |
| WHERE Clause | 4 | 4 | - | 8 |
| ORDER BY / LIMIT | 3 | 2 | - | 5 |
| Aggregate Functions | 3 | 5 | 2 | 10 |
| GROUP BY / HAVING | - | 5 | 3 | 8 |
| JOIN | - | 5 | 5 | 10 |
| DISTINCT / CASE | 2 | 3 | - | 5 |
| LIKE / NULL / IN | 2 | 3 | 2 | 7 |
| Subqueries | - | 3 | 4 | 7 |
| **Total** | **19** | **30** | **16** | **65** |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Ravi Programming Academy**

- GitHub: [@AkshayBhaiya1404](https://github.com/AkshayBhaiya1404)

## Acknowledgments

- [sql.js](https://github.com/sql-js/sql.js/) - SQLite compiled to JavaScript
- [React](https://reactjs.org/) - UI Library
- [Vite](https://vitejs.dev/) - Build tool
