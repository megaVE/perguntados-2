import { createContext } from "react"
import { useNavigate } from "react-router-dom"

import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore"
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

    const updateOperation = async (reference, data, id) => {
        const updateDoc = doc(db, reference, id)
        await updateDoc(updateDoc, data)
    }

    const deleteOperation = async (reference, id) => { await deleteDoc(doc(db, reference, id)) }

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

            createOperation("users", {name, avatar})
            
            alert(`Login Success with ${name}!`)
            navigate('/play')
        }catch(error){
            console.log(error)
            return alert("Login attempt error! Please try again later")
        }
    }

    const deleteUser = async (name) => {
        console.log("deleteUser: ", name)
        const users = await getUsers()
        const deletedUser = users.filter(element => element.name === name)

        if(deletedUser.lenght === 0) return

        deleteOperation("users", deletedUser.id)
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

            // createOperation("rooms", {name, owner, password, guest: {name: "", avatar: null, ready: false}, date: new Date()})
            
            alert("Room created successfully!")
            navigate(`/play/${name}`)
        }catch(error){
            console.log(error)
            return alert("Room creation attempt error! Please try again later")
        }
    }

    const deleteRoom = async (name) => {
        console.log("deleteRoom: ", name)
        const rooms = await getRooms()
        const deletedRoom = rooms.filter(element => element.name === name)

        if(users.lenght === 0) return

        deleteOperation("rooms", deletedRoom.id)
    }

    const joinRoom = async (roomName, userName, userAvatar) => {
        const rooms = await getRooms()
        const joinedRoom = rooms.filter(element => element.name === roomName)

        if(joinedRoom.lenght === 0) return alert("Error joining room! Please try again later")
        if(joinedRoom.guest.name !== "") return alert("Error joining room! The room is already full")

        const guest = {name: userName, avatar: userAvatar, ready: false}
        const updatedJoinedRoom = {...joinedRoom, guest}

        updateOperation("rooms", updatedJoinedRoom, updatedJoinedRoom.id)        
    }

    // Match
    const getMatch = async (room) => {
        try{
            const rooms = await getRooms()
            const currentRoom = rooms.filter(element => element.name === room)
            
            return (currentRoom.lenght > 0) ? currentRoom[0] : alert("Room loading error! Please try again later!")
        } catch(error){
            console.log(error)
            return alert("Room loading error! Please try again later")
        }
    }

    return(
        <FirebaseContext.Provider value={
            {createUser, getUsers, deleteUser,
            createRoom, getRooms, deleteRoom,
            joinRoom, getMatch}}>
            {children}
        </FirebaseContext.Provider>
    )
}