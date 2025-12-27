-- =============================================
-- Company Database - Indian Data
-- =============================================

-- Departments Table
CREATE TABLE departments (
    department_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    budget INTEGER,
    manager_id INTEGER
);

-- Employees Table
CREATE TABLE employees (
    employee_id INTEGER PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE,
    department_id INTEGER,
    salary INTEGER,
    hire_date TEXT,
    manager_id INTEGER,
    job_title TEXT,
    phone TEXT
);

-- Projects Table
CREATE TABLE projects (
    project_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    department_id INTEGER,
    start_date TEXT,
    end_date TEXT,
    budget INTEGER,
    status TEXT DEFAULT 'active',
    client_name TEXT
);

-- Assignments Table
CREATE TABLE assignments (
    assignment_id INTEGER PRIMARY KEY,
    employee_id INTEGER,
    project_id INTEGER,
    role TEXT,
    hours_worked INTEGER DEFAULT 0,
    start_date TEXT
);

-- =============================================
-- Sample Data
-- =============================================

-- Departments
INSERT INTO departments VALUES
(1, 'Engineering', 'Bengaluru', 10000000, 1),
(2, 'Marketing', 'Mumbai', 5000000, 6),
(3, 'Human Resources', 'Delhi', 3000000, 9),
(4, 'Sales', 'Mumbai', 7000000, 12),
(5, 'Finance', 'Chennai', 4000000, 15),
(6, 'Operations', 'Pune', 6000000, 18);

-- Employees (Indian Names)
INSERT INTO employees VALUES
(1, 'Rajesh', 'Sharma', 'rajesh.sharma@techcorp.in', 1, 180000, '2018-03-15', NULL, 'VP Engineering', '9900111111'),
(2, 'Priya', 'Patel', 'priya.patel@techcorp.in', 1, 120000, '2019-06-01', 1, 'Senior Developer', '9900111112'),
(3, 'Vikram', 'Singh', 'vikram.singh@techcorp.in', 1, 110000, '2020-01-10', 1, 'Senior Developer', '9900111113'),
(4, 'Anita', 'Gupta', 'anita.gupta@techcorp.in', 1, 95000, '2021-04-20', 2, 'Developer', '9900111114'),
(5, 'Suresh', 'Kumar', 'suresh.kumar@techcorp.in', 1, 90000, '2021-08-15', 2, 'Developer', '9900111115'),
(6, 'Deepa', 'Reddy', 'deepa.reddy@techcorp.in', 2, 140000, '2017-11-01', NULL, 'Marketing Director', '9900111116'),
(7, 'Amit', 'Joshi', 'amit.joshi@techcorp.in', 2, 85000, '2020-07-10', 6, 'Marketing Manager', '9900111117'),
(8, 'Neha', 'Verma', 'neha.verma@techcorp.in', 2, 65000, '2022-02-28', 7, 'Marketing Executive', '9900111118'),
(9, 'Rahul', 'Deshmukh', 'rahul.deshmukh@techcorp.in', 3, 130000, '2016-05-20', NULL, 'HR Director', '9900111119'),
(10, 'Kavita', 'Iyer', 'kavita.iyer@techcorp.in', 3, 75000, '2019-09-15', 9, 'HR Manager', '9900111120'),
(11, 'Arun', 'Nair', 'arun.nair@techcorp.in', 3, 55000, '2023-01-05', 10, 'HR Executive', '9900111121'),
(12, 'Pooja', 'Mehta', 'pooja.mehta@techcorp.in', 4, 150000, '2015-08-10', NULL, 'Sales Director', '9900111122'),
(13, 'Kiran', 'Rao', 'kiran.rao@techcorp.in', 4, 95000, '2018-12-01', 12, 'Sales Manager', '9900111123'),
(14, 'Sanjay', 'Kulkarni', 'sanjay.kulkarni@techcorp.in', 4, 70000, '2021-03-15', 13, 'Sales Executive', '9900111124'),
(15, 'Meera', 'Sharma', 'meera.sharma@techcorp.in', 5, 160000, '2014-02-20', NULL, 'Finance Director', '9900111125'),
(16, 'Arjun', 'Bhat', 'arjun.bhat@techcorp.in', 5, 100000, '2017-06-10', 15, 'Senior Accountant', '9900111126'),
(17, 'Lakshmi', 'Pillai', 'lakshmi.pillai@techcorp.in', 5, 70000, '2020-10-25', 16, 'Accountant', '9900111127'),
(18, 'Ganesh', 'Patil', 'ganesh.patil@techcorp.in', 6, 145000, '2016-09-05', NULL, 'Operations Director', '9900111128'),
(19, 'Sunita', 'Das', 'sunita.das@techcorp.in', 6, 85000, '2019-04-15', 18, 'Operations Manager', '9900111129'),
(20, 'Manoj', 'Thakur', 'manoj.thakur@techcorp.in', 6, 60000, '2022-07-01', 19, 'Operations Executive', '9900111130'),
(21, 'Divya', 'Menon', 'divya.menon@techcorp.in', 1, 105000, '2020-11-20', 3, 'Developer', '9900111131'),
(22, 'Ravi', 'Agarwal', 'ravi.agarwal@techcorp.in', 1, 115000, '2019-08-12', 1, 'Senior Developer', '9900111132'),
(23, 'Shruti', 'Jain', 'shruti.jain@techcorp.in', 2, 72000, '2021-05-18', 7, 'Content Writer', '9900111133'),
(24, 'Nikhil', 'Choudhary', 'nikhil.choudhary@techcorp.in', 4, 68000, '2022-01-10', 13, 'Sales Executive', '9900111134'),
(25, 'Isha', 'Saxena', 'isha.saxena@techcorp.in', 1, 88000, '2022-09-01', 3, 'Junior Developer', '9900111135');

