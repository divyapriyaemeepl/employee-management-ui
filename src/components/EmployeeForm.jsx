import { useState } from "react";

const MIN_DOB = "1920-01-01";

// today's date as YYYY-MM-DD in the user's local time
const getToday = () => {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  dob: "",
  department: "",
};

function EmployeeForm({
  employee,
  departments = [],
  onAddDepartment,
  onSave,
  onCancel,
}) {
  const [formData, setFormData] = useState(employee || emptyForm);
  const [errors, setErrors] = useState({});

  // "Add department" mini input
  const [addingDept, setAddingDept] = useState(false);
  const [newDept, setNewDept] = useState("");
  const [deptError, setDeptError] = useState("");

  const today = getToday();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const closeDeptInput = () => {
    setAddingDept(false);
    setNewDept("");
    setDeptError("");
  };

  const handleAddDepartment = () => {
    const name = newDept.trim();

    if (!name) {
      setDeptError("Enter a department name");
      return;
    }

    // if it already exists (any capitalization), just select it
    const existing = departments.find(
      (d) => d.toLowerCase() === name.toLowerCase()
    );

    if (existing) {
      setFormData({ ...formData, department: existing });
    } else {
      onAddDepartment(name);
      setFormData({ ...formData, department: name });
    }

    setErrors({ ...errors, department: "" });
    closeDeptInput();
  };

  const handleDeptKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // don't submit the whole form
      handleAddDepartment();
    } else if (e.key === "Escape") {
      e.stopPropagation(); // don't close the whole dialog
      closeDeptInput();
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    } else if (formData.dob < MIN_DOB) {
      newErrors.dob = "Date of birth cannot be before 1 January 1920";
    } else if (formData.dob > today) {
      newErrors.dob = "Date of birth cannot be in the future";
    }

    if (!formData.department) newErrors.department = "Department is required";

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onSave(formData);
    }
  };

  return (
    <form className="employee-form" onSubmit={handleSubmit} noValidate>
      <h2>{employee ? "Edit Employee" : "Add Employee"}</h2>

      <div className="field">
        <label htmlFor="name">Employee Name</label>
        <input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          autoFocus
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div className="field">
        <label htmlFor="phone">Phone Number</label>
        <input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        {errors.phone && <span className="error">{errors.phone}</span>}
      </div>

      <div className="field">
        <label htmlFor="dob">Date of Birth</label>
        <input
          id="dob"
          type="date"
          name="dob"
          min={MIN_DOB}
          max={today}
          value={formData.dob}
          onChange={handleChange}
        />
        {errors.dob && <span className="error">{errors.dob}</span>}
      </div>

      <div className="field">
        <label htmlFor="department">Department</label>
        <div className="field-row">
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
          >
            <option value="">Select department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          {!addingDept && (
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={() => setAddingDept(true)}
            >
              Add department
            </button>
          )}
        </div>

        {addingDept && (
          <div className="add-dept-box">
            <input
              type="text"
              placeholder="New department name"
              aria-label="New department name"
              value={newDept}
              onChange={(e) => {
                setNewDept(e.target.value);
                setDeptError("");
              }}
              onKeyDown={handleDeptKeyDown}
              autoFocus
            />
            {deptError && <span className="error">{deptError}</span>}
            <div className="inline-actions">
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={handleAddDepartment}
              >
                Add
              </button>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={closeDeptInput}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {errors.department && (
          <span className="error">{errors.department}</span>
        )}
      </div>

      <div className="form-buttons">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {employee ? "Update" : "Submit"}
        </button>
      </div>
    </form>
  );
}

export default EmployeeForm;