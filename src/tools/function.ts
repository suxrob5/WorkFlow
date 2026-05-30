import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

export const getCurrentUserData = async () => {
  const user = auth.currentUser;

  const userDoc = await getDoc(doc(db, "users", user!.uid));

  return userDoc.data();
};
