import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { FirebaseContextProvider } from "./context/FirebaseContext.jsx"

// Pages

import Login from './components/Login'
import Question from './components/Question'
import RoomSelect from './components/RoomSelect'
import RoomLobby from './components/RoomLobby.jsx'

function App() {
    const[user, setUser] = useState(null)

    return (<>
        <h1>Não é o Perguntados</h1>
        <BrowserRouter>
            <FirebaseContextProvider>
                <Routes>
                    {/* <Route path="/play/:id" element={<Question user={user} category=""/>}/> */}
                    <Route path="/play/:id" element={<RoomLobby user={user}/>}/>
                    <Route path="/play" element={<RoomSelect user={user}/>}/>
                    <Route path="/" element={<Login setUser={setUser}/>}/>
                    {/* <Route path="/" element={<RoomLobby user={user}/>}/> */}
                </Routes>
            </FirebaseContextProvider>
        </BrowserRouter>
    </>)
}

export default App
