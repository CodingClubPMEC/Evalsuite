# Evalsuite: Jury Marking Platform

A modern evaluation platform for jury members to score and review teams participating in the events conducted by CDD at PMEC.

---

## 🚀 Overview

Evalsuite streamlines the entire judging workflow, from browsing jury profiles to entering marks and exporting final sheets, with a focus on reliability, simplicity, and offline-friendly usage.

---

## ✨ Features

### Marking Page

- Prominent jury information panel (photo, name, designation, department).
- Interactive marksheet table listing all participating teams.
- Real-time score calculation per team and per criterion.
- Automatic total computation with validation of maximum marks.
- One-click Excel export of complete marksheet.
- Responsive table with horizontal scrolling for smaller screens.

### Key Functionality

- **Team Management:**
  - Display of all participating teams (default: 5 teams).
  - Each team shows team name, project title, and member names.

- **Evaluation Criteria (Customizable):**
  - Example default criteria and maximum marks:
    - Innovation – 25
    - Feasibility – 20
    - Presentation – 15
    - Impact – 20
    - Technical Quality – 20

- **Score Validation:**
  - Inputs are restricted so that marks cannot exceed their respective max.
  - Visual feedback for invalid or missing scores where applicable.

- **Data Persistence:**
  - Automatic saving of scores in the browser using localStorage.
  - Protection against accidental refresh and tab closure.
  - Backup copy maintained before overwriting saved data.

- **Excel Export:**
  - Generate a formatted Excel file of all team scores.
  - Includes team-wise and criterion-wise breakdown along with totals.
  - Jury name and timestamp embedded in filename and sheet metadata.

- **Routing & Navigation:**
  - Fast navigation between homepage, jury profiles, and marking pages.
  - Separate marking views for each jury member (configurable via data).

---

## 🛠️ Tech Stack

### Frontend

- **Preact** (Vite-based setup) for a performant, React-compatible UI.
- **Tailwind CSS** for utility-first, responsive styling.
- **Preact Router** (or equivalent) for client-side navigation.
- **xlsx** (or compatible xlsx library) for Excel export on the client.

### Backend

- **Python FastAPI** for handling backend operations:
  - REST APIs for team, criteria, and score data (optional / configurable).
  - Potential integration with a database for centralized storage.

> Note: The app can work in a purely frontend + localStorage mode for quick internal deployments, or be connected to the FastAPI backend for more robust, multi-device persistence.

---

## 📋 Prerequisites

### Frontend

- Node.js (version 14 or higher)
- npm (Node Package Manager)

### Backend

- Python 3.9+
- FastAPI and Uvicorn (and any DB driver if you use a database)

---

## 📱 Responsive Design

Evalsuite is fully responsive and tested on:

- Desktop and laptops (large and wide screens)
- Tablets (portrait and landscape)
- Smartphones (small and medium screens)

Tables support horizontal scrolling on smaller devices without breaking layout.

---

## 💾 Data Persistence & Safety

The application is designed to minimize data loss:

- **Auto-save:**
  - Scores are automatically saved every few seconds as you type.

- **Page Refresh Protection:**
  - Data is reloaded from localStorage on page refresh or browser reopen.

- **Backup & Restore:**
  - Before overriding existing data, a backup copy is stored.
  - Basic recovery logic can restore from backup if corruption is detected.

- **Save Status Indicator:**
  - A visual indicator shows states such as "Saving…", "Saved", or "Error".

- **Offline Support:**
  - All data is stored in the browser, so the app keeps working without internet after initial load.

(If connected to a FastAPI backend and database, centralized persistence and cross-device access become possible while local fallback can still be retained if desired.)

---

## 🔒 Excel Export Details

When the jury clicks **"Save Marksheet"** / **"Export to Excel"**:

- An Excel file is generated containing:
  - Jury information (name, ID, department).
  - Each team's scores across all criteria.
  - Maximum marks per criterion.
  - Calculated total score per team.

- The filename includes:
  - Jury identifier or name.
  - Timestamp (date and time of export).

- Columns are formatted with readable widths and sensible ordering.

---

## 🤝 Contributing & Future Enhancements

Evalsuite is currently an MVP built for the events of CDD. Planned and potential future improvements include:

- Secure authentication and role-based access control for jury members.
- Full database integration (PostgreSQL, SQLite, etc.) via FastAPI.
- Real-time synchronization and collaboration between multiple juries.
- Aggregated analytics dashboards (rankings, averages, criterion weight tuning).
- A dedicated mobile app or PWA mode for offline-first judging.

Contributions, suggestions, and feature requests are welcome.

---

## 📞 Support

For technical issues, feature requests, or deployment help, please contact:
Happy judging and good luck to all teams! 🏆

