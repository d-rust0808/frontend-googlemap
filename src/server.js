require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

// Session configuration
app.use(
  session({
    secret:
      process.env.SESSION_SECRET || "your-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to false for HTTP, true for HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: "lax",
    },
  })
);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Authentication credentials
const AUTH_USERNAME = "cdudu.com";
const AUTH_PASSWORD = "cdudu.com@882002";

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.session && req.session.authenticated) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
};

// Health check (no auth required)
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Auth routes (no auth required)
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  if (username === AUTH_USERNAME && password === AUTH_PASSWORD) {
    req.session.authenticated = true;
    req.session.username = username;
    console.log("Login successful for:", username);
    console.log("Session ID:", req.sessionID);
    res.json({ success: true, message: "Login successful" });
  } else {
    res.status(401).json({ error: "Invalid username or password" });
  }
});

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to logout" });
    }
    res.json({ success: true, message: "Logout successful" });
  });
});

app.get("/api/auth/check", (req, res) => {
  console.log("Auth check - Session ID:", req.sessionID);
  console.log("Auth check - Authenticated:", req.session?.authenticated);
  if (req.session && req.session.authenticated) {
    res.json({ authenticated: true, username: req.session.username });
  } else {
    res.json({ authenticated: false });
  }
});

// Serve static frontend (Bootstrap UI) from /public
// Must be after auth routes but before protected routes
app.use(express.static(path.join(__dirname, "..", "public")));

// Redirect root to login if not authenticated
app.get("/", (req, res) => {
  if (req.session && req.session.authenticated) {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
  } else {
    res.redirect("/login.html");
  }
});

// Debug: List all tables in database
app.get("/debug/tables", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    res.json({ tables: result.rows.map((r) => r.table_name) });
  } catch (err) {
    console.error("Error listing tables:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /stores?name=&phone=&search_keyword=&page=&limit=
app.get("/stores", requireAuth, async (req, res) => {
  const {
    name,
    phone,
    search_keyword: searchKeyword,
    page = 1,
    limit = 10,
  } = req.query;

  const conditions = [];
  const values = [];

  if (name) {
    values.push(`%${name}%`);
    conditions.push(`name ILIKE $${values.length}`);
  }

  if (phone) {
    values.push(`%${phone}%`);
    conditions.push(`phone ILIKE $${values.length}`);
  }

  if (searchKeyword) {
    values.push(`%${searchKeyword}%`);
    const idx = values.length;
    // search over name + phone (mở rộng thêm cột khác nếu cần)
    conditions.push(`(name ILIKE $${idx} OR phone ILIKE $${idx})`);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  // Pagination
  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.max(parseInt(limit, 10) || 10, 1);
  const offset = (pageNum - 1) * limitNum;

  // Get table name from env or default to 'store'
  const tableName = process.env.DB_TABLE_NAME || "store";

  // Count total
  const countQuery = `SELECT COUNT(*)::int AS total FROM ${tableName} ${whereClause}`;

  // Data query
  const limitIdx = values.length + 1;
  const offsetIdx = values.length + 2;
  const dataQuery = `
    SELECT id, name, phone
    FROM ${tableName}
    ${whereClause}
    ORDER BY name ASC
    LIMIT $${limitIdx}
    OFFSET $${offsetIdx}
  `;

  try {
    const countResult = await pool.query(countQuery, values);
    const total = countResult.rows[0]?.total || 0;

    const dataValues = [...values, limitNum, offset];
    const dataResult = await pool.query(dataQuery, dataValues);

    res.json({
      data: dataResult.rows,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    });
  } catch (err) {
    console.error("Error querying stores:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /stores/:id
app.delete("/stores/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const tableName = process.env.DB_TABLE_NAME || "store";

  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  try {
    const result = await pool.query(
      `DELETE FROM ${tableName} WHERE id = $1 RETURNING id, name, phone`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Store not found" });
    }

    res.json({
      success: true,
      message: "Store deleted successfully",
      deleted: result.rows[0],
    });
  } catch (err) {
    console.error("Error deleting store:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
