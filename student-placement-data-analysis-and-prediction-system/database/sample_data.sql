USE `placement_analysis`;

-- Insert default admin & staff users (passwords hashed via Werkzeug / bcrypt for 'Placement@2024')
INSERT INTO `users` (`name`, `email`, `password_hash`, `role`, `college_name`) VALUES
('Dr. Rajeshwar Sharma', 'tpo@university.edu.in', 'scrypt:32768:8:1$kXm9J...$PlacementHash2024', 'Placement Officer', 'National Institute of Technology & Engineering'),
('Prof. K. Venkatesh', 'dean@university.edu.in', 'scrypt:32768:8:1$kXm9J...$AcademicHash2024', 'Dean / Administrator', 'National Institute of Technology & Engineering'),
('Dr. Meenakshi Rao', 'faculty.cse@university.edu.in', 'scrypt:32768:8:1$kXm9J...$FacultyHash2024', 'Department Faculty', 'National Institute of Technology & Engineering');

-- Academic Years Statistics
INSERT INTO `academic_years` (`year`, `total_enrolled`, `placed_count`, `placement_rate`, `avg_package_lpa`, `highest_package_lpa`) VALUES
(2021, 320, 242, 75.60, 7.40, 32.00),
(2022, 350, 280, 80.00, 8.20, 38.00),
(2023, 380, 323, 85.00, 9.60, 42.00),
(2024, 410, 365, 89.00, 11.40, 44.00),
(2025, 430, 395, 91.80, 12.80, 48.00);

-- Companies Registry
INSERT INTO `companies` (`id`, `name`, `tier`, `industry`, `avg_package_lpa`, `highest_package_lpa`, `recruited_count`) VALUES
('CMP-01', 'Google', 'Super Dream (> 15 LPA)', 'Technology / Cloud / AI', 38.50, 44.00, 4),
('CMP-02', 'Microsoft', 'Super Dream (> 15 LPA)', 'Software / Cloud', 32.00, 42.00, 6),
('CMP-03', 'Amazon', 'Super Dream (> 15 LPA)', 'E-Commerce / Cloud', 28.50, 36.00, 7),
('CMP-04', 'Goldman Sachs', 'Super Dream (> 15 LPA)', 'FinTech / Quantitative Finance', 24.00, 26.50, 5),
('CMP-05', 'Cisco Systems', 'Dream (8-15 LPA)', 'Networking & Cybersecurity', 14.80, 18.00, 8),
('CMP-06', 'Oracle', 'Dream (8-15 LPA)', 'Database & Cloud Applications', 13.50, 16.00, 6),
('CMP-07', 'Deloitte USI', 'Dream (8-15 LPA)', 'Consulting & Technology', 9.60, 11.20, 14),
('CMP-08', 'Tata Consultancy Services', 'Regular (< 8 LPA)', 'IT Services & Digital Transformation', 6.80, 9.00, 22),
('CMP-09', 'Infosys Limited', 'Regular (< 8 LPA)', 'IT Solutions & Business Consulting', 6.20, 9.50, 18),
('CMP-10', 'Larsen & Toubro (L&T)', 'Regular (< 8 LPA)', 'Engineering & Construction', 6.50, 8.50, 9),
('CMP-11', 'Tata Motors', 'Regular (< 8 LPA)', 'Automotive & Manufacturing', 7.20, 8.80, 7),
('CMP-12', 'Accenture', 'Regular (< 8 LPA)', 'IT & Cloud Consulting', 6.50, 10.00, 16);