-- Projects
INSERT INTO projects VALUES
(1, 'E-Commerce Platform', 1, '2023-01-01', '2023-12-31', 5000000, 'completed', 'Flipkart'),
(2, 'Mobile Banking App', 1, '2023-06-01', '2024-06-30', 8000000, 'active', 'HDFC Bank'),
(3, 'Digital Marketing Campaign', 2, '2023-09-01', '2024-02-28', 2000000, 'active', 'Tata Motors'),
(4, 'HR Management System', 1, '2024-01-15', '2024-08-31', 3000000, 'active', 'Internal'),
(5, 'Sales CRM Integration', 4, '2023-04-01', '2023-10-31', 1500000, 'completed', 'Reliance'),
(6, 'Financial Analytics Dashboard', 5, '2023-11-01', '2024-04-30', 2500000, 'active', 'Infosys'),
(7, 'Warehouse Management', 6, '2023-03-01', '2023-09-30', 4000000, 'completed', 'Amazon India'),
(8, 'AI Chatbot Development', 1, '2024-02-01', '2024-12-31', 6000000, 'active', 'Airtel'),
(9, 'Brand Awareness Campaign', 2, '2024-01-01', '2024-06-30', 3500000, 'active', 'Zomato'),
(10, 'Supply Chain Optimization', 6, '2024-03-01', NULL, 4500000, 'active', 'BigBasket');

-- Assignments
INSERT INTO assignments VALUES
(1, 1, 1, 'Project Lead', 500, '2023-01-01'),
(2, 2, 1, 'Lead Developer', 450, '2023-01-01'),
(3, 3, 1, 'Backend Developer', 400, '2023-01-15'),
(4, 4, 1, 'Frontend Developer', 380, '2023-02-01'),
(5, 5, 1, 'QA Engineer', 300, '2023-03-01'),
(6, 2, 2, 'Technical Architect', 200, '2023-06-01'),
(7, 21, 2, 'Full Stack Developer', 350, '2023-06-15'),
(8, 22, 2, 'Backend Developer', 320, '2023-07-01'),
(9, 25, 2, 'Junior Developer', 280, '2023-08-01'),
(10, 6, 3, 'Campaign Director', 150, '2023-09-01'),
(11, 7, 3, 'Campaign Manager', 180, '2023-09-01'),
(12, 8, 3, 'Content Creator', 200, '2023-09-15'),
(13, 23, 3, 'Copywriter', 190, '2023-10-01'),
(14, 3, 4, 'Tech Lead', 100, '2024-01-15'),
(15, 4, 4, 'Developer', 150, '2024-01-20'),
(16, 12, 5, 'Project Manager', 180, '2023-04-01'),
(17, 13, 5, 'Business Analyst', 200, '2023-04-01'),
(18, 14, 5, 'Sales Coordinator', 150, '2023-05-01'),
(19, 15, 6, 'Project Lead', 120, '2023-11-01'),
(20, 16, 6, 'Data Analyst', 180, '2023-11-15'),
(21, 17, 6, 'Junior Analyst', 100, '2023-12-01'),
(22, 18, 7, 'Operations Lead', 250, '2023-03-01'),
(23, 19, 7, 'Project Coordinator', 220, '2023-03-15'),
(24, 20, 7, 'Logistics Executive', 180, '2023-04-01'),
(25, 1, 8, 'Technical Advisor', 50, '2024-02-01'),
(26, 22, 8, 'AI Developer', 150, '2024-02-15'),
(27, 21, 8, 'ML Engineer', 140, '2024-03-01'),
(28, 6, 9, 'Strategy Lead', 80, '2024-01-01'),
(29, 7, 9, 'Campaign Lead', 120, '2024-01-15'),
(30, 18, 10, 'Project Director', 60, '2024-03-01');
