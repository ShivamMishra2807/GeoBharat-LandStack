# 🇮🇳 GeoBharat LandStack 2026
Live Demo : https://geo-bharat-land-stack.vercel.app/
### National 3-Layer GIS Land Governance Platform • Bhu-Aadhaar (ULPIN)

GeoBharat is a pan-Indian, multi-tier cadastral land governance platform built to demonstrate seamless citizen services, revenue department scrutiny workflows, cross-departmental synchronization (SRO, Revenue, Town Planning, Municipal Tax), and universal regional unit normalization.

---

## 📋 Table of Contents
1. [System Architecture](#system-architecture)
2. [Prerequisites](#prerequisites)
3. [macOS & Linux Setup Guide](#macos--linux-setup-guide)
4. [Windows Setup Guide (PowerShell & CMD)](#windows-setup-guide-powershell--cmd)
5. [Configuration & Execution Modes](#configuration--execution-modes)
6. [Demo Accounts & Credentials](#demo-accounts--credentials)
7. [Citizen to Admin Scrutiny Workflow](#citizen-to-admin-scrutiny-workflow)
8. [Troubleshooting & FAQs](#troubleshooting--faqs)

---

## 🏗 System Architecture

The project consists of two coordinated layers:
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Leaflet / GIS GeoJSON vector layer rendering, multi-language support (9 Indian languages), and universal land unit conversion engine.
- **Backend**: Python 3, Django 5+, Django REST Framework (DRF), SQLite database (with optional PostgreSQL/PostGIS support), automated cross-departmental webhooks, and audit logging.

---

## ⚙️ Prerequisites

Before getting started, make sure you have the following installed on your machine:
- **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **Python**: v3.10, v3.11, v3.12, or v3.13 ([Download Python](https://www.python.org/))
- **Git**: (Optional, recommended)

Verify your installations in your terminal:
```bash
node -v
npm -v
python3 --version   # (On Windows: py --version or python --version)
```

---

## 🍎 macOS & Linux Setup Guide

Follow these simple steps in your **Terminal**:

### Step 1: Open Terminal & Navigate to Project Directory
```bash
cd "GeoBharat Landstack 2026"
```

### Step 2: Set Up and Run the Django Backend
Open a terminal window:

```bash
# 1. Navigate to backend
cd backend

# 2. (Recommended) Create and activate Python virtual environment
python3 -m venv venv
source venv/bin/activate

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Apply database migrations
python manage.py migrate

# 5. Populate demo cadastral records & parcels
python manage.py seed_demo

# 6. Start the Django backend server
python manage.py runserver 127.0.0.1:8000
```
> The Django REST API will be accessible at: `http://127.0.0.1:8000/api/v1/`

---

### Step 3: Set Up and Run the React Frontend
Open a **second** terminal window:

```bash
# 1. Navigate to the project root
cd "GeoBharat Landstack 2026"

# 2. Install npm dependencies
npm install

# 3. Start the Vite development server
npm run dev
```
> Open your browser at: **`http://127.0.0.1:5173/`** or **`http://localhost:5173/`**

---

## 🪟 Windows Setup Guide (PowerShell & CMD)

Follow these steps using **PowerShell** or **Command Prompt**:

### Step 1: Navigate to Project Directory
```powershell
cd "GeoBharat Landstack 2026"
```

### Step 2: Set Up and Run the Django Backend
Open **PowerShell Window 1**:

```powershell
# 1. Navigate to backend
cd backend

# 2. (Optional but recommended) If running scripts is disabled in PowerShell:
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# 3. Create and activate virtual environment
py -m venv venv
.\venv\Scripts\Activate.ps1

# 4. Install backend dependencies
pip install -r requirements.txt

# 5. Run database migrations
py manage.py migrate

# 6. Seed demo parcels and revenue dossiers
py manage.py seed_demo

# 7. Start Django server
py manage.py runserver 127.0.0.1:8000
```
> *(If `py` command is not found, replace `py` with `python`)*

---

### Step 3: Set Up and Run the React Frontend
Open **PowerShell Window 2**:

```powershell
# 1. Navigate to project root
cd "GeoBharat Landstack 2026"

# 2. Install frontend packages
npm install

# 3. Start the Vite dev server
npm run dev
```
> Open your browser and visit: **`http://127.0.0.1:5173/`**

---

## 🔧 Configuration & Execution Modes

The project supports two execution modes configured via the `.env` file in the project root:

### Mode A: Full-Stack Mode with Live Django API (Default)
In `.env`:
```env
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```
- In this mode, the frontend interacts directly with the live Django REST backend SQLite database.
- Petitions, scrutiny queue actions, mutations, and analytics are persisted in `backend/db.sqlite3`.

### Mode B: Standalone Frontend Demo Mode (Zero Backend Required)
In `.env`:
```env
VITE_USE_MOCK=true
```
- If you only want to demonstrate the application without running Python/Django, set `VITE_USE_MOCK=true`.
- The built-in browser mock adapter simulates all endpoints with instant responses, full localStorage persistence, and two-way scrutiny queue synchronization.

---

## 👥 Demo Accounts & Credentials

The system includes pre-configured roles with strict role-based access control (RBAC):

| Role | Name | Email / Username | Password | Features / Access |
| :--- | :--- | :--- | :--- | :--- |
| **Citizen (A)** | Ramesh Dnyandev Patil | `ramesh.patil@example.in` | `citizen123` | Personal dashboard, My Land holdings (Haveli), apply for mutations, certified 7/12 extracts. |
| **Citizen (B)** | Sunita Suresh Gaikwad | `sunita.gaikwad@example.in` | `citizen123` | Commercial parcel holder (Wagholi), building permission NOC petitions. |
| **Official (Admin)** | Dr. Vikramaditya Shinde, IAS | `admin` | `admin123` | Sub-Divisional Officer (SDO) Console, Department Scrutiny Queue, digital signing, cross-department simulator. |

> **Quick Login Tip**: The landing page includes one-click demo chips to immediately sign in as Ramesh Patil, Sunita Gaikwad, or Dr. Shinde without typing credentials!

---

## 🔄 Citizen to Admin Scrutiny Workflow

To test the synchronization between citizen requests and admin scrutinies:

1. **Log in as Citizen**:
   - Go to `http://localhost:5173/login` and choose **Citizen A (Ramesh Patil)**.
2. **Submit a Petition**:
   - Go to **Citizen Petitions** (`/portal`) from the sidebar navigation.
   - Fill in the **Apply for Land Administration Service** form (e.g. choose *Mutation Application (Varas/Succession)* or *Boundary Demarcation*).
   - Enter application notes and click **Submit Application to Revenue Desk**.
   - Note the generated Docket Number (e.g. `REQ-2026-XXXX`).
   - The status shows **Submitted & In Queue** in the citizen tracker.
3. **Log Out**:
   - Click the red **Logout** button in the top navbar.
4. **Log in as Administrator**:
   - Select **Admin: Dr. Shinde (IAS)**.
   - Navigate to the **Admin Console / Admin Scrutiny** (`/admin`).
5. **Inspect the Scrutiny Queue**:
   - In the **Pending Scrutiny Dossiers** section, you will see your submitted citizen petition at the top of the table.
   - Filter tabs allow quick toggling: **All**, **Pending Scrutiny**, and **Approved**.
6. **Take Action (Scrutiny)**:
   - Click the **Scrutiny** button on the petition row.
   - Review applicant credentials, target ULPIN, survey number, and attached scrutiny dossier documents.
   - Add official remarks (e.g. *"Documents verified by circle officer. Sanctioned."*).
   - Click **Approve & Digital Sign** (or *Reject / Query Back*).
7. **Verify Synchronization**:
   - The admin queue immediately updates status to **Approved & Certified**.
   - If you switch back to the Citizen Portal, the petition tracker displays **Approved & Certified** with all workflow stages completed!

---

## 🧭 Key Platform Features

- **National Cadastral GIS Map (`/map`)**:
  - Interactive multi-layer cadastral boundary viewer with WGS84 coordinates.
  - Switchable Basemaps: Google Hybrid Satellite, Cadastral Canvas, and OpenStreetMap.
  - DoLR Pilot Filters (Chandigarh Urban Pilot vs. Tamil Nadu Rural Pilot).
  - Spatial layer toggles: Cadastral Boundaries & ULPIN, Record of Rights (RoR), Master Plan Zoning, and Utility Infrastructure overlays.
- **Universal Land Unit Normalizer & Lexicon**:
  - Pan-Indian cadastral unit converter: converts natively between **Guntha** (MH/KA), **Pakka & Kaccha Bigha** (UP/Bihar/MP/RJ), **Cent** (TN/KL), **Ground** (Chennai), **Are**, **Hectare**, **Acre**, and **Square Meters**.
  - Built-in Pan-Indian Land Terminology Glossary (ULPIN, 7/12 & 8A, Khatauni, Khasra, Patta & Chitta, RTC Pahani, PR Card, Ferfar / Dakhil-Kharij).
- **Multilingual Experience**:
  - Switch instantly between 9 Indian languages: English, हिन्दी (Hindi), मराठी (Marathi), தமிழ் (Tamil), తెలుగు (Telugu), ಕನ್ನಡ (Kannada), ਪੰਜਾਬੀ (Punjabi), ગુજરાતી (Gujarati), and বাংলা (Bengali).
- **Dark Mode Support**:
  - Full high-contrast dark mode toggle in the top navigation bar.

---

## ❓ Troubleshooting & FAQs

#### 1. Port 8000 or 5173 is already in use
- **macOS / Linux**:
  ```bash
  lsof -ti :8000 | xargs kill -9
  lsof -ti :5173 | xargs kill -9
  ```
- **Windows (PowerShell)**:
  ```powershell
  Stop-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess -Force
  Stop-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess -Force
  ```

#### 2. Rollup optional dependency warning on macOS Apple Silicon (M1/M2/M3/M4)
If you ever see a Rollup platform error on Mac, run:
```bash
npm install --no-save @rollup/rollup-darwin-arm64
```

#### 3. Execution of scripts is disabled on Windows PowerShell
Open PowerShell as Administrator or run:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

#### 4. Need a fresh database reset
To reset the Django SQLite database to clean demo state:
```bash
cd backend
rm db.sqlite3  # On Windows: del db.sqlite3
python manage.py migrate
python manage.py seed_demo
```

---

## 📜 License & Acknowledgements
GeoBharat LandStack is designed and structured in compliance with Department of Land Resources (DoLR), Ministry of Rural Development, Government of India guidelines for Digital India Land Records Modernization Programme (DILRMP) and ULPIN (Bhu-Aadhaar) standards.
