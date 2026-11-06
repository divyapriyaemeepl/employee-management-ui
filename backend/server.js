const express = require("express");
const cors = require("cors");
const employeeRoutes = require("./routes/employeeRoutes");

const app = express();
const PORT = 5000;

// middleware (order matters: these must come BEFORE the routes)
app.use(cors());          // allow React (port 5173) to call this server
app.use(express.json());  // read JSON from req.body

// health check
app.get("/", (req, res) => {
  res.send("Employee API is running");
});

// every URL starting with /api/employees goes to the router
app.use("/api/employees", employeeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});