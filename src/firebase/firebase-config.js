import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDV9Tq5XvFgGybmrtckgTqXp-HmtsR9sF8",
  authDomain: "perguntados-2.firebaseapp.com",
  projectId: "perguntados-2",
  storageBucket: "perguntados-2.appspot.com",
  messagingSenderId: "1038514344731",
  appId: "1:1038514344731:web:cca0c64f5b203f4013b9be"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);