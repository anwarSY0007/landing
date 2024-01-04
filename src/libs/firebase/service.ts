import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import app from "./init";
import bcrypt from 'bcrypt';

const firestore = getFirestore(app);

export async function retriveData(collectionName: string) {
  const snapshot = await getDocs(collection(firestore, collectionName));
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return data;
}

export async function retriveDataByID(colletionName: string, id: string) {
  const snapshot = await getDoc(doc(firestore, colletionName, id));
  const data = snapshot.data();
  return data;
}
export async function signUp(
  userData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    username: string;
    role?: string;
    avatar?: string;
    password: string;
  },
  callback: Function
) {
  const q = query(
    collection(firestore, "users"),
    where("email", "==", userData.email)
  );
  const querySnapshot = await getDocs(q);
  const result = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  if (result.length > 0) {
    callback(false);
  } else {
    if (!userData.role) {
      userData.role = "member";
    } // set default role
    userData.password = await bcrypt.hash(userData.password, 10); // hash password

    await addDoc(collection(firestore, "users"), userData)
      .then(() => {
        callback(true);
      })
      .catch((error) => {
        console.log(error);
        callback(false);
      });
  }
}
