import React from 'react'
import { Link } from 'react-router-dom'

const ReturnScreen = () => {
    return(
        <div style={{textAlign: "center"}}>
            <h1>Your user and all the rooms you have created were deleted!</h1>
            <p>Click <Link to="/">here</Link> to go back to the Login Page</p>
        </div>
    )
}

export default ReturnScreen