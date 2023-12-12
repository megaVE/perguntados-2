import { useEffect, useState } from "react"
import { avatarArray } from "./avatarArray"
import { useNavigate, useParams } from "react-router-dom"
import { useFirebaseContext } from "../hooks/useFirebaseContext"
import styles from "./RoomLobby.module.css"

const RoomLobby = ({user, setUser}) => {
    const{id} = useParams()
    const{getMatch, deleteUser, deleteRoom} = useFirebaseContext()
    const navigate = useNavigate()

    const[match, setMatch] = useState(null)
    const[host, setHost] = useState(null)
    const[guest, setGuest] = useState(null)

    // Loads the participants data
    useEffect(() => {
        const loadMatch = async() => {
            const newMatch = await getMatch(id)
            if(newMatch === null) return navigate('/play')
            
            setMatch(newMatch)

            if(user.name === newMatch.owner.name){
                // Host display
                setHost(user)
            }else{
                // Guest display
                setHost(match.owner)
                setGuest(user)
            }
        }
        loadMatch()
    }, [])

    // Checks if the user closes the tab
    const handleBeforeUnload = async (e) => {
        e.preventDefault()

        if(user.name === match.owner.name){
            await deleteRoom(match.name)
            setMatch(null)
        }
        
        await deleteUser(user.name)
        setUser(null)
    }

    useEffect(() => {
        window.addEventListener('beforeunload', handleBeforeUnload)

        return () => { window.removeEventListener('beforeunload', handleBeforeUnload) }
    }, [])

    const unloadRoom = async () => {
        if(user.name === match.owner.name){
            await deleteRoom(match.name)
            setMatch(null)
        }
        
        navigate('/play')
    }

    return(
        <div>
            <div>
                <button onClick={unloadRoom}>Leave</button>
                {/* Host */}
                <div style={{display: "flex", alignItems: "center"}}>
                    <p>Host: </p>
                    {host
                    ? (<>
                        <img src={avatarArray[host.avatar]} alt="avatar-host" style={{height: "30px", width: "30px", margin: "0 10px"}}/>
                        <p>{host.name}</p>
                        {host.name === user.name && <button onClick={() => { setHost({...host, ready: !host.ready}) }}>Ready</button>}
                        <span className={`lnr ${host.ready ? "lnr-thumbs-up" : "lnr-thumbs-down"}`} style={{color: `${host.ready ? "green" : "red"}`}}></span>
                    </>)
                    : (<p style={{marginLeft: "10px"}}>Loading...</p>)}
                </div>
                {/* Guest */}
                <div style={{display: "flex", alignItems: "center"}}>
                    <p>Guest: </p>
                    {guest
                    ? (<>
                        <img src={avatarArray[guest.avatar]} alt="avatar-guest" style={{height: "30px", width: "30px", margin: "0 10px"}}/>
                        <p>{guest.name}</p>
                        {guest.name === user.name && <button onClick={() => { setGuest({...guest, ready: !guest.ready}) }}>Ready</button>}
                        <span className={`lnr ${guest.ready ? "lnr-thumbs-up" : "lnr-thumbs-down"}`} style={{color: `${guest.ready ? "green" : "red"}`}}></span>
                    </>)
                    : (<p style={{marginLeft: "10px"}}>Waiting Player...</p>)}
                </div>
            </div>
        </div>
    )
}

export default RoomLobby