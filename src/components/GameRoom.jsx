import React from 'react'

const GameRoom = ({user, setUser}) => {
    return (
        <div>
            <form>
                <h2>Mulher deveria ter o direito de votar?</h2>
                <button>Sim!</button>
                <button>Óbvio que não</button>
                <button>O que é mulher?</button>
                <button>Me empresta um dinheiro</button>
            </form>
        </div>
    )
}

export default GameRoom