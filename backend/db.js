import { createConnection as _createConnection } from "mysql2/promise";
import { DB_HOST, DATABASE_NAME, DB_USER, DB_PWD } from '../env.js'

async function createConnection() {
  const connection = await _createConnection({
    host: DB_HOST,
    database: DATABASE_NAME,
    user: DB_USER,
    password: DB_PWD,
  });

  return connection;
}

export default createConnection;
