const db = require("../models");
var crypto = require("crypto");
const { generateToken } = require("../utils/common");
const utilities = require("../utils/common");

const getUser = async (req, res) => {
  if (!req.user) {
    return utilities._400Response(res, { error: "No user exit" });
  }
  db.ref(`users/${req.user.id}`).once("value", (snapshot) => {
    if (snapshot.val()) {
      console.log(snapshot.val());
      return utilities._200Response(res, {
        user: { name: snapshot.val().name },
        msg: "Current user",
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
      console.log(snapshot.val());
      if (!snapshot.val()) {
        return utilities._400Response(res, {
          error: "Incorrect name or password",
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
          msg: "Current user",
        });
      } else {
        return utilities._400Response(res, {
          error: "Incorrect name or password",
        });
      }
    });
};

module.exports = { loginUser, getUser };
