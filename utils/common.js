const jwt = require("jsonwebtoken");
const db = require("../models");

const generateToken = (key) => {
  return new Promise((resolve, reject) => {
    try {
      const token = jwt.sign(key, process.env.JWT_SECRET_TOKEN, {
        expiresIn: "1d",
      });

      resolve(token);
    } catch (e) {
      reject(e);
    }
  });
};

const verifyToken = async (req, res, next) => {
  console.log(
    `AccessToken verification process started at verifyToken function\n`
  );
  try {
    console.log(`${JSON.stringify(req.headers)}\n`);

    console.log(`req.headers["authorization"] => ${req.headers.authorization}`);

    let token = req.headers.authorization;

    if (!token)
      return res
        .status(403)
        .json({ message: "Please provide authorization token" });

    console.log(JSON.stringify(req.body));

    // eslint-disable-next-line prefer-destructuring
    token = token.split(" ")[1];

    console.log(`Token is ${token}\n`);

    jwt.verify(token, process.env.JWT_SECRET_TOKEN, async (err, user) => {
      console.log(`User ${JSON.stringify(user)}`);
      if (user) {
        console.log("JWT Token verification success", user);
        const userRef = db.ref(`users/${user.id}`);
				userRef.on('value', (snapshot) => {
					console.log('sssssssssssss', snapshot.val());
					req.user = {id: user.id, name: snapshot.val().name};
					next();
				}, (errorObject) => {
					console.log('The read failed: ' + errorObject.name);
					next();
				}); 
      } else if (err.message === "jwt expired") {
        console.log(`\n\n\nToken expired error caught -> ${err.message}\n\n\n`);

        return res.status(403).json({
          success: false,
          message: "Access token expired",
        });
      } else {
        console.log(err);
        return res.status(403).json({ err, message: "user not authenticated" });
      }
    });
  } catch (e) {
    console.log("Error caught: ", e);
  }
};

const _200Response = (res, data) => {
  res.status(200).json(data);
};

const _400Response = (res, data) => {
  res.status(400).send(data);
};

const sortData = (data, field) => {
  return data.sort((a, b) => a[field] - b[field]);
};

module.exports = {
  generateToken,
  _200Response,
  verifyToken,
  _400Response,
  sortData,
};
