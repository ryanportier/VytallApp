import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { auth } from "./client";

const googleProvider = new GoogleAuthProvider();

export async function signUp(email: string, password: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function signIn(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function signInWithGoogle() {
  // Use popup on localhost, redirect on production (more reliable)
  const isLocal = window.location.hostname === "localhost";
  if (isLocal) {
    const cred = await signInWithPopup(auth, googleProvider);
    return { user: cred.user, isNew: cred.user.metadata.creationTime === cred.user.metadata.lastSignInTime };
  } else {
    await signInWithRedirect(auth, googleProvider);
    // Will redirect — result handled in getGoogleRedirectResult
    return null;
  }
}

export async function getGoogleRedirectResult() {
  const result = await getRedirectResult(auth);
  if (!result) return null;
  return {
    user: result.user,
    isNew: result.user.metadata.creationTime === result.user.metadata.lastSignInTime,
  };
}

export async function logOut() {
  await signOut(auth);
}

export function onAuthChange(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, cb);
}

export { auth };
