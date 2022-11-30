const db = require("../models");
var crypto = require("crypto");
const { generateToken } = require("../utils/common");
const utilities = require("../utils/common");
const { CURRENT_USER, INCORRECT_LOGIN, NO_USER, SUCCESS_LOGIN } = require("../utils/constant");

const getUser = async (req, res) => {
  if (!req.user) {
    return utilities._400Response(res, { error: NO_USER });
  }
  db.ref(`users/${req.user.id}`).once("value", (snapshot) => {
    if (snapshot.val()) {
      return utilities._200Response(res, {
        user: { name: snapshot.val().name },
        msg: CURRENT_USER,
      });
    }
  });
};

const loginUser = async (req, res) => {
  const { name, password } = req.body;
  const ref = db.ref("users");
  ref
    .orderByChild("name")
    .equalTo(name)
    .on("value", async (snapshot) => {
      if (!snapshot.val()) {
        return utilities._400Response(res, {
          error: INCORRECT_LOGIN,
        });
      }
      const [userKey, user] = Object.entries(snapshot.val())[0];
      if (
        user.password ===
        crypto.createHash("md5").update(password).digest("hex")
      ) {
        const token = await generateToken({ id: userKey });
        return utilities._200Response(res, {
          user: { name: user.name, token },
          msg: SUCCESS_LOGIN,
        });
      } else {
        return utilities._400Response(res, {
          error: INCORRECT_LOGIN,
        });
      }
    });
};

module.exports = { loginUser, getUser };
