import { useState } from "react";
import SearchBar from "./components/SearchBar";
import EmployeeTable from "./components/EmployeeTable";
import EmployeeForm from "./components/EmployeeForm";
import Message from "./components/Message";
import Modal from "./components/Modal";
import "./App.css";

const initialEmployees = [
  { id: "EMP001", name: "Rahul", email: "rahul@gmail.com", department: "IT", phone: "9876543210", dob: "1995-05-10" },
  { id: "EMP002", name: "Priya", email: "priya@gmail.com", department: "HR", phone: "9876543211", dob: "1996-08-15" },
  { id: "EMP003", name: "Amit", email: "amit@gmail.com", department: "Finance", phone: "9876543212", dob: "1993-12-01" },
];

function App() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [departments, setDepartments] = useState(["IT", "HR", "Finance"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [message, setMessage] = useState("");

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  const generateId = () => {
    const maxNumber = employees.reduce(
      (max, emp) => Math.max(max, parseInt(emp.id.replace("EMP", ""))),
      0
    );
    return "EMP" + String(maxNumber + 1).padStart(3, "0");
  };

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

  const handleSave = (data) => {
    if (editingEmployee) {
      setEmployees(
        employees.map((emp) =>
          emp.id === editingEmployee.id ? { ...emp, ...data } : emp
        )
      );
      showMessage("Employee updated successfully!");
    } else {
      setEmployees([...employees, { id: generateId(), ...data }]);
      showMessage("Employee added successfully!");
    }
    closeForm();
  };

  const confirmDelete = () => {
    setEmployees(employees.filter((emp) => emp.id !== deleteTarget.id));
    setDeleteTarget(null);
    showMessage("Employee deleted successfully!");
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