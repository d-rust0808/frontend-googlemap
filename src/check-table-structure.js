require("dotenv").config();
const pool = require("./db");

async function checkTableStructure() {
  try {
    const tableName = process.env.DB_TABLE_NAME || "stores";
    console.log(`Đang kiểm tra cấu trúc bảng '${tableName}'...\n`);

    const result = await pool.query(
      `
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' 
        AND table_name = $1
      ORDER BY ordinal_position
    `,
      [tableName]
    );

    console.log("=== Cấu trúc bảng ===");
    result.rows.forEach((row) => {
      console.log(
        `- ${row.column_name} (${row.data_type}) ${
          row.is_nullable === "NO" ? "NOT NULL" : ""
        }`
      );
    });

    // Check for primary key
    const pkResult = await pool.query(
      `
      SELECT a.attname
      FROM pg_index i
      JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
      WHERE i.indrelid = $1::regclass
        AND i.indisprimary
    `,
      [`public.${tableName}`]
    );

    if (pkResult.rows.length > 0) {
      console.log(
        `\n✓ Primary key: ${pkResult.rows.map((r) => r.attname).join(", ")}`
      );
    } else {
      console.log("\n⚠ Không tìm thấy primary key");
    }

    process.exit(0);
  } catch (err) {
    console.error("Lỗi:", err.message);
    process.exit(1);
  }
}

checkTableStructure();
