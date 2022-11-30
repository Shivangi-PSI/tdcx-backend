const admin = require("firebase-admin");
var serviceAccount = require("../config/admin");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL,
  authDomain: process.env.AUTH_DOMAIN,
});

var db=admin.database();

module.exports =db ;