
import "dotenv/config";
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_JSON
);

const firebaseApp = initializeApp({
  credential: cert(serviceAccount),
});

const auth = getAuth(firebaseApp);

export default auth;

