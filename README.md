# Employee Management UI

A simple Employee Management page built with React, similar to an HRMS module. No backend or database is used. All data is managed with React state.

## Features

- View employees in a table (Employee ID, Name, Email, Department, Action)
- Search employees by name
- Add a new employee using a popup form
- Edit employee details
- Delete an employee with a confirmation dialog
- Form validation for all required fields
- Date of birth validation (1 January 1920 to today, future dates rejected)
- Add a new department directly from the department dropdown
- Success message after adding, updating or deleting an employee
- Responsive layout with a light lavender theme

## Tech Stack

- React.js (functional components)
- useState Hook
- Props and reusable components
- CSS
- Vite

## Project Structure

```
employee-management-ui/
├── public/
├── src/
│   ├── components/
│   │   ├── EmployeeForm.jsx    # Add / Edit form with validation
│   │   ├── EmployeeTable.jsx   # Employee listing table
│   │   ├── Message.jsx         # Success message
│   │   ├── Modal.jsx           # Reusable dialog
│   │   └── SearchBar.jsx       # Search input
│   ├── App.jsx                 # Main page and state management
│   ├── App.css                 # Component styles
│   ├── index.css               # Theme colors and base styles
│   └── main.jsx                # App entry point
├── index.html
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (LTS version)
- Git

### Installation

```bash
git clone https://github.com/<divyapriyameepl>/employee-management-ui.git
cd employee-management-ui
npm install
npm run dev
```

Open the local URL shown in the terminal (usually http://localhost:5173).

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## How It Works

- `App.jsx` holds the state: employees, departments, search text, form visibility and messages.
- Data flows down to child components using **props**.
- Child components send actions back up using callback props such as `onSave`, `onEdit` and `onDelete`.
- State is never changed directly. New arrays are created with `map`, `filter` and the spread operator.

## Branching Strategy

```
main
  └── develop
        └── feature/employee-management-ui
```

- `main`: stable code
- `develop`: development code
- `feature/employee-management-ui`: feature work

## Commit Message Convention

- `feat:` new feature
- `fix:` bug fix
- `style:` styling changes
- `docs:` documentation changes
- `chore:` setup and configuration

## Author

Divya Priya E