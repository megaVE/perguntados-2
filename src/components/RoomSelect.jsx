import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useFirebaseContext } from "../hooks/useFirebaseContext"
import { avatarArray } from "./avatarArray"
import styles from "./RoomSelect.module.css"

const MIN_ROOM_LENGTH = 4
const MAX_ROOM_LENGTH = 30

const MAX_ROOM_VIEW_LENGTH = 10

const RoomSelect = ({user, setUser}) => {
    const navigate = useNavigate()
    const{checkUser, deleteUser, getRooms, createRoom, joinGuest} = useFirebaseContext()

    // Checks if the user has logged in
    useEffect(() => { checkUser(user) }, [])

    // Checks if the user closes the tab
    const handleBeforeUnload = async (e) => {
        e.preventDefault()
        await deleteUser(user.name)
        setUser(null)
    }

    useEffect(() => {
        window.addEventListener('beforeunload', handleBeforeUnload)

        return () => { window.removeEventListener('beforeunload', handleBeforeUnload) }
    }, [])
            
    // Loads the pre-existent rooms
    const[rooms, setRooms] = useState([])

    const fetchRooms = async () => {
        const fetchedRooms = await getRooms()
        
        setRooms(fetchedRooms)
        
        setPasswordArray(fetchedRooms.reduce((acc) => [...acc, ""], []))
    }

    useEffect(() => { fetchRooms() }, [])

    const[isCreatingNewRoom, setIsCreatingNewRoom] = useState(false)
    const[roomName, setRoomName] = useState("")
    const[roomPassword, setRoomPassword] = useState("")
    const[passwordArray, setPasswordArray] = useState([])

    // Creates a new room
    const newRoom = async (e) => {
        e.preventDefault()

        if(roomName.length < MIN_ROOM_LENGTH) return alert(`Room name too short! Must be at least ${MIN_ROOM_LENGTH} characters`)
        if(roomName.length > MAX_ROOM_LENGTH) return alert(`Room name too long! Must be at most ${MAX_ROOM_LENGTH} characters`)

        await createRoom(roomName, user, roomPassword)
    }

    const joinRoom = async (e, index) => {
        e.preventDefault()

        const room = rooms[index]
        console.log(rooms, index)
        if(room.password.length > 0 && passwordArray[index] !== room.password) return alert("Error joining room! Incorrect password")

        console.log("RoomName: ", room.name, "User: ", user)
        await joinGuest(room.name, user)
    }

    // Enshorts the name of a room
    const shortString = (text, maxSize) => {
        return (text.length <= maxSize) ? text : text.slice(0, maxSize) + "..."
    }

    return(
        <div>
            <div>
                <div className={styles.user}>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <img src={avatarArray[user?.avatar]} alt="avatar" className={styles.photo}/>
                        <p style={{marginLeft: "1vw"}}>{user?.name}</p>
                    </div>
                    <button style={{marginLeft: "3vw"}} className={styles.button} onClick={(e) => {handleBeforeUnload(e) ; navigate('/')}}>Quit</button>
                </div>
                <h2>Available Rooms:</h2>
                <button class={styles.reload} onClick={fetchRooms}><span class="lnr lnr-sync"></span></button>
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
                : (<button className={styles.createbutton} onClick={() => {setIsCreatingNewRoom(true)}}>Create New Room</button>)}
            </div>
            <div className={styles.rooms}>
                {rooms?.map((room, index) => (
                    <React.Fragment key={index}>
                        {room.guest.name === "" && <div className={styles.room}>
                            <div className={styles.centering}>
                                <h3 style={{fontFamily: "'Raleway', sans-serif", fontSize: "1.25vw"}}>{room.name}{room.password.length > 0 && (<span className="lnr lnr-lock"></span>)}</h3>
                                <div>
                                    <p style={{fontFamily: "'Raleway', sans-serif", fontSize: "0.75vw", marginTop: "-2.2vh"}}>Hosted by:</p>
                                    <div style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "-0.75vh"}}>
                                        <img src={avatarArray[room.owner.avatar]} alt={`avatar-${room.owner.name}`} style={{height: "7vh", width: "3.5vw", borderRadius: "3vw"}}/>
                                        <p style={{fontFamily: "'Raleway', sans-serif", fontSize: "1.3vw", marginLeft: "0.6vw"}}>{shortString(room.owner.name, MAX_ROOM_VIEW_LENGTH)}</p>
                                    </div>
                                </div>
                                <form onSubmit={(e) => {joinRoom(e, index)}}>
                                    {room.password.length > 0 && (
                                        <div style={{marginTop: "0.7vh"}}>
                                            <label style={{fontFamily: "'Raleway', sans-serif", fontSize: "0.75vw"}} htmlFor="room-password">Password: </label>
                                            <input className={styles.nick} type="text" name="room-password" id="room-password"
                                                value={passwordArray[index]}
                                                onChange={(e) => {
                                                    let copyPasswordArray = [...passwordArray]
                                                    copyPasswordArray[index] = e.target.value
                                                    setPasswordArray(copyPasswordArray)
                                                }}
                                            />
                                        </div>
                                    )}
                                    <input className={styles.join} type="submit" value="Join"/>
                                </form>
                            </div>
                        </div>}
                    </React.Fragment>)
                )}
            </div>
        </div>
    )
}

export default RoomSelect