-- Realistic Student Sample Cohort
INSERT INTO `students` (`id`, `name`, `email`, `gender`, `department`, `cgpa`, `backlogs`, `aptitude_score`, `technical_score`, `communication_score`, `technical_skills`, `internship_months`, `placement_status`, `company_name`, `package_lpa`, `graduation_year`, `placed_date`) VALUES
('STU-2024-001', 'Aarav Sharma', 'aarav.sharma@campus.edu.in', 'Male', 'Computer Science (CSE)', 9.42, 0, 94, 96, 88, 'Python, C++, Data Structures, System Design, React', 6, 'Placed', 'Google', 44.00, 2024, '2024-03-15'),
('STU-2024-002', 'Ananya Reddy', 'ananya.reddy@campus.edu.in', 'Female', 'Computer Science (CSE)', 9.15, 0, 91, 93, 92, 'Java, Spring Boot, Microservices, AWS, SQL', 5, 'Placed', 'Microsoft', 42.00, 2024, '2024-02-18'),
('STU-2024-003', 'Rohan Verma', 'rohan.verma@campus.edu.in', 'Male', 'AI & Data Science (AI&DS)', 8.88, 0, 89, 91, 85, 'Python, TensorFlow, PyTorch, Data Analysis, NLP', 6, 'Placed', 'Amazon', 36.00, 2024, '2024-03-02'),
('STU-2024-004', 'Pooja Iyer', 'pooja.iyer@campus.edu.in', 'Female', 'Information Technology (IT)', 8.95, 0, 92, 89, 90, 'C++, Python, Algorithms, Docker, Kubernetes', 4, 'Placed', 'Goldman Sachs', 26.50, 2024, '2024-01-22'),
('STU-2024-005', 'Karthik Menon', 'karthik.menon@campus.edu.in', 'Male', 'Electronics & Communication (ECE)', 8.62, 0, 86, 84, 82, 'Verilog, VLSI Design, Embedded C, Python, IoT', 3, 'Placed', 'Cisco Systems', 18.00, 2024, '2024-02-10'),
('STU-2024-006', 'Sneha Patil', 'sneha.patil@campus.edu.in', 'Female', 'Computer Science (CSE)', 8.54, 0, 84, 87, 88, 'Java, JavaScript, React, Node.js, MongoDB', 4, 'Placed', 'Oracle', 16.00, 2024, '2024-02-28'),
('STU-2024-007', 'Aditya Deshmukh', 'aditya.deshmukh@campus.edu.in', 'Male', 'Mechanical Engineering (ME)', 7.92, 0, 78, 80, 76, 'SolidWorks, ANSYS, AutoCAD, Python, Thermal Engg', 3, 'Placed', 'Tata Motors', 8.80, 2024, '2024-03-20'),
('STU-2024-008', 'Meera Nair', 'meera.nair@campus.edu.in', 'Female', 'Civil Engineering (CE)', 8.21, 0, 80, 82, 84, 'AutoCAD, STAAD Pro, Revit, Structural Analysis', 2, 'Placed', 'Larsen & Toubro (L&T)', 8.50, 2024, '2024-04-05'),
('STU-2024-009', 'Vikram Joshi', 'vikram.joshi@campus.edu.in', 'Male', 'Information Technology (IT)', 7.85, 0, 79, 78, 86, 'SQL, Power BI, Python, Business Analysis, Excel', 3, 'Placed', 'Deloitte USI', 10.50, 2024, '2024-01-15'),
('STU-2024-010', 'Tanvi Kulkarni', 'tanvi.kulkarni@campus.edu.in', 'Female', 'Computer Science (CSE)', 7.45, 0, 75, 76, 78, 'Java, SQL, HTML/CSS, JavaScript', 2, 'Placed', 'Tata Consultancy Services', 7.50, 2024, '2024-02-05'),
('STU-2024-011', 'Siddharth Rao', 'siddharth.rao@campus.edu.in', 'Male', 'AI & Data Science (AI&DS)', 9.35, 0, 95, 94, 90, 'Python, PyTorch, Computer Vision, CUDA, FastAPI', 6, 'Placed', 'Microsoft', 38.00, 2024, '2024-03-12'),
('STU-2024-012', 'Divya Bhat', 'divya.bhat@campus.edu.in', 'Female', 'Electronics & Communication (ECE)', 7.32, 1, 68, 72, 74, 'C, Microcontrollers, MATLAB, Python', 1, 'Placed', 'Infosys Limited', 6.20, 2024, '2024-04-12'),
('STU-2024-013', 'Harsh Vardhan', 'harsh.vardhan@campus.edu.in', 'Male', 'Mechanical Engineering (ME)', 6.85, 2, 62, 65, 68, 'AutoCAD, Manufacturing Processes, MS Excel', 0, 'Not Placed', NULL, NULL, 2024, NULL),
('STU-2024-014', 'Ishaan Gupta', 'ishaan.gupta@campus.edu.in', 'Male', 'Computer Science (CSE)', 6.72, 1, 65, 68, 64, 'C, Basic Python, HTML', 0, 'Not Placed', NULL, NULL, 2024, NULL),
('STU-2024-015', 'Riya Sen', 'riya.sen@campus.edu.in', 'Female', 'Civil Engineering (CE)', 6.94, 1, 60, 64, 70, 'Surveying, AutoCAD Basic, Estimating', 0, 'Not Placed', NULL, NULL, 2024, NULL),
('STU-2024-016', 'Varun Pillai', 'varun.pillai@campus.edu.in', 'Male', 'Information Technology (IT)', 8.35, 0, 82, 85, 80, 'Java, Spring, PostgreSQL, Docker', 3, 'Placed', 'Cisco Systems', 14.50, 2024, '2024-02-14'),
('STU-2024-017', 'Kavya Singhal', 'kavya.singhal@campus.edu.in', 'Female', 'Computer Science (CSE)', 8.78, 0, 88, 90, 86, 'Python, Django, React, GraphQL, AWS', 4, 'Placed', 'Amazon', 29.00, 2024, '2024-01-30'),
('STU-2024-018', 'Manish Tiwari', 'manish.tiwari@campus.edu.in', 'Male', 'Electronics & Communication (ECE)', 7.65, 0, 74, 76, 78, 'C++, Digital Circuits, MATLAB, Wireless Comms', 2, 'Placed', 'Accenture', 6.50, 2024, '2024-03-08'),
('STU-2024-019', 'Pooja Agarwal', 'pooja.agarwal@campus.edu.in', 'Female', 'AI & Data Science (AI&DS)', 8.15, 0, 81, 83, 85, 'R, Python, Tableau, Machine Learning, SQL', 3, 'Placed', 'Deloitte USI', 9.80, 2024, '2024-02-24'),
('STU-2024-020', 'Pranav Nair', 'pranav.nair@campus.edu.in', 'Male', 'Mechanical Engineering (ME)', 7.20, 1, 71, 73, 72, 'AutoCAD, Thermodynamics, CNC Programming', 1, 'Placed', 'Tata Consultancy Services', 6.50, 2024, '2024-03-18');
