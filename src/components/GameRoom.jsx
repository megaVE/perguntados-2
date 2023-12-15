import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useFirebaseContext } from '../hooks/useFirebaseContext'
import { avatarArray } from './avatarArray'

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

    // Checks the feedback from the QuesitonPage
    const checkVictory = async () => {
        if(victory === null) return

        if(victory){
            console.log("Score added for ", user.name)
            await increaseScore(room.name, user.name)
        }

        await changeTurn(room.name)
        await fetchRoom()
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
                <button onClick={fetchRoom}>Updated Room</button>

                {/* Waiting Page */}
                {!(room.match.score.owner >= 2 || room.match.score.guest >= 2) && room.match.turn !== user.name && (<div>
                    <button onClick={async () => {await unloadRoom() ; navigate('/play')}}>Leave</button>
                    <h2>Scoreboard</h2>
                    <div>
                        <img src={avatarArray[room.owner.avatar]} alt="host-avatar"/>
                        <p>{room.owner.name} : {room.match.score.owner}</p>
                    </div>
                    <div>
                        <img src={avatarArray[room.guest.avatar]} alt="guest-avatar"/>
                        <p>{room.guest.name} : {room.match.score.guest}</p>
                    </div>
                    <p>Wait for your turn</p>
                </div>)}

                {/* Question Page */}
                {!(room.match.score.owner >= 2 || room.match.score.guest >= 2) && room.match.turn === user.name && (<>
                    <button onClick={async () => {await unloadRoom() ; navigate('/play')}}>Leave</button>
                    <QuestionPage setVictory={setVictory}/>
                </>)}

                {(room.match.score.owner >= 2 || room.match.score.guest >= 2) && (<div>
                    <h2>Results:</h2>
                    <div>
                        <img src={avatarArray[room.owner.avatar]} alt="host-avatar"/>
                        <p>{room.owner.name} : {room.match.score.owner}</p>
                    </div>
                    <div>
                        <img src={avatarArray[room.guest.avatar]} alt="guest-avatar"/>
                        <p>{room.guest.name} : {room.match.score.guest}</p>
                    </div>
                    <p>You {`${(room.match.score.owner >= 2 && user.name === room.owner.name || room.match.score.guest >= 2 && user.name === room.guest.name) ? "Win!" : "Lost"}`}</p>
                    <button onClick={async () => {await unloadRoom() ; navigate('/play')}}>Leave</button>
                </div>)}
            </>)
            : (<p>Loading Match...</p>)}
        </div>
    )
}

export default GameRoom