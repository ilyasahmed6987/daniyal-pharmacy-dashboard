import express from "express";
import path from "path";
import fs from "fs";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "pharma-secret-key-123";

app.use(cors());
app.use(express.json());

// Mock Database
const users = [
  {
    id: 1,
    email: "admin@pharma.com",
    password: bcrypt.hashSync("admin123", 10),
    name: "Super Admin",
    role: "SUPER_ADMIN",
  },
  {
    id: 2,
    email: "employee@pharma.com",
    password: bcrypt.hashSync("emp123", 10),
    name: "John Employee",
    role: "EMPLOYEE",
  },
];

let medicines = [
  { id: 1, name: "Paracetamol", category: "Analgesics", batch: "BT001", stock: 500, purchasePrice: 0.5, salePrice: 1.5, expiry: "2026-12-31", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop" },
  { id: 2, name: "Amoxicillin", category: "Antibiotics", batch: "BT002", stock: 200, purchasePrice: 2, salePrice: 5, expiry: "2025-06-30", image: "https://images.unsplash.com/photo-1550572017-ed200f545dec?w=200&h=200&fit=crop" },
  { id: 3, name: "Ibuprofen", category: "Analgesics", batch: "BT003", stock: 15, purchasePrice: 0.8, salePrice: 2.2, expiry: "2024-11-15", image: "https://images.unsplash.com/photo-1576091160550-217359f4ecf8?w=200&h=200&fit=crop" },
];

let sales = [
  { id: 1, customerName: "Walk-in Customer", totalAmount: 15.5, items: 3, date: new Date().toISOString(), status: "Completed" },
  { id: 2, customerName: "Sarah Smith", totalAmount: 42.0, items: 2, date: new Date(Date.now() - 86400000).toISOString(), status: "Completed" },
];

// Helper for JWT
const generateToken = (user: any) => {
  return jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: "1d" });
};

// --- API ROUTES ---

// Auth
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);
  if (user && bcrypt.compareSync(password, user.password)) {
    const token = generateToken(user);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// User Context (Token validation)
app.get("/api/auth/me", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = users.find(u => u.id === decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// Medicines
app.get("/api/medicines", (req, res) => {
  res.json(medicines);
});

app.post("/api/medicines", (req, res) => {
  const newMedicine = { ...req.body, id: medicines.length + 1 };
  medicines.push(newMedicine);
  res.status(201).json(newMedicine);
});

app.put("/api/medicines/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = medicines.findIndex(m => m.id === id);
  if (index !== -1) {
    medicines[index] = { ...medicines[index], ...req.body };
    res.json(medicines[index]);
  } else {
    res.status(404).json({ message: "Medicine not found" });
  }
});

app.delete("/api/medicines/:id", (req, res) => {
  const id = parseInt(req.params.id);
  medicines = medicines.filter(m => m.id !== id);
  res.status(204).send();
});

// Sales
app.get("/api/sales", (req, res) => {
  res.json(sales);
});

app.post("/api/sales", (req, res) => {
  const { customerName, items, totalAmount } = req.body;
  const newSale = {
    id: sales.length + 1,
    customerName,
    totalAmount,
    items,
    date: new Date().toISOString(),
    status: "Completed"
  };
  sales.push(newSale);
  // Update stock counts
  // (In a real app, items would be an array of medicine IDs and quantities)
  res.status(201).json(newSale);
});

// Dashboard Analytics
app.get("/api/analytics/summary", (req, res) => {
  const totalSales = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalMedicines = medicines.length;
  const lowStock = medicines.filter(m => m.stock < 20).length;
  const todayRevenue = sales
    .filter(s => new Date(s.date).toDateString() === new Date().toDateString())
    .reduce((sum, s) => sum + s.totalAmount, 0);

  res.json({
    totalSales,
    totalMedicines,
    lowStock,
    todayRevenue,
    chartData: [
      { name: 'Mon', revenue: 4000, profit: 2400 },
      { name: 'Tue', revenue: 3000, profit: 1398 },
      { name: 'Wed', revenue: 2000, profit: 9800 },
      { name: 'Thu', revenue: 2780, profit: 3908 },
      { name: 'Fri', revenue: 1890, profit: 4800 },
      { name: 'Sat', revenue: 2390, profit: 3800 },
      { name: 'Sun', revenue: 3490, profit: 4300 },
    ]
  });
});

// --- VITE MIDDLEWARE ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    app.get("*", async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith("/api")) return next();
      
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
