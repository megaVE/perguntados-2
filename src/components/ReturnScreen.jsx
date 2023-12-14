import React from 'react'
import { Link } from 'react-router-dom'
import styles from "./ReturnScreen.module.css"

const ReturnScreen = () => {
    return(
        <div style={{textAlign: "center"}}>
            <h1 style={{marginTop: "15%", marginLeft: "20%", marginRight: "20%"}}>Your user and all the rooms you have created were deleted!</h1>
            <p className={styles.return}><Link to="/">Click here to go back to the Login Page</Link></p>
        </div>
    )
}

export default ReturnScreen