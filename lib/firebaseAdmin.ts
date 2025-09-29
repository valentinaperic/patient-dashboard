import admin from "firebase-admin";
import type { ServiceAccount } from "firebase-admin";

function getServiceAccount(): ServiceAccount {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_BASE64 env var");
  }
  return JSON.parse(
    Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, "base64").toString("utf8")
  ) as ServiceAccount;
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(getServiceAccount()),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

export const db = admin.firestore();

