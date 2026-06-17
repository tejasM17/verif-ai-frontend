import { signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { auth } from "../firebase";

const provider = new GithubAuthProvider();

export async function signInWithGithub() {
  const result = await signInWithPopup(auth, provider);
  const idToken = await result.user.getIdToken();
  return {
    idToken,
    email: result.user.email,
    displayName: result.user.displayName,
    photoURL: result.user.photoURL,
    uid: result.user.uid,
  };
}
