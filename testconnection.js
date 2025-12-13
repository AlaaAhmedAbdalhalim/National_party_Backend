const db = require("./config/db");

async function test() {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");
    console.log("Query Result:", rows);
  } catch (err) {
    console.log("❌ Error:", err);
  }
}

test();
