const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

let firebaseApp;

function initFirebaseAdmin() {
  if (firebaseApp) {
    return firebaseApp;
  }

  const jsonEnv = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const pathEnv = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  if (jsonEnv) {
    const serviceAccount = JSON.parse(jsonEnv);
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    return firebaseApp;
  }

  if (pathEnv) {
    const resolvedPath = path.isAbsolute(pathEnv)
      ? pathEnv
      : path.join(process.cwd(), pathEnv);
    const raw = fs.readFileSync(resolvedPath, 'utf-8');
    const serviceAccount = JSON.parse(raw);
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    return firebaseApp;
  }

  firebaseApp = admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
  return firebaseApp;
}

module.exports = { admin, initFirebaseAdmin };
