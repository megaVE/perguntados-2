import { useEffect, useState } from "react"
import { avatarArray } from "./avatarArray"
import { useNavigate, useParams } from "react-router-dom"
import { useFirebaseContext } from "../hooks/useFirebaseContext"
import styles from "./RoomLobby.module.css"

const RoomLobby = ({user, setUser}) => {
    const{id} = useParams()
    const{checkUser, deleteUser, deleteRoom, getRoomByName, leaveGuest, readyHost, readyGuest} = useFirebaseContext()
    const navigate = useNavigate()

    const[match, setMatch] = useState(null)
    const[host, setHost] = useState(undefined)
    const[guest, setGuest] = useState(undefined)

    // Checks if both users are ready
    useEffect(() => { if(host?.ready && guest?.ready) navigate(`/play/${id}/start`) }, [host, guest])

    // Checks if the user has logged in
    useEffect(() => { checkUser(user) }, [])

    // Loads the participants data
    const roomFetch = async() => {
        const newMatch = await getRoomByName(id)
        if(!newMatch) return navigate('/play')
        console.log(newMatch)

        setMatch(newMatch)
        setHost(newMatch.owner)
        setGuest((newMatch.guest.name.length > 0) ? newMatch.guest : undefined)
    }
    useEffect(() => { roomFetch() }, [])

    // Checks if the user closes the tab
    const unloadRoom = async () => {
        if(user.name === match.owner.name){
            // Host leaves the room
            console.log("Deleting Room")
            await deleteRoom(match.name)
        }else{
            // Guest leave the room
            console.log("Leaving Room")
            await leaveGuest(match.name)
        }
    }

    const handleBeforeUnload = async (e) => {
        e.preventDefault()

        await unloadRoom()
        
        await deleteUser(user.name)
        setUser(null)
    }

    useEffect(() => {
        window.addEventListener('beforeunload', handleBeforeUnload)

        return () => { window.removeEventListener('beforeunload', handleBeforeUnload) }
    }, [])

    return(
        <div>
            <div className={styles.square}>
                <button onClick={async () => { await unloadRoom() ; navigate('/play') }} className={styles.butao}>Leave</button>
                <button onClick={roomFetch} className={styles.butao}>Update Room</button>
                {/* Host */}
                <div style={{display: "flex", alignItems: "center", justifyContent: "left", marginTop: "4%", marginLeft: "3%"}}>
                    <p>Host: </p>
                    {host
                    ? (<>
                        <img src={avatarArray[host.avatar]} alt="avatar-host" style={{height: "10vh", width: "5vw", margin: "0 10px", borderRadius: "10vw"}}/>
                        <p>{host.name}</p>
                        {host.name === user.name && <button className={styles.butao} style={{ marginTop: "0" }} onClick={async () => { await readyHost(match.name, host.ready) ; setHost({...host, ready: !host.ready}) }}>Ready</button>}
                        <span className={`lnr ${host.ready ? "lnr-thumbs-up" : "lnr-thumbs-down"}`} style={{color: `${host.ready ? "green" : "red"}`}}></span>
                    </>)
                    : (<p style={{marginLeft: "10px"}}>Loading...</p>)}
                </div>
                {/* Guest */}
                <div style={{display: "flex", alignItems: "center", justifyContent: "left", marginTop: "4%", marginLeft: "3%"}}>
                    <p>Guest: </p>
                    {guest
                    ? (<>
                        <img src={avatarArray[guest.avatar]} alt="avatar-guest" style={{height: "10vh", width: "5vw", margin: "0 10px", borderRadius: "10vw"}}/>
                        <p>{guest.name}</p>
                        {guest.name === user.name && <button className={styles.butao} style={{ marginTop: "0" }} onClick={async () => { await readyGuest(match.name, guest.ready) ; setGuest({...guest, ready: !guest.ready}) }}>Ready</button>}
                        <span className={`lnr ${guest.ready ? "lnr-thumbs-up" : "lnr-thumbs-down"}`} style={{color: `${guest.ready ? "green" : "red"}`, marginLeft: "1%"}}></span>
                    </>)
                    : (<p style={{marginLeft: "10px"}}>Waiting Player...</p>)}
                </div>
            </div>
        </div>
    )
}

export default RoomLobby