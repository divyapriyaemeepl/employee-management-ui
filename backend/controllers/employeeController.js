const fs = require("fs");
const path = require("path");

const seedPath = path.join(__dirname, "..", "data", "employees.json");

// on Vercel only /tmp can be written to
const filePath = process.env.VERCEL ? "/tmp/employees.json" : seedPath;

const readEmployees = () => {
  if (!fs.existsSync(filePath)) {
    fs.copyFileSync(seedPath, filePath);
  }
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
};

// convert array -> text, save to the file
const writeEmployees = (employees) => {
  fs.writeFileSync(filePath, JSON.stringify(employees, null, 2));
};

// creates EMP004, EMP005, ...
const generateId = (employees) => {
  const maxNumber = employees.reduce(
    (max, emp) => Math.max(max, parseInt(emp.id.replace("EMP", ""))),
    0
  );
  return "EMP" + String(maxNumber + 1).padStart(3, "0");
};

// ---------- controllers ----------

// GET /api/employees
const getEmployees = (req, res) => {
  try {
    const employees = readEmployees();
    res.status(200).json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to read employees" });
  }
};

// POST /api/employees
const addEmployee = (req, res) => {
  try {
    const employees = readEmployees();

    // id comes last so the client can never overwrite it
    const newEmployee = { ...req.body, id: generateId(employees) };

    employees.push(newEmployee);
    writeEmployees(employees);

    res.status(201).json(newEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add employee" });
  }
};

// PUT /api/employees/:id
const updateEmployee = (req, res) => {
  try {
    const { id } = req.params;
    const employees = readEmployees();

    const index = employees.findIndex((emp) => emp.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // keep old data, apply new changes, never change the id
    const updatedEmployee = { ...employees[index], ...req.body, id };
    employees[index] = updatedEmployee;
    writeEmployees(employees);

    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update employee" });
  }
};

// DELETE /api/employees/:id
const deleteEmployee = (req, res) => {
  try {
    const { id } = req.params;
    const employees = readEmployees();

    const exists = employees.some((emp) => emp.id === id);

    if (!exists) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const remaining = employees.filter((emp) => emp.id !== id);
    writeEmployees(remaining);

    res.status(200).json({ message: "Employee deleted successfully", id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete employee" });
  }
};

module.exports = {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
};