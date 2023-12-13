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
        const changedDoc = doc(db, reference, id)
        await updateDoc(changedDoc, data)
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

    const getUserByName = async (name) => {
        try{
            const users = await getUsers()
            const filteredUsers = users.filter(element => element.name === name)

            return (filteredUsers.length > 0) ? filteredUsers[0] : undefined
        }catch(error){
            console.log(error)
            return null
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
        const deletedUser = await getUserByName(name)

        if(!deletedUser) return

        await deleteOperation("users", deletedUser.id)
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

    const getRoomByName = async (name) => {
        try{
            const rooms = await getRooms()
            const filteredRooms = rooms.filter(element => element.name === name)

            return (filteredRooms.length > 0) ? filteredRooms[0] : undefined
        }catch(error){
            console.log(error)
            return null
        }
    }
    
    const createRoom = async (name, owner, password) => {
        console.log("createRoom: ", name, owner, password)
        try{
            const existentRooms = await getRooms()
            const existentNames = existentRooms.reduce((acc, room) => [...acc, room.name], [])
            if(existentNames.includes(name)) return alert("Room creation attempt error! Room name already taken")

            createOperation("rooms", {name, owner: {...owner, ready: false}, password, guest: {name: "", avatar: null, ready: false}, date: new Date()})
            
            alert("Room created successfully!")
            navigate(`/play/${name}`)
        }catch(error){
            console.log(error)
            return alert("Room creation attempt error! Please try again later")
        }
    }

    const deleteRoom = async (name) => {
        console.log("deleteRoom: ", name)
        const deletedRoom = await getRoomByName(name)

        if(!deletedRoom) return
        
        await deleteOperation("rooms", deletedRoom.id)
    }

    // Match
    const joinGuest = async (name, user) => {
        try{
            const roomJoined = await getRoomByName(name)
    
            if(!roomJoined) return alert("Error joining room! Please try again later")
            if(roomJoined.guest.name !== "") return alert("Error joining room! The room is already full")
    
            const guest = {name: user.name, avatar: user.avatar, ready: false}
            const updatedRoom = {...roomJoined, guest}
    
            await updateOperation("rooms", updatedRoom, updatedRoom.id)
            navigate(`/play/${name}`)
        }catch(error){
            console.log(error)
        }
    }

    const leaveGuest = async (name) => {
        try{
            const roomLeft = await getRoomByName(name)

            if(!roomLeft) return

            const guest = {name: "", avatar: null, ready: false}
            const updatedRoom = {...roomLeft, guest}

            await updateOperation("rooms", updatedRoom, updatedRoom.id)
            navigate('/play')
        }catch(error){
            console.log(error)
        }
    }

    const readyHost = async (name, isReady) => {
        try{
            const room = await getRoomByName(name)
            
            const updatedHost = {...room.owner, ready: !isReady}
            const updatedRoom = {...room, owner: updatedHost}

            await updateOperation("rooms", updatedRoom, updatedRoom.id)
        }catch(error){
            console.log(error)
        }
    }

    const readyGuest = async (name, isReady) => {
        try{
            const room = await getRoomByName(name)

            const updatedGuest = {...room.guest, ready: !isReady}
            const updatedRoom = {...room, guest: updatedGuest}

            await updateOperation("rooms", updatedRoom, updatedRoom.id)
        }catch(error){
            console.log(error)
        }
    }

    // Random
    const checkUser = (user) => {
        console.log("Current User: ", user)
        
        if(user) return
        
        alert("Log in before going to the Room Hub")
        navigate("/")
    }
    return(
        <FirebaseContext.Provider value={{
            checkUser,
            createUser, getUsers, deleteUser,
            createRoom, getRooms, deleteRoom, getRoomByName,
            joinGuest, leaveGuest,
            readyHost, readyGuest
        }}>
            {children}
        </FirebaseContext.Provider>
    )
}