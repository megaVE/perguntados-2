import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useFirebaseContext } from "../hooks/useFirebaseContext"
import { avatarArray } from "./avatarArray"

const MIN_ROOM_LENGTH = 4
const MAX_ROOM_LENGTH = 30

const RoomSelect = ({user}) => {
    // Checks if the user has logged in
    const navigate = useNavigate()
    // useEffect(() => {
    //     console.log("Current User: ", user)
    //     if(user === null){
    //         alert("Log in before going to the Room Hub")
    //         navigate("/")
    //     }
    // }, [])
            
    const{createRoom, getRooms} = useFirebaseContext()

    // Loads the pre-existent rooms
    const[rooms, setRooms] = useState([])

    useEffect(() => {
        const fetchRooms = async () => {
            const fetchedRooms = await getRooms()
            setRooms(fetchedRooms)
            setPasswordArray(fetchedRooms.reduce((acc) => [...acc, ""], []))
        }
        fetchRooms()
    }, [])

    const[isCreatingNewRoom, setIsCreatingNewRoom] = useState(false)
    const[roomName, setRoomName] = useState("")
    const[roomPassword, setRoomPassword] = useState("")
    const[passwordArray, setPasswordArray] = useState([])

    // Creates a new room
    const newRoom = (e) => {
        e.preventDefault()

        if(roomName.length < MIN_ROOM_LENGTH) return alert(`Room name too short! Must be at least ${MIN_ROOM_LENGTH} characters`)
        if(roomName.length > MAX_ROOM_LENGTH) return alert(`Room name too long! Must be at most ${MAX_ROOM_LENGTH} characters`)

        createRoom(roomName, user, roomPassword)
    }

    const joinRoom = (e, index) => {
        e.preventDefault()

        console.log(rooms, index)
        if(rooms[index].password.length > 0 && passwordArray[index] !== rooms[index].password) return alert("Error joining room! Incorrect password")

        alert("Joining room...")
        navigate(`/play/${rooms[index].name}`)
    }

    return(
        <div>
            <div>
                {/* Deletes user from Database */}
                <button onClick={() => {navigate('/')}}>Quit</button>
                <div style={{display: "flex"}}>
                    <img src={avatarArray[user?.avatar]} alt="avatar" style={{width: "40px", height: "40px", border: "4px solid black"}}/>
                    <p style={{marginLeft: "10px"}}>{user?.name}</p>
                </div>
                <h2>Available Rooms:</h2>
                {isCreatingNewRoom
                ? (<form onSubmit={newRoom} style={{display: "flex", backgroundColor: "#fff", padding: "10px 0"}}>
                    <div>
                        <label htmlFor="name">Room Name: </label>
                        <input type="text" name="name" id="name"
                            value={roomName}
                            onChange={(e) => {setRoomName(e.target.value)}}
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password: </label>
                        <input type="text" name="password" id="password"
                            value={roomPassword}
                            onChange={(e) => {setRoomPassword(e.target.value)}}
                        />
                    </div>
                    <input type="submit" value="Create Room"/>
                </form>)
                : (<button onClick={() => {setIsCreatingNewRoom(true)}}>Create New Room</button>)}
            </div>
            <div>
                {rooms?.map((room, index) => (
                    <React.Fragment key={index}>
                        {Object.keys(room.guest).length === 0 && <div style={{backgroundColor: "#fff"}}>
                            <h3>{room.name}{room.password.length > 0 && (<span className="lnr lnr-lock"></span>)}</h3>
                            <div style={{display: "flex", alignItems: "center"}}>
                                <p>Hosted by:</p>
                                <img src={avatarArray[room.owner.avatar]} alt={`avatar-${room.owner.name}`} style={{height: "30px", width: "30px", padding: "0 10px"}}/>
                                <p>{room.owner.name}</p>
                            </div>
                            <form onSubmit={(e) => {joinRoom(e, index)}} style={{display: "flex"}}>
                                {room.password.length > 0 && (
                                    <div>
                                        <label htmlFor="room-password">Password: </label>
                                        <input type="text" name="room-password" id="room-password"
                                            value={passwordArray[index]}
                                            onChange={(e) => {
                                                let copyPasswordArray = [...passwordArray]
                                                copyPasswordArray[index] = e.target.value
                                                setPasswordArray(copyPasswordArray)
                                            }}
                                        />
                                    </div>
                                )}
                                <input type="submit" value="Join"/>
                            </form>
                        </div>}
                    </React.Fragment>)
                )}
            </div>
        </div>
    )
}

export default RoomSelect