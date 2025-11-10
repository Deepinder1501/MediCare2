import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",      
  password: "Deep@15012005",    
  database: "medicine_db"
});

db.connect((err) => {
  if (err) {
    console.error(" MySQL connection failed: ", err);
  } else {
    console.log(" MySQL connected successfully");
  }
});

export default db;


