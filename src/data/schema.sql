-- =============================================
-- SQL Practice Database Schema
-- =============================================

-- Employees Table
CREATE TABLE employees (
    id INTEGER PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE,
    department_id INTEGER,
    salary INTEGER,
    hire_date TEXT,
    manager_id INTEGER
);

-- Departments Table
CREATE TABLE departments (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    budget INTEGER
);

-- Projects Table
CREATE TABLE projects (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    department_id INTEGER,
    start_date TEXT,
    end_date TEXT,
    budget INTEGER,
    status TEXT DEFAULT 'active'
);

-- Employee_Projects (Junction Table)
CREATE TABLE employee_projects (
    employee_id INTEGER,
    project_id INTEGER,
    role TEXT,
    hours_worked INTEGER DEFAULT 0,
    PRIMARY KEY (employee_id, project_id)
);

-- =============================================
-- Sample Data
-- =============================================

-- Departments
INSERT INTO departments (id, name, location, budget) VALUES
(1, 'Engineering', 'Floor 3', 500000),
(2, 'Marketing', 'Floor 2', 200000),
(3, 'Human Resources', 'Floor 1', 150000),
(4, 'Sales', 'Floor 2', 300000),
(5, 'Finance', 'Floor 4', 250000);

-- Employees
INSERT INTO employees (id, first_name, last_name, email, department_id, salary, hire_date, manager_id) VALUES
(1, 'John', 'Smith', 'john.smith@company.com', 1, 85000, '2020-03-15', NULL),
(2, 'Sarah', 'Johnson', 'sarah.j@company.com', 1, 72000, '2021-06-01', 1),
(3, 'Michael', 'Williams', 'michael.w@company.com', 1, 68000, '2022-01-10', 1),
(4, 'Emily', 'Brown', 'emily.b@company.com', 2, 65000, '2021-09-20', NULL),
(5, 'David', 'Jones', 'david.j@company.com', 2, 58000, '2022-03-05', 4),
(6, 'Jessica', 'Davis', 'jessica.d@company.com', 3, 62000, '2020-11-12', NULL),
(7, 'Daniel', 'Miller', 'daniel.m@company.com', 4, 70000, '2021-02-28', NULL),
(8, 'Ashley', 'Wilson', 'ashley.w@company.com', 4, 55000, '2022-07-15', 7),
(9, 'Christopher', 'Moore', 'chris.m@company.com', 5, 75000, '2020-08-01', NULL),
(10, 'Amanda', 'Taylor', 'amanda.t@company.com', 5, 68000, '2021-04-10', 9),
(11, 'Ryan', 'Anderson', 'ryan.a@company.com', 1, 78000, '2019-05-20', 1),
(12, 'Nicole', 'Thomas', 'nicole.t@company.com', 2, 52000, '2023-01-15', 4);

-- Projects
INSERT INTO projects (id, name, department_id, start_date, end_date, budget, status) VALUES
(1, 'Website Redesign', 1, '2023-01-01', '2023-06-30', 100000, 'completed'),
(2, 'Mobile App Development', 1, '2023-03-15', '2023-12-31', 250000, 'active'),
(3, 'Marketing Campaign Q2', 2, '2023-04-01', '2023-06-30', 50000, 'completed'),
(4, 'Employee Training Program', 3, '2023-02-01', '2023-12-31', 30000, 'active'),
(5, 'Sales CRM Integration', 4, '2023-05-01', '2023-10-31', 80000, 'active'),
(6, 'Annual Budget Planning', 5, '2023-09-01', '2023-11-30', 10000, 'active');

-- Employee_Projects assignments
INSERT INTO employee_projects (employee_id, project_id, role, hours_worked) VALUES
(1, 1, 'Lead Developer', 200),
(2, 1, 'Developer', 180),
(3, 1, 'Developer', 150),
(1, 2, 'Technical Advisor', 50),
(2, 2, 'Lead Developer', 300),
(3, 2, 'Developer', 280),
(11, 2, 'Developer', 250),
(4, 3, 'Project Manager', 120),
(5, 3, 'Marketing Specialist', 100),
(12, 3, 'Marketing Assistant', 80),
(6, 4, 'HR Lead', 150),
(7, 5, 'Sales Lead', 180),
(8, 5, 'Sales Rep', 160),
(9, 6, 'Finance Lead', 100),
(10, 6, 'Analyst', 120);
