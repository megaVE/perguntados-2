import { useState } from "react"
import styles from "./Login.module.css"

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
                <div className={styles.nickname}>
                    <label htmlFor="name">Choose your nickname: </label>
                    <input className={styles.nick} type="text" name="name" id="name"
                        value={name}
                        onChange={(e) => {setName(e.target.value)}}
                    />
                </div>

                <div className={styles.avatar}>
                    <label>Select your avatar:</label>
                    {/* <div style={{display: "flex", boxSizing: "border-box", alignItems: "center"}}> */}
                    <div style={{display: "flex", boxSizing: "border-box", alignItems: "center"}}>
                        {avatarArray.map((image, index) => (
                            <img key={index} src={image} alt={`avatar-${index + 1}`}
                                style={{transition: "0.2s", margin: "0 0.7vw", borderRadius: "5vw", width: "8vw", height: "8vw", border: index == avatar ? "0.4vw solid #000" : "0.4vw solid transparent"}}
                                onClick={(e) => {setAvatar(index)}}
                            />
                        ))}
                    </div>
                </div>
                <input type="submit" value="Play" className={styles.botao}/>
            </form>
        </div>
    )
}

export default Login