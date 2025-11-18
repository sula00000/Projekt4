// server.js

// 1) Load miljøvariabler allerøverst
require("dotenv").config({ path: __dirname + "/.env" });
console.log("Admin password is:", process.env.ADMIN_PASSWORD);

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const app = express();

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// ── Admin-login endpoint ──────────────────────────────────────────────────────
app.post("/api/login", (req, res) => {
  const { password } = req.body;
  console.log("Received login attempt, pw=", password);
  if (password === process.env.ADMIN_PASSWORD) {
    return res.json({ success: true });
  } else {
    return res.status(401).json({
      success: false,
      message: "Forkert adgangskode. Prøv igen.",
    });
  }
});

// ── MongoDB-forbindelse ─────────────────────────────────────────────────────────
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/vending",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

// ── Log-model: én dokument gemmer hele produktlisten ───────────────────────────
const logSchema = new mongoose.Schema({
  products: [
    {
      prodName: { type: String, required: true }, // "1", "2", …
      prodAmount: { type: Number, required: true }, // antal på lager
    },
  ],
  timestamp: { type: Date, default: Date.now },
});
const Log = mongoose.model("Log", logSchema);

// ── Swagger setup ───────────────────────────────────────────────────────────────
const swaggerDefinition = {
  openapi: "3.0.0",
  info: { title: "Vending Machine Dashboard API", version: "1.0.0" },
};
const swaggerOptions = {
  swaggerDefinition,
  apis: ["./server.js"], // dokumentér med JSDoc-kommentarer her
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── RESTful API endpoints ──────────────────────────────────────────────────────

/**
 * @swagger
 * /api/logs:
 *   get:
 *     summary: Hent alle log-dokumenter
 *     responses:
 *       200:
 *         description: "Liste over log-dokumenter"
 */
app.get("/api/logs", async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: 1 }).lean();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/logs:
 *   post:
 *     summary: Upload en hel produkt-snapshot-log
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - products
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - prodName
 *                     - prodAmount
 *                   properties:
 *                     prodName:
 *                       type: string
 *                     prodAmount:
 *                       type: number
 *     responses:
 *       201:
 *         description: "Log-ops toringeret"
 */
app.post("/api/logs", async (req, res) => {
  try {
    const entry = new Log({
      products: req.body.products,
      // timestamp sættes automatisk
    });
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/logs/latest:
 *   get:
 *     summary: Hent den seneste produkt-snapshot
 *     responses:
 *       200:
 *         description: "Seneste log-dokument"
 */
app.get("/api/logs/latest", async (req, res) => {
  try {
    const latest = await Log.findOne().sort({ timestamp: -1 }).lean();
    if (!latest) {
      return res.status(404).json({ message: "Ingen logs fundet." });
    }
    res.json(latest);
  } catch (err) {
    console.error("Fejl ved hentning af nyeste log:", err);
    res.status(500).json({ error: "Serverfejl." });
  }
});

/**
 * @swagger
 * /api/stock:
 *   get:
 *     summary: Hent aktuel lagerstatus ud fra seneste log
 *     responses:
 *       200:
 *         description: "Objekt med { prodName: prodAmount, … }"
 */
app.get("/api/stock", async (req, res) => {
  try {
    // Hent seneste snapshot‐log
    const latest = await Log.findOne().sort({ timestamp: -1 }).lean();

    // Default‐struktur med alle felter
    const stock = { snickers: 0, maoam: 0, coming_soon: 0 };

    if (latest && Array.isArray(latest.products)) {
      // Her mappes prodName ("1","2","3") til de korrekte feltnavne
      const map = {
        1: "snickers",
        2: "maoam",
        3: "coming_soon",
      };

      latest.products.forEach(({ prodName, prodAmount }) => {
        const key = map[prodName];
        if (key) {
          stock[key] = prodAmount;
        }
      });
    }

    // Returnér { snickers: X, maoam: Y, coming_soon: Z }
    res.json(stock);
  } catch (err) {
    console.error("Fejl ved hentning af stock-data:", err);
    res.status(500).json({ error: "Kunne ikke hente lagerdata" });
  }
});

// ── Serve static frontend ──────────────────────────────────────────────────────
app.use(express.static("public"));

// ── Start server ───────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server kører på port ${PORT}`));
