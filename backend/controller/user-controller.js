import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import connect from "../db.js";
import { signToken } from "../common/user.js";
import { JWT_SECRET } from "../../env.js";

const connection = await connect();

export async function signup(req, res) {
  const { phone, password, email, fullName } = req.body;
  const data = await exeSQL(
    `select phone, email from users where phone = '${phone}' or email = '${email}'`
  );

  if (data[0].length > 0) {
    let phoneExists = false;
    let emailExists = false;
    data[0].forEach((data) => {
      if (data.phone == phone) {
        phoneExists = true;
      }

      if (data.email == email) {
        emailExists = true;
      }
    });

    const response = {};
    response.codePhone = phoneExists && 'phoneExists';
    response.codeEmail = emailExists && 'emailExists';
    return res.status(400).json(response);
  } else {
    const hashPassword = bcryptjs.hashSync(password, 10);
    await exeSQL(
      `insert into users values (null, '${phone}', '${hashPassword}', '${email}', '${req.file.filename}', '${fullName}', default)`
    );
    const data = await exeSQL(
      `select * from users where phone = '${phone}'`
    );

    const token = signToken(phone);
    return res.status(200).json({
      user: {
        id: data[0][0].id,
        phone: data[0][0].phone,
        email: data[0][0].email,
        fullName: data[0][0].full_name,
        imgUrl: data[0][0].img_url,
      },
      token,
    });
  }
}

export async function update(req, res) {
  const { id, email, fullName } = req.body;
  const data = await exeSQL(
    `select count(*) count from users where id = '${id}' or email = '${email}'`
  );

  if (data[0][0].count > 1) {
    return res.status(400).json({
      codeEmail: 'emailExists'
    });
  }

  let sql = `update users set email = '${email}', full_name = '${fullName}'`;
  if (req.file) {
    sql += `, img_url = '${req.file.filename}'`;
  }

  sql += ` where id = '${id}'`;
  await exeSQL(sql);

  const dataRes = await exeSQL(
    `select id, phone, email, img_url imgUrl, full_name fullName from users where id = '${id}'`
  );

  return res.status(200).json({
    user: dataRes[0][0]
  });
}

export async function signin(req, res) {
  const { phone, password } = req.body;
  const data = await exeSQL(`select * from users where phone = '${phone}'`);
  if (
    data[0].length === 0 ||
    !bcryptjs.compareSync(password, data[0][0].password)
  ) {
    return res.status(400).json({ code: "signinFail" });
  }

  const token = signToken(phone);

  return res.status(200).json({
    user: {
      id: data[0][0].id,
      phone: data[0][0].phone,
      email: data[0][0].email,
      fullName: data[0][0].full_name,
      imgUrl: data[0][0].img_url,
    },
    token,
  });
}

export async function getData(req, res) {
  if (!req.headers.authorization) {
    return res.status(400).json({ code: "verifyFail" });
  }

  const accessToken = req.headers.authorization.split(" ")[1];

  try {
    const phone = jwt.verify(accessToken, JWT_SECRET).username;
    const data = await exeSQL(
      `select * from users where phone = '${phone}'`
    );
    if (data[0].length === 0) {
      return res.status(400).json({ code: "verifyFail" });
    }

    return res.status(200).json({
      user: {
        id: data[0][0].id,
        phone: data[0][0].phone,
        email: data[0][0].email,
        fullName: data[0][0].full_name,
        imgUrl: data[0][0].img_url,
      },
    });
  } catch (error) {
    return res.status(400).json({ code: "verifyFail" });
  }
}

async function exeSQL(sql) {
  return await connection.execute(sql);
}
