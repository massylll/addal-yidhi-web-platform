// Importing the MySQL module
import mysql from "mysql";

// Creating a MySQL connection
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "socialsport",
  database: "socialsport",
  port:3306
});
export default db;
