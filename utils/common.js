const jwt = require("jsonwebtoken");
const logger = require("../config/logger");
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
  logger.info(
    `AccessToken verification process started at verifyToken function\n`
  );
  try {
    logger.info(`${JSON.stringify(req.headers)}\n`);

    logger.info(`req.headers["authorization"] => ${req.headers.authorization}`);

    let token = req.headers.authorization;

    if (!token)
      return res
        .status(403)
        .json({ message: "Please provide authorization token" });

    logger.info(JSON.stringify(req.body));

    // eslint-disable-next-line prefer-destructuring
    token = token.split(" ")[1];

    logger.info(`Token is ${token}\n`);

    jwt.verify(token, process.env.JWT_SECRET_TOKEN, async (err, user) => {
      logger.info(`User ${JSON.stringify(user)}`);
      if (user) {
        logger.info("JWT Token verification success", user);
        const userRef = db.ref(`users/${user.id}`);
        userRef.on(
          "value",
          (snapshot) => {
            req.user = { id: user.id, name: snapshot.val().name };
            next();
          },
          (errorObject) => {
            logger.info("The read failed: " + errorObject.name);
            next();
          }
        );
      } else if (err.message === "jwt expired") {
        logger.info(`\n\n\nToken expired error caught -> ${err.message}\n\n\n`);

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

const transformResponse = (snap) => {
  return Object.entries(snap || {}).map((e) => {
    return { ...e[1], id: e[0] };
  });
};

module.exports = {
  generateToken,
  _200Response,
  verifyToken,
  _400Response,
  sortData,
  transformResponse
};
