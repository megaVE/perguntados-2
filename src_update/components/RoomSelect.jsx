import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { avatarArray } from "./avatarArray"
import { useFirebaseContext } from "../hooks/useFirebaseContext"

const MIN_ROOM_LENGTH = 4
const MAX_ROOM_LENGTH = 30

const RoomSelect = ({user}) => {
    // Checks if the user has logged in
    const navigate = useNavigate()
    const{createRoom, getRooms} = useFirebaseContext()
    
    useEffect(() => {
        console.log("Current User: ", user)
        if(user === null){
            alert("Log in before going to the Room Hub")
            navigate("/")
        }
    }, [])

    // Loads the pre-existent rooms
    const[rooms, setRooms] = useState([])
    useEffect(() => {
        const fetchRooms = async () => {
            const fetchedRooms = await getRooms()
            setRooms(fetchedRooms)
        }
        fetchRooms()
    }, [])

    const[isCreatingNewRoom, setIsCreatingNewRoom] = useState(false)
    const[roomName, setRoomName] = useState("")
    const[roomPassword, setRoomPassword] = useState("")


    // Creates a new room
    const handleSubmit = (e) => {
        e.preventDefault()

        if(roomName.length < MIN_ROOM_LENGTH) return alert(`Room name too short! Must be at least ${MIN_ROOM_LENGTH} characters`)
        if(roomName.length > MAX_ROOM_LENGTH) return alert(`Room name too long! Must be at most ${MAX_ROOM_LENGTH} characters`)

        createRoom(roomName, user, roomPassword)
    }

    return(
        <div>
            <div>
                <div style={{display: "flex"}}>
                    <img src={avatarArray[user?.avatar]} alt="avatar" style={{width: "40px", height: "40px", border: "4px solid black"}}/>
                    <p style={{marginLeft: "10px"}}>{user?.name}</p>
                </div>
                <h2>Available Rooms:</h2>
                {isCreatingNewRoom
                ? (<form onSubmit={handleSubmit} style={{display: "flex"}}>
                    <div>
                        <label htmlFor="room-name">Room Name: </label>
                        <input type="text" name="room-name" id="room-name"
                            value={roomName}
                            onChange={(e) => {setRoomName(e.target.value)}}
                        />
                    </div>
                    <div>
                        <label htmlFor="room-password">Password: </label>
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
                    <div key={index}>
                        <h3>{room.password.length > 0 && "[Private]"} {room.name}</h3>
                        <p>Hosted by: {room.host}</p>
                        <button>Join</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RoomSelect