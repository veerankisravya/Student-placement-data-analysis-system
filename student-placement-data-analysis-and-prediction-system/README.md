# Student Placement Data Analysis and Prediction System
**B.Tech Final Year Engineering Capstone Project**

---

## 1. Project Overview
The **Student Placement Data Analysis and Prediction System** is a professional, institutional-grade web application engineered to monitor, analyze, and forecast student campus placement performance. It integrates relational database analytics (MySQL), statistical data processing (Pandas/NumPy), and machine learning regression algorithms (Scikit-Learn) with an enterprise SaaS dashboard.

---

## 2. Core Modules & System Architecture
1. **Authentication & Role-Based Access Control (RBAC):**
   - Secure login for Placement Officers, Deans, and Department Faculty.
   - Password hashing and session integrity.
2. **Executive Placement Dashboard:**
   - 6 KPI Metrics: Total Students, Placed, Seeking, Placement %, Average CTC, Highest CTC.
   - Interactive Doughnut, Grouped Bar, Trend Line, and CTC Histogram charts.
3. **Student Profile & Records Management:**
   - Searchable, multi-filtered (Branch, CGPA, Batch Year, Status), sortable data grid.
   - Full CRUD operations with modal validation.
   - One-click CSV and Excel (.xls) exports.
4. **Academic Performance & Factor Analysis:**
   - CGPA correlation, Technical vs Aptitude assessment score analysis, and Internship experience correlation.
   - Statistical rigor documentation establishing that correlation does not imply direct causation.
5. **Machine Learning Placement Predictor:**
   - Calibrated logistic regression scoring engine.
   - Probability calculation, factor sensitivity breakdown, and personalized candidate recommendations.
6. **Recruiter & Corporate Partner Analytics:**
   - Company tier classification (Super Dream > 15 LPA, Dream 8-15 LPA, Regular < 8 LPA).
   - Recruiter intake vs average compensation benchmarks.
7. **Official Reporting & NAAC/NIRF Documentation:**
   - Audit-ready institutional placement statements with printable formatting.

---

## 3. Database Schema Overview
The system uses MySQL database `placement_analysis`:
- **`users`**: Administrator credentials, roles, institutional affiliation.
- **`students`**: Comprehensive academic metrics (CGPA, backlogs, aptitude, technical score, communication, internships, placement status, package).
- **`companies`**: Recruiter directories, package tiers, domain sectors, hiring volume.
- **`academic_years`**: Historical YoY placement trends and growth metrics.
- **`placements`**: Granular offer letters and audit records.

---

## 4. Verification Test Cases

| Test Case ID | Feature / Component | Input / Action | Expected Result |
| :--- | :--- | :--- | :--- |
| **TC-01** | User Authentication | Login with `tpo@university.edu.in` and valid password | Authenticated session created; dashboard opens with officer profile. |
| **TC-02** | Student Add (CRUD) | Submit student with valid metrics & CGPA = 8.5 | New record added to state/database; table counter increments immediately. |
| **TC-03** | Backlog Filtering | Filter students with Backlogs > 0 | Grid isolates candidates with pending backlog flags. |
| **TC-04** | CSV / Excel Export | Click "CSV" or "Excel (.xls)" button | Formatted file downloaded with complete student academic fields. |
| **TC-05** | ML Predictor (High Tier) | Input CGPA=9.4, Backlogs=0, Tech=95, Apt=90, Intern=6mo | Model predicts >90% probability and Super Dream tier (18-42 LPA). |
| **TC-06** | ML Predictor (At Risk) | Input CGPA=6.2, Backlogs=2, Tech=60, Apt=55, Intern=0mo | Model identifies active backlog penalty and advises backlog clearance priority. |
| **TC-07** | Theme Toggle | Switch between Light and Dark mode | Palette transitions seamlessly without layout shift or broken contrast. |
| **TC-08** | Print / PDF Report | Click "Print / PDF Document" | Print media styling renders clean institutional letterhead and signatures. |
