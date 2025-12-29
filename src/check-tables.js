require("dotenv").config();
const pool = require("./db");

async function checkTables() {
  try {
    console.log("Đang kết nối database...");
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log("\n=== Các bảng trong database ===");
    if (result.rows.length === 0) {
      console.log("Không tìm thấy bảng nào!");
    } else {
      result.rows.forEach((row, index) => {
        console.log(`${index + 1}. ${row.table_name}`);
      });
    }
    
    // Check if store/stores table exists
    const tableNames = result.rows.map(r => r.table_name.toLowerCase());
    if (tableNames.includes('store')) {
      console.log("\n✓ Tìm thấy bảng 'store'");
    } else if (tableNames.includes('stores')) {
      console.log("\n✓ Tìm thấy bảng 'stores' (số nhiều)");
      console.log("→ Cần thêm DB_TABLE_NAME=stores vào file .env");
    } else {
      console.log("\n⚠ Không tìm thấy bảng 'store' hoặc 'stores'");
      console.log("→ Vui lòng kiểm tra lại tên bảng và thêm DB_TABLE_NAME=<tên_bảng> vào file .env");
    }
    
    process.exit(0);
  } catch (err) {
    console.error("Lỗi:", err.message);
    process.exit(1);
  }
}

checkTables();

