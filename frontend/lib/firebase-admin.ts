import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
      : undefined;

<<<<<<< HEAD
    const isServiceAccountValid =
      serviceAccount &&
      serviceAccount.project_id &&
      serviceAccount.client_email &&
      serviceAccount.private_key;

    admin.initializeApp({
      credential: isServiceAccountValid
=======
    admin.initializeApp({
      credential: serviceAccount
>>>>>>> 941ae72
        ? admin.credential.cert(serviceAccount)
        : admin.credential.applicationDefault(),
    });
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

<<<<<<< HEAD
export const adminAuth = admin.apps.length > 0 ? admin.auth() : ({} as admin.auth.Auth);
=======
export const adminAuth = admin.auth();
>>>>>>> 941ae72
