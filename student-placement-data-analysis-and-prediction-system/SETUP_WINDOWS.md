# Windows PowerShell Setup Guide
## Student Placement Data Analysis and Prediction System

Follow these step-by-step instructions in Windows PowerShell to set up and run the system locally with Python Flask and MySQL.

---

### Step 1: Clone or Navigate to the Project Folder
Open Windows PowerShell as an Administrator or regular user:
```powershell
cd C:\Projects\placement_analysis
```

---

### Step 2: Set Up Python Virtual Environment
Check that Python 3.10+ is installed:
```powershell
python --version
```
Create a dedicated virtual environment:
```powershell
python -m venv venv
```
Activate the virtual environment:
```powershell
# If execution policy blocks scripts, allow for CurrentUser first:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

.\venv\Scripts\Activate.ps1
```
*(Your PowerShell prompt will now show `(venv)`)*

---

### Step 3: Install Required Dependencies
Install all requirements from `requirements.txt`:
```powershell
pip install --upgrade pip
pip install -r requirements.txt
```

---

### Step 4: Configure MySQL Database
Make sure MySQL 8.0 Server is running (or via XAMPP / MySQL Workbench).
Connect to MySQL CLI:
```powershell
mysql -u root -p
```
Run the schema script:
```sql
SOURCE database/schema.sql;
SOURCE database/sample_data.sql;
SHOW TABLES IN placement_analysis;
EXIT;
```

---

### Step 5: Configure Environment Variables
Create your `.env` configuration file in PowerShell:
```powershell
Copy-Item .env.example .env
```
Edit `.env` with your MySQL credentials:
```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DB=placement_analysis
SECRET_KEY=placement_portal_secret_key_2024
```

---

### Step 6: Start the Flask Backend Server
Run the Flask server:
```powershell
python app.py
```
Output will confirm:
```text
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://127.0.0.1:5000
```

---

### Step 7: Access the System
Open your web browser and navigate to:
```text
http://127.0.0.1:5000
```
Default Administrator Login Credentials:
- **Email:** `tpo@university.edu.in`
- **Password:** `Placement@2024`
- **Role:** Placement Officer / Administrator
