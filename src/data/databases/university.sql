-- =============================================
-- University Database - Indian Data
-- =============================================

-- Departments Table
CREATE TABLE departments (
    department_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    building TEXT,
    budget INTEGER,
    hod_name TEXT
);

-- Professors Table
CREATE TABLE professors (
    professor_id INTEGER PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    department_id INTEGER,
    designation TEXT,
    salary INTEGER,
    hire_date TEXT,
    email TEXT
);

-- Students Table
CREATE TABLE students (
    student_id INTEGER PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    department_id INTEGER,
    enrollment_year INTEGER,
    cgpa REAL,
    city TEXT,
    state TEXT,
    phone TEXT
);

-- Courses Table
CREATE TABLE courses (
    course_id INTEGER PRIMARY KEY,
    course_code TEXT NOT NULL,
    name TEXT NOT NULL,
    credits INTEGER,
    department_id INTEGER,
    professor_id INTEGER
);

-- Enrollments Table
CREATE TABLE enrollments (
    enrollment_id INTEGER PRIMARY KEY,
    student_id INTEGER,
    course_id INTEGER,
    semester TEXT,
    grade TEXT,
    marks INTEGER
);

-- =============================================
-- Sample Data
-- =============================================

-- Departments
INSERT INTO departments VALUES
(1, 'Computer Science', 'Tech Block', 5000000, 'Dr. Ramesh Kumar'),
(2, 'Electronics', 'Tech Block', 4000000, 'Dr. Sunita Deshpande'),
(3, 'Mechanical', 'Workshop Block', 4500000, 'Dr. Vijay Patil'),
(4, 'Civil', 'Main Block', 3500000, 'Dr. Anjali Sharma'),
(5, 'Mathematics', 'Science Block', 2000000, 'Dr. Suresh Iyer'),
(6, 'Physics', 'Science Block', 2500000, 'Dr. Meera Nair');

-- Professors (Indian Names)
INSERT INTO professors VALUES
(1, 'Ramesh', 'Kumar', 1, 'Professor', 150000, '2010-06-15', 'ramesh.k@university.edu'),
(2, 'Sunita', 'Deshpande', 2, 'Professor', 145000, '2008-08-01', 'sunita.d@university.edu'),
(3, 'Vijay', 'Patil', 3, 'Professor', 155000, '2005-03-20', 'vijay.p@university.edu'),
(4, 'Anjali', 'Sharma', 4, 'Associate Professor', 120000, '2012-07-10', 'anjali.s@university.edu'),
(5, 'Suresh', 'Iyer', 5, 'Professor', 140000, '2009-01-05', 'suresh.i@university.edu'),
(6, 'Meera', 'Nair', 6, 'Associate Professor', 115000, '2015-09-25', 'meera.n@university.edu'),
(7, 'Arun', 'Joshi', 1, 'Assistant Professor', 85000, '2018-02-14', 'arun.j@university.edu'),
(8, 'Pooja', 'Reddy', 1, 'Assistant Professor', 82000, '2019-07-01', 'pooja.r@university.edu'),
(9, 'Kiran', 'Bhat', 2, 'Assistant Professor', 80000, '2020-01-15', 'kiran.b@university.edu'),
(10, 'Deepak', 'Verma', 3, 'Associate Professor', 110000, '2014-11-20', 'deepak.v@university.edu');

-- Students (Indian Names & Cities)
INSERT INTO students VALUES
(1, 'Aarav', 'Patel', 'aarav.p@student.edu', 1, 2022, 8.5, 'Mumbai', 'Maharashtra', '9811111111'),
(2, 'Saanvi', 'Shah', 'saanvi.s@student.edu', 1, 2022, 9.2, 'Ahmedabad', 'Gujarat', '9811111112'),
(3, 'Vivaan', 'Gupta', 'vivaan.g@student.edu', 1, 2021, 7.8, 'Delhi', 'Delhi', '9811111113'),
(4, 'Aanya', 'Krishnan', 'aanya.k@student.edu', 2, 2022, 8.9, 'Chennai', 'Tamil Nadu', '9811111114'),
(5, 'Arjun', 'Hegde', 'arjun.h@student.edu', 2, 2021, 7.5, 'Bengaluru', 'Karnataka', '9811111115'),
(6, 'Diya', 'Menon', 'diya.m@student.edu', 3, 2023, 8.1, 'Kochi', 'Kerala', '9811111116'),
(7, 'Kabir', 'Singh', 'kabir.s@student.edu', 3, 2022, 7.2, 'Chandigarh', 'Punjab', '9811111117'),
(8, 'Myra', 'Mukherjee', 'myra.m@student.edu', 4, 2021, 8.7, 'Kolkata', 'West Bengal', '9811111118'),
(9, 'Reyansh', 'Yadav', 'reyansh.y@student.edu', 4, 2023, 6.9, 'Lucknow', 'Uttar Pradesh', '9811111119'),
(10, 'Ishita', 'Jain', 'ishita.j@student.edu', 5, 2022, 9.5, 'Jaipur', 'Rajasthan', '9811111120'),
(11, 'Aditya', 'Rao', 'aditya.r@student.edu', 1, 2020, 8.3, 'Hyderabad', 'Telangana', '9811111121'),
(12, 'Ananya', 'Kulkarni', 'ananya.k@student.edu', 2, 2020, 9.0, 'Pune', 'Maharashtra', '9811111122'),
(13, 'Rohan', 'Desai', 'rohan.d@student.edu', 3, 2021, 7.6, 'Surat', 'Gujarat', '9811111123'),
(14, 'Kiara', 'Thomas', 'kiara.t@student.edu', 6, 2022, 8.8, 'Thiruvananthapuram', 'Kerala', '9811111124'),
(15, 'Vihaan', 'Malhotra', 'vihaan.m@student.edu', 1, 2023, 7.9, 'Gurgaon', 'Haryana', '9811111125'),
(16, 'Avni', 'Chatterjee', 'avni.c@student.edu', 5, 2021, 9.1, 'Bhubaneswar', 'Odisha', '9811111126'),
(17, 'Dhruv', 'Pillai', 'dhruv.p@student.edu', 6, 2023, 7.4, 'Mangalore', 'Karnataka', '9811111127'),
(18, 'Riya', 'Agarwal', 'riya.a@student.edu', 1, 2022, 8.6, 'Varanasi', 'Uttar Pradesh', '9811111128'),
(19, 'Krishna', 'Nambiar', 'krishna.n@student.edu', 2, 2021, 8.0, 'Coimbatore', 'Tamil Nadu', '9811111129'),
(20, 'Pari', 'Saxena', 'pari.s@student.edu', 4, 2022, 7.7, 'Indore', 'Madhya Pradesh', '9811111130'),
(21, 'Advait', 'Thakur', 'advait.t@student.edu', 1, 2021, 8.4, 'Nagpur', 'Maharashtra', '9811111131'),
(22, 'Sara', 'Khan', 'sara.k@student.edu', 3, 2020, 9.3, 'Bhopal', 'Madhya Pradesh', '9811111132'),
(23, 'Atharv', 'Choudhury', 'atharv.c@student.edu', 2, 2023, 6.8, 'Patna', 'Bihar', '9811111133'),
(24, 'Navya', 'Srinivasan', 'navya.s@student.edu', 6, 2022, 8.2, 'Madurai', 'Tamil Nadu', '9811111134'),
(25, 'Yash', 'Gokhale', 'yash.g@student.edu', 5, 2020, 9.4, 'Aurangabad', 'Maharashtra', '9811111135');

-- Courses
INSERT INTO courses VALUES
(1, 'CS101', 'Introduction to Programming', 4, 1, 1),
(2, 'CS201', 'Data Structures', 4, 1, 7),
(3, 'CS301', 'Database Systems', 3, 1, 8),
(4, 'CS401', 'Machine Learning', 4, 1, 1),
(5, 'EC101', 'Basic Electronics', 3, 2, 2),
(6, 'EC201', 'Digital Circuits', 4, 2, 9),
(7, 'ME101', 'Engineering Mechanics', 4, 3, 3),
(8, 'ME201', 'Thermodynamics', 3, 3, 10),
(9, 'CE101', 'Surveying', 3, 4, 4),
(10, 'MA101', 'Calculus', 4, 5, 5),
(11, 'MA201', 'Linear Algebra', 3, 5, 5),
(12, 'PH101', 'Physics I', 4, 6, 6);

-- Enrollments
INSERT INTO enrollments VALUES
(1, 1, 1, 'Fall 2022', 'A', 92),
(2, 1, 10, 'Fall 2022', 'A', 88),
(3, 2, 1, 'Fall 2022', 'A+', 96),
(4, 2, 2, 'Spring 2023', 'A', 90),
(5, 3, 2, 'Fall 2021', 'B+', 78),
(6, 3, 3, 'Spring 2022', 'A', 85),
(7, 4, 5, 'Fall 2022', 'A', 91),
(8, 5, 5, 'Fall 2021', 'B', 72),
(9, 6, 7, 'Fall 2023', 'A', 89),
(10, 7, 7, 'Fall 2022', 'B+', 76),
(11, 8, 9, 'Fall 2021', 'A', 93),
(12, 10, 10, 'Fall 2022', 'A+', 98),
(13, 11, 3, 'Spring 2021', 'A', 87),
(14, 12, 6, 'Fall 2020', 'A+', 95),
(15, 14, 12, 'Fall 2022', 'A', 90),
(16, 15, 1, 'Fall 2023', 'B+', 79),
(17, 16, 11, 'Spring 2022', 'A+', 97),
(18, 18, 2, 'Spring 2023', 'A', 88),
(19, 21, 4, 'Spring 2022', 'A', 86),
(20, 22, 8, 'Fall 2020', 'A+', 94),
(21, 25, 10, 'Fall 2020', 'A+', 99),
(22, 1, 2, 'Spring 2023', 'A', 91),
(23, 4, 6, 'Spring 2023', 'A', 89),
(24, 11, 4, 'Fall 2021', 'B+', 82),
(25, 2, 3, 'Fall 2023', 'A', 93);
