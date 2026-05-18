const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database for the hackathon demo
// In a real production app on Vercel, use a real DB (e.g. Vercel Postgres, MongoDB)
// because serverless functions will reset this data on cold starts.
let goals = [];

const mockUsers = [
  { id: "e1", name: "Priya Patel", role: "employee", title: "Sales Executive", initials: "PP", managerId: "m1" },
  { id: "m1", name: "Rahul Sharma", role: "manager", title: "Manager (L1)", initials: "RS" },
  { id: "a1", name: "Kiran Singh", role: "admin", title: "HR Business Partner", initials: "KS" },
];

// Root endpoint
app.get("/", (req, res) => {
  res.send("Goal Portal Backend is running!");
});

// --- USER ENDPOINTS ---
app.get("/api/users", (req, res) => {
  res.json(mockUsers);
});

// --- GOAL ENDPOINTS ---
app.get("/api/goals", (req, res) => {
  res.json(goals);
});

app.post("/api/goals", (req, res) => {
  const newGoal = { ...req.body, id: uuidv4() };
  goals.push(newGoal);
  res.status(201).json(newGoal);
});

app.put("/api/goals/:id", (req, res) => {
  const { id } = req.params;
  const index = goals.findIndex((g) => g.id === id);
  
  if (index !== -1) {
    goals[index] = { ...goals[index], ...req.body };
    res.json(goals[index]);
  } else {
    res.status(404).json({ error: "Goal not found" });
  }
});

app.delete("/api/goals/:id", (req, res) => {
  const { id } = req.params;
  goals = goals.filter((g) => g.id !== id);
  res.status(204).send();
});

// For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export the app for Vercel Serverless Functions
module.exports = app;
