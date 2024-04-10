export function formatDateToSQL(date) {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

export function getUserLoggedIn(req) {
  return JSON.parse(req.headers.userInfo);
}

export async function insertAndQuery(sql, tableName, connection) {
  const response = await connection.execute(sql);
  const sqlQuery = `select * from ${tableName} where id = '${response[0].insertId}'`;
  const data = await connection.query(sqlQuery);
  return data[0][0];
}
