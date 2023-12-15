import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { FirebaseContextProvider } from "./context/FirebaseContext.jsx"

// Pages

import Login from './components/Login'
import RoomSelect from './components/RoomSelect'
import RoomLobby from './components/RoomLobby.jsx'
import ReturnScreen from './components/ReturnScreen.jsx'
import GameRoom from './components/GameRoom.jsx'

function App() {
    const[user, setUser] = useState(null)

    return (<>
        <h1 className='title'>Não é o Perguntados</h1>
        <BrowserRouter>
            <FirebaseContextProvider>
                <Routes>
                    <Route path="/play/:id/start" element={user ? <GameRoom setUser={setUser} user={user}/> : <ReturnScreen/>}/>
                    <Route path="/play/:id" element={user ? <RoomLobby setUser={setUser} user={user}/> : <ReturnScreen/>}/>
                    <Route path="/play" element={user ? <RoomSelect setUser={setUser} user={user}/> : <ReturnScreen/>}/>
                    <Route path="/" element={<Login setUser={setUser} user={user}/>}/>
                </Routes>
            </FirebaseContextProvider>
        </BrowserRouter>
    </>)
}

export default App
