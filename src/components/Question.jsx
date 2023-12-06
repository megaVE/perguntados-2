import styles from "./Question.module.css"

import { useEffect, useState } from "react"
import parse from 'html-react-parser'

// Database

import videogame from "../database/videogame.json"
import computer from "../database/computer.json"
import { Link, useNavigate } from "react-router-dom"

const categories = {videogame, computer}

const MAX_QUESTIONS = 20

// Shuffles an array
function shuffleArray(array){
    let currentIndex = array.length
    let randomIndex
    
    while(currentIndex > 0){ // While there remain elements to shuffle
        randomIndex = Math.floor(Math.random() * currentIndex) // Pick a remaining element
        currentIndex--
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]] // And swap it with the current element
    }

    return array;
}

const Question = ({user, category}) => {
    // Checks if the user is logged in
    const navigate = useNavigate()
    // useEffect(() => {
    //     console.log("Current User: ", user)
    //     if(user === null){
    //         alert("Log in before joining a Room")
    //         navigate("/")
    //     }
    // }, [])

    const[question, setQuestion] = useState(undefined);
    const[currentAnswer, setCurrentAnswer] = useState(null);

    // Creates a new question
    const createQuestion = (category) => {
        const question = category.results[Math.floor(Math.random() * (MAX_QUESTIONS - 1))]
    
        const title = question.question
        const answers = shuffleArray([...question.incorrect_answers, question.correct_answer])
        const correct = question.correct_answer
    
        setQuestion({title, answers, correct})
    }

    // Creates the first question
    useEffect(() => {createQuestion(computer)}, [])

    // Question Submit
    const handleSubmit = (e) => {
        e.preventDefault()
        
        // Feedback
        console.log(currentAnswer, question.correct, currentAnswer === parse(question.correct))
    
        // Creates a new question
        setTimeout(() => {
            createQuestion(computer)
            setCurrentAnswer(null)
        }, 1500)
    }

    return (
        <form onSubmit={handleSubmit}>
            <button onClick={() => {navigate('/play')}}>Leave</button>
            <h2 className={styles.title}>{question ? parse(question.title) : "Loading..."}</h2>
            {question?.answers && (
                <div className={styles.questionsContainer}>
                    {question.answers.map((answer, index) => (
                        <input key={index} type="submit"
                            className={currentAnswer === answer
                                ? `${styles.button} ${currentAnswer === parse(question.correct) ? styles.correct : styles.wrong}`
                                : styles.button}
                            value={parse(answer)}
                            onClick={(e) => {setCurrentAnswer(e.target.value)}}
                            disabled={currentAnswer !== null}
                        />))}
                    {currentAnswer !== null
                    && (<p className={styles.feedback}>{(currentAnswer === parse(question.correct)) ? "Correct" : "Incorrect"} answer!</p>)}
                </div>)}
        </form>
    )
}

export default Question