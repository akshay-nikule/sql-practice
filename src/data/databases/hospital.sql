-- =============================================
-- Hospital Database - Indian Data
-- =============================================

-- Patients Table
CREATE TABLE patients (
    patient_id INTEGER PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    gender TEXT CHECK(gender IN ('M', 'F', 'O')),
    birth_date TEXT,
    city TEXT,
    state TEXT,
    phone TEXT,
    allergies TEXT
);

-- Doctors Table
CREATE TABLE doctors (
    doctor_id INTEGER PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    speciality TEXT,
    department_id INTEGER,
    phone TEXT,
    salary INTEGER
);

-- Departments Table
CREATE TABLE departments (
    department_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    head_doctor_id INTEGER,
    floor INTEGER
);

-- Admissions Table
CREATE TABLE admissions (
    admission_id INTEGER PRIMARY KEY,
    patient_id INTEGER,
    doctor_id INTEGER,
    admission_date TEXT,
    discharge_date TEXT,
    diagnosis TEXT,
    room_number INTEGER
);

-- =============================================
-- Sample Data
-- =============================================

-- Departments
INSERT INTO departments VALUES
(1, 'Cardiology', 1, 2),
(2, 'Neurology', 2, 3),
(3, 'Orthopedics', 3, 1),
(4, 'Pediatrics', 4, 2),
(5, 'Emergency', 5, 1),
(6, 'Oncology', 6, 4);

-- Doctors (Indian Names)
INSERT INTO doctors VALUES
(1, 'Rajesh', 'Sharma', 'Cardiologist', 1, '9876543210', 250000),
(2, 'Priya', 'Patel', 'Neurologist', 2, '9876543211', 280000),
(3, 'Vikram', 'Singh', 'Orthopedic Surgeon', 3, '9876543212', 320000),
(4, 'Anita', 'Gupta', 'Pediatrician', 4, '9876543213', 200000),
(5, 'Suresh', 'Kumar', 'Emergency Medicine', 5, '9876543214', 220000),
(6, 'Deepa', 'Reddy', 'Oncologist', 6, '9876543215', 350000),
(7, 'Amit', 'Joshi', 'Cardiologist', 1, '9876543216', 180000),
(8, 'Neha', 'Verma', 'Neurologist', 2, '9876543217', 190000),
(9, 'Rahul', 'Deshmukh', 'General Physician', 5, '9876543218', 150000),
(10, 'Kavita', 'Iyer', 'Pediatrician', 4, '9876543219', 175000);

-- Patients (Indian Names & Cities)
INSERT INTO patients VALUES
(1, 'Aarav', 'Mehta', 'M', '1985-03-15', 'Mumbai', 'Maharashtra', '9898123456', NULL),
(2, 'Saanvi', 'Kulkarni', 'F', '1990-07-22', 'Pune', 'Maharashtra', '9898123457', 'Penicillin'),
(3, 'Vivaan', 'Chopra', 'M', '1978-11-08', 'Delhi', 'Delhi', '9898123458', NULL),
(4, 'Aanya', 'Nair', 'F', '2010-05-30', 'Chennai', 'Tamil Nadu', '9898123459', 'Dust'),
(5, 'Arjun', 'Rao', 'M', '1965-01-12', 'Bengaluru', 'Karnataka', '9898123460', 'Sulfa'),
(6, 'Diya', 'Pillai', 'F', '1995-09-18', 'Hyderabad', 'Telangana', '9898123461', NULL),
(7, 'Kabir', 'Malhotra', 'M', '2005-12-25', 'Jaipur', 'Rajasthan', '9898123462', NULL),
(8, 'Myra', 'Banerjee', 'F', '1988-04-03', 'Kolkata', 'West Bengal', '9898123463', 'Aspirin'),
(9, 'Reyansh', 'Thakur', 'M', '1972-08-17', 'Lucknow', 'Uttar Pradesh', '9898123464', NULL),
(10, 'Ishita', 'Saxena', 'F', '2015-02-28', 'Ahmedabad', 'Gujarat', '9898123465', 'Peanuts'),
(11, 'Aditya', 'Bhat', 'M', '1955-06-10', 'Nagpur', 'Maharashtra', '9898123466', 'Codeine'),
(12, 'Ananya', 'Shetty', 'F', '1983-10-05', 'Mangalore', 'Karnataka', '9898123467', NULL),
(13, 'Rohan', 'Patil', 'M', '1998-07-14', 'Nashik', 'Maharashtra', '9898123468', NULL),
(14, 'Kiara', 'George', 'F', '2008-03-22', 'Kochi', 'Kerala', '9898123469', 'Latex'),
(15, 'Vihaan', 'Choudhary', 'M', '1969-12-01', 'Chandigarh', 'Punjab', '9898123470', NULL),
(16, 'Avni', 'Das', 'F', '1992-11-11', 'Bhubaneswar', 'Odisha', '9898123471', NULL),
(17, 'Dhruv', 'Menon', 'M', '1980-05-25', 'Thiruvananthapuram', 'Kerala', '9898123472', 'Ibuprofen'),
(18, 'Riya', 'Agarwal', 'F', '2001-08-08', 'Varanasi', 'Uttar Pradesh', '9898123473', NULL),
(19, 'Krishna', 'Jain', 'M', '1975-04-17', 'Indore', 'Madhya Pradesh', '9898123474', NULL),
(20, 'Pari', 'Kapoor', 'F', '1960-09-30', 'Amritsar', 'Punjab', '9898123475', 'Morphine');

-- Admissions
INSERT INTO admissions VALUES
(1, 1, 1, '2024-01-15', '2024-01-20', 'Heart Attack', 101),
(2, 2, 2, '2024-01-18', '2024-01-25', 'Migraine', 205),
(3, 3, 3, '2024-02-01', '2024-02-10', 'Fracture', 110),
(4, 4, 4, '2024-02-05', '2024-02-07', 'Fever', 302),
(5, 5, 1, '2024-02-10', NULL, 'Angina', 102),
(6, 6, 5, '2024-02-15', '2024-02-16', 'Food Poisoning', 401),
(7, 7, 4, '2024-02-20', '2024-02-22', 'Appendicitis', 305),
(8, 8, 2, '2024-03-01', '2024-03-08', 'Epilepsy', 210),
(9, 9, 6, '2024-03-05', NULL, 'Cancer', 501),
(10, 10, 4, '2024-03-10', '2024-03-12', 'Asthma', 303),
(11, 11, 1, '2024-03-15', '2024-03-25', 'Heart Surgery', 105),
(12, 12, 3, '2024-03-18', '2024-03-28', 'Hip Replacement', 115),
(13, 13, 5, '2024-03-20', '2024-03-21', 'Accident', 402),
(14, 14, 4, '2024-03-22', '2024-03-24', 'Tonsillitis', 310),
(15, 15, 6, '2024-03-25', NULL, 'Leukemia', 505),
(16, 1, 7, '2024-04-01', '2024-04-05', 'Chest Pain', 108),
(17, 3, 8, '2024-04-10', '2024-04-15', 'Stroke', 215),
(18, 6, 9, '2024-04-12', '2024-04-13', 'Dehydration', 405),
(19, 8, 2, '2024-04-18', '2024-04-22', 'Dementia', 220),
(20, 12, 10, '2024-04-20', '2024-04-23', 'Allergy', 315);
