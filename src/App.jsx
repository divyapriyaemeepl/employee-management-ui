import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import EmployeeTable from "./components/EmployeeTable";
import EmployeeForm from "./components/EmployeeForm";
import Message from "./components/Message";
import Modal from "./components/Modal";
import "./App.css";

const API_URL = "http://localhost:5000/api/employees";

function App() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState(["IT", "HR", "Finance"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  const showError = (text) => {
    setError(text);
    setTimeout(() => setError(""), 4000);
  };

  // ---------- VIEW: load employees when the page opens ----------
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to load employees");
        const data = await res.json();
        setEmployees(data);

        // keep any departments already used by saved employees
        setDepartments((prev) => [
          ...new Set([...prev, ...data.map((emp) => emp.department)]),
        ]);
      } catch (err) {
        console.error(err);
        showError("Could not load employees. Is the backend running?");
      }
    };

    loadEmployees();
  }, []);

  const addDepartment = (name) => {
    setDepartments((prev) => [...prev, name]);
  };

  const handleAddClick = () => {
    setEditingEmployee(null);
    setShowForm(true);
  };

  const handleEditClick = (employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingEmployee(null);
  };

  // ---------- ADD and EDIT ----------
  const handleSave = async (data) => {
    try {
      if (editingEmployee) {
        // EDIT -> PUT
        const res = await fetch(`${API_URL}/${editingEmployee.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to update employee");

        const updated = await res.json();
        setEmployees((prev) =>
          prev.map((emp) => (emp.id === updated.id ? updated : emp))
        );
        showMessage("Employee updated successfully!");
      } else {
        // ADD -> POST
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to add employee");

        const created = await res.json();
        setEmployees((prev) => [...prev, created]);
        showMessage("Employee added successfully!");
      }
      closeForm();
    } catch (err) {
      console.error(err);
      showError("Something went wrong. Please try again.");
    }
  };

  // ---------- DELETE ----------
  const confirmDelete = async () => {
    try {
      const res = await fetch(`${API_URL}/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete employee");

      setEmployees((prev) => prev.filter((emp) => emp.id !== deleteTarget.id));
      showMessage("Employee deleted successfully!");
    } catch (err) {
      console.error(err);
      showError("Could not delete the employee.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <header className="app-header">
        <span className="brand">Employee HRMS</span>
        <nav aria-label="Main">
          <a className="nav-link" href="#employees" aria-current="page">
            Employees
          </a>
        </nav>
      </header>

      <main className="container" id="employees">
        <h1>Employee Management</h1>

        <Message text={message} />
        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <div className="card">
          <div className="top-bar">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
            <button className="btn btn-primary" onClick={handleAddClick}>
              Add Employee
            </button>
          </div>

          <EmployeeTable
            employees={filteredEmployees}
            onEdit={handleEditClick}
            onDelete={setDeleteTarget}
          />
        </div>
      </main>

      {showForm && (
        <Modal
          title={editingEmployee ? "Edit Employee" : "Add Employee"}
          onClose={closeForm}
        >
          <EmployeeForm
            key={editingEmployee ? editingEmployee.id : "new"}
            employee={editingEmployee}
            departments={departments}
            onAddDepartment={addDepartment}
            onSave={handleSave}
            onCancel={closeForm}
          />
        </Modal>
      )}

      {deleteTarget && (
        <Modal title="Delete employee" onClose={() => setDeleteTarget(null)}>
          <h2>Delete employee?</h2>
          <p>
            {deleteTarget.name} ({deleteTarget.id}) will be removed from the list.
          </p>
          <div className="form-buttons">
            <button
              className="btn btn-secondary"
              onClick={() => setDeleteTarget(null)}
              autoFocus
            >
              Cancel
            </button>
            <button className="btn btn-danger-solid" onClick={confirmDelete}>
              Delete
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

export default App;