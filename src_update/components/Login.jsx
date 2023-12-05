import { useState, useEffect } from "react"

import { useFirebaseContext } from "../hooks/useFirebaseContext"

const MIN_NAME_LENGTH = 4
const MAX_NAME_LENGTH = 30

import { avatarArray } from "./avatarArray"

const Login = ({setUser}) => {
    const{createUser} = useFirebaseContext()

    const[name, setName] = useState("")
    const[avatar, setAvatar] = useState(0)

    // Login user
    const handleSubmit = (e) => {
        e.preventDefault()

        if(name.length < MIN_NAME_LENGTH) return alert(`Username too short! Must be at least ${MIN_NAME_LENGTH} characters`)
        if(name.length > MAX_NAME_LENGTH) return alert(`Username too long! Must be at most ${MAX_NAME_LENGTH} characters`)
    
        createUser(name, avatar)
        setUser({name, avatar})
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">User Name: </label>
                    <input type="text" name="name" id="name"
                        value={name}
                        onChange={(e) => {setName(e.target.value)}}
                    />
                </div>

                <div>
                    <label>Avatar:</label>
                    <div style={{display: "flex", boxSizing: "border-box", alignItems: "center"}}>
                        {avatarArray.map((image, index) => (
                            <img key={index} src={image} alt={`avatar-${index + 1}`}
                                style={{margin: "0 10px", width: "50px", height: "50px", border: index == avatar ? "5px solid #000" : "5px solid transparent"}}
                                onClick={(e) => {setAvatar(index)}}
                            />
                        ))}
                    </div>
                </div>

                <input type="submit" value="Play"/>
            </form>
        </div>
    )
}

export default Login