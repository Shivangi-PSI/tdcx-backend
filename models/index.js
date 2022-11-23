const admin = require("firebase-admin");
var serviceAccount = require("../admin");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL,
  authDomain: process.env.AUTH_DOMAIN,
});

var db=admin.database();

module.exports =db ;

// var firebase = require("firebase");
// var firebaseConfig = {
//   apiKey: process.env.API_KEY,
//   authDomain: process.env.AUTH_DOMAIN,
//   databaseURL: process.env.DATABASE_URL,
//   projectId: process.env.PROJECT_ID,
//   storageBucket: process.env.STORAGE_BUCKET,
//   messagingSenderId: process.env.MESSAGING_SENDER_ID,
//   appId: process.env.APP_ID,
// };

// console.log('fffffffffffffff',firebaseConfig)

// firebase.initializeApp(firebaseConfig);
// var db = firebase.database();
// module.exports = db;