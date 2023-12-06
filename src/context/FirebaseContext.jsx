import { createContext } from "react"
import { useNavigate } from "react-router-dom"

import { collection, addDoc, getDocs, deleteDoc } from "firebase/firestore"
import { db } from "../firebase/firebase-config"

export const FirebaseContext = createContext()

export const FirebaseContextProvider = ({children}) => {    
    const navigate = useNavigate()
    
    // CRUD Operations
    const createOperation = async (reference, object) => { await addDoc(collection(db, reference), object) }

    const readOperation = async (reference) => {
        const data = await getDocs(collection(db, reference))
        const refinedData = data.docs.map(doc => ({...doc.data(), id: doc.id}))
        
        console.log("Fetched Data: ", refinedData)
        return refinedData
    }

    const deleteOperation = async (reference, property, id) => {
        const table = readOperation(reference)
        
        const deletedElement = table.filter(element => element[property] === id)
        
        const data = doc(db, reference, deletedElement)

        await deleteDoc(data)
    }

    // Users Table
    const getUsers = async () => {
        try{
            return readOperation("users")
        }catch(error){
            console.log(error)
            return alert("Error! Try again later")
        }
    }

    const createUser = async (name, avatar) => {
        console.log("createUser: ", name, avatar)
        try{
            const existentUsers = await getUsers()
            const existentNames = existentUsers.reduce((acc, user) => [...acc, user.name], [])
            if(existentNames.includes(name)) return alert("Login attempt error! Username already taken")

            // createOperation("users", {name, avatar})
            
            alert(`Login Success with ${name}!`)
            navigate('/play')
        }catch(error){
            console.log(error)
            return alert("Login attempt error! Please try again later")
        }
    }

    const deleteUser = async (name) => {
        console.log("deleteUser: ", name)
    }

    // Rooms Table
    const getRooms = async () => {
        try{
            return readOperation("rooms")
        } catch(error){
            console.log(error)
            return alert("Error loading the existent rooms! Try again later")
        }        
    }
    
    const createRoom = async (name, owner, password) => {
        console.log("createRoom: ", name, owner, password)
        try{
            const existentRooms = await getRooms()
            const existentNames = existentRooms.reduce((acc, room) => [...acc, room.name], [])
            if(existentNames.includes(name)) return alert("Room creation attempt error! Room name already taken")

            // createOperation("rooms", {name, owner, password, guest: {}, date: new Date()})
            
            alert("Room created successfully!")
            navigate(`/play/${name}`)
        }catch(error){
            console.log(error)
            return alert("Room creation attempt error! Please try again later")
        }
    }

    const deleteRoom = async (name) => {
    
    }

    // Match
    const getMatch = async (room) => {
        try{
            const rooms = await getRooms()
            const currentRoom = rooms.filter(element => element.name === room)
    
            return currentRoom[0]
        } catch(error){
            console.log(error)
            return alert("Room loading error! Please try again later")
        }
    }

    return(
        <FirebaseContext.Provider value={{createUser, getUsers, createRoom, getRooms, getMatch}}>
            {children}
        </FirebaseContext.Provider>
    )
}