import { useContext } from "react";
import { FirebaseContext } from "../context/FirebaseContext";

export const useFirebaseContext = () => {
    const context = useContext(FirebaseContext)
    if(!context) console.log("FirebaseContext not found!")

    return context
}