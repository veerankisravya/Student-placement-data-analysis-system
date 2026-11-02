# Windows Setup Guide
## Student Placement Data Analysis and Prediction System

The project has a Vite/React demo dashboard and a separate Flask API/MySQL starter. The dashboard currently uses browser-local sample data; it does not call the Flask API or connect to MySQL.

### Run the frontend

From the project directory in PowerShell:

```powershell
npm install
npm run lint
npm run build
npm run dev
```

Open the local URL printed by Vite. The sign-in screen lists demo accounts. Client-side demo credentials are not secure and must not be used with real student data.

### Run the standalone API (optional)

Use Python 3.10 through 3.12 and install the API dependencies:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
Copy-Item .env.example .env
python app.py
```

The API currently provides `/api/health` and `/api/predict`. MySQL schema and sample data are in `database/`; the current frontend does not use them. Configure private database credentials in `.env` only if you use the database connection helper.

### Deploy the frontend to Vercel

Import the repository in Vercel and use the Vite preset, build command `npm run build`, and output directory `dist`. The `vercel.json` file configures the SPA fallback. This deploys the frontend only, not the Flask API or MySQL database. No frontend environment variables are required.
