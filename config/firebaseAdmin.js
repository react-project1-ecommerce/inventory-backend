import admin from "firebase-admin";

//Reads the firebase service-account JSON from Render environment variable and then initializes firebase Admin

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_JSON
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
