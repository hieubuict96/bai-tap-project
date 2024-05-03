export function formatDateToSQL(date) {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

export function getUserLoggedIn(req) {
  return JSON.parse(req.headers.userInfo);
}

export function getIdLoggedIn(req) {
  return JSON.parse(req.headers.userInfo).id;
}

export async function insertAndQuery(sql, tableName, connection) {
  const response = await connection.execute(sql);
  const sqlQuery = `select * from ${tableName} where id = '${response[0].insertId}'`;
  const data = await connection.query(sqlQuery);
  return data[0][0];
}

export function getNotificationContent(notificationType, vars) {
  let content = '';
  if (notificationType == 0) {
    content = `${vars[0]} đã bình luận về bài viết của bạn.`;
  }

  return content;
}

export function getResponseSocket(type, data) {
  return {
    type,
    data
  };
}

export function getKeywordLike(keyword) {
  return !(keyword && keyword.trim()) ? ' is null or 1 = 1' : ` like '%${keyword.trim().replace(/\\/g, '\\\\').replace(/_/g, '\\_').replace(/%/g, '\\%').replace(/'/g, '\\\'')}%'`;
}

export async function insertAndGetId(sql, connection) {
  const query = await connection.execute(sql);
  return query[0].insertId;
}
