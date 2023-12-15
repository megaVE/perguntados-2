import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useFirebaseContext } from '../hooks/useFirebaseContext'
import { avatarArray } from './avatarArray'
import styles from './GameRoom.module.css'
import QuestionPage from './QuestionPage' 

const MAX_SCORE = 2

const GameRoom = ({user, setUser}) => {
    const{id} = useParams()
    const navigate = useNavigate()
    const{checkUser, deleteUser, deleteRoom, leaveGuest, getRoomByName, changeTurn, increaseScore} = useFirebaseContext()

    const[room, setRoom] = useState(undefined)
    const[victory, setVictory] = useState(null)

    // Checks if the user has logged in
    useEffect(() => { checkUser(user) }, [])

    // Loads the match data
    const fetchRoom = async () => {
        const newRoom = await getRoomByName(id)

        setRoom(newRoom)
    }
    useEffect(() => { fetchRoom() }, [])

    // Constantly updates the page's data
    useEffect(() => {
        const update = setTimeout(() => {
            console.log("Timeout Reload")
            fetchRoom()
        }, 1500)

        return () => clearTimeout(update)
    }, [room])

    // Checks the feedback from the QuesitonPage
    const checkVictory = async () => {
        if(victory === null) return

        if(victory){
            console.log("Score added for ", user.name)
            await increaseScore(room.name, user.name)
        }
        
        await changeTurn(room.name)
        await fetchRoom()
        setVictory(null)
    }
    useEffect(() => { checkVictory() }, [victory])

    // Checks if the user closes the tab
    const unloadRoom = async () => {
        if(user.name === room.owner.name){
            // Host leaves the room
            console.log("Deleting Room")
            await deleteRoom(room.name)
        }else{
            // Guest leave the room
            console.log("Leaving Room")
            await leaveGuest(room.name)
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
            {room
            ? (<>
                <button className={styles.botoes} style={{ marginTop: "1.7%", marginLeft: "86.5%"}} onClick={fetchRoom}>Update Room</button>
                    {/* Waiting Page */}
                    {!(room.match.score.owner >= 2 || room.match.score.guest >= 2) && room.match.turn !== user.name && (<div>
                        <button className={styles.botoes} style={{ marginTop: "1.7%", marginLeft: "75.5%"}} onClick={async () => {await unloadRoom() ; navigate('/play')}}>Leave</button>
                        <div className={styles.square}>
                            <h2 style={{ paddingTop: "3%", fontSize: "4vw" }}>Scoreboard</h2>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <img src={avatarArray[room.owner.avatar]} style={{height: "10vh", width: "5vw", margin: "0 10px", borderRadius: "10vw"}} alt="host-avatar"/>
                                <p>{room.owner.name} : {<span class={(room.match.score.owner >= 1) ? "lnr lnr-star" : "lnr lnr-star-empty"}></span>} {<span class={(room.match.score.owner >= 2) ? "lnr lnr-star" : "lnr lnr-star-empty"}></span>}</p>
                            </div>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <img src={avatarArray[room.guest.avatar]} style={{height: "10vh", width: "5vw", margin: "0 10px", borderRadius: "10vw"}} alt="guest-avatar"/>
                                <p>{room.guest.name} : {<span class={(room.match.score.guest >= 1) ? "lnr lnr-star" : "lnr lnr-star-empty"}></span>} {<span class={(room.match.score.guest >= 2) ? "lnr lnr-star" : "lnr lnr-star-empty"}></span>}</p>
                            </div>
                            <p>Wait for your turn...</p>
                        </div>
                    </div>)}

                {/* Question Page */}
                {!(room.match.score.owner >= 2 || room.match.score.guest >= 2) && room.match.turn === user.name && (<>
                    <button className={styles.botoes} style={{ marginTop: "1.7%", marginLeft: "75.5%"}} onClick={async () => {await unloadRoom() ; navigate('/play')}}>Leave</button>
                    <QuestionPage setVictory={setVictory}/>
                </>)}

                {/* Result Page */}
                {(room.match.score.owner >= 2 || room.match.score.guest >= 2) && (<div>
                    <div className={styles.square}>
                        <h2 style={{ paddingTop: "3%", fontSize: "4vw" }}>Results:</h2>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <img src={avatarArray[room.owner.avatar]} style={{height: "10vh", width: "5vw", margin: "0 10px", borderRadius: "10vw"}}  alt="host-avatar"/>
                            <p>{room.owner.name} : {<span class={(room.match.score.owner >= 1) ? "lnr lnr-star" : "lnr lnr-star-empty"}></span>} {<span class={(room.match.score.owner >= 2) ? "lnr lnr-star" : "lnr lnr-star-empty"}></span>}</p>
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <img src={avatarArray[room.guest.avatar]} style={{height: "10vh", width: "5vw", margin: "0 10px", borderRadius: "10vw"}} alt="guest-avatar"/>
                            <p>{room.guest.name} : {<span class={(room.match.score.guest >= 1) ? "lnr lnr-star" : "lnr lnr-star-empty"}></span>} {<span class={(room.match.score.guest >= 2) ? "lnr lnr-star" : "lnr lnr-star-empty"}></span>}</p>
                        </div>
                        <p>You {`${(room.match.score.owner >= 2 && user.name === room.owner.name || room.match.score.guest >= 2 && user.name === room.guest.name) ? "Win!" : "Lost"}`}</p>
                        <button className={styles.botoes} style={{ marginTop: "60%", marginLeft: "40%"}} onClick={async () => {await unloadRoom() ; navigate('/play')}}>Leave</button>
                    </div>
                </div>)}
            </>)
            : (<p className={styles.texto}>Loading Match...</p>)}
        </div>
    )
}

export default GameRoom