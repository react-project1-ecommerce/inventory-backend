import admin from "firebase-admin";  

import serviceAccount from "./fbServiceAccountKey.json" with { type: "json" }; 

admin.initializeApp({
  credential: admin.cert(serviceAccount)
});

export default admin;
