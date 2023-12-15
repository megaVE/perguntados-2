import styles from "./QuestionPage.module.css"

import { useEffect, useState } from "react"
import parse from 'html-react-parser'

// Database

import videogame from "../database/videogame.json"
import computer from "../database/computer.json"
import general from "../database/general.json"
import science from "../database/science.json"
import history from "../database/history.json"

const categories = [videogame, computer, general, science, history]

import { useNavigate } from "react-router-dom"
import { useFirebaseContext } from "../hooks/useFirebaseContext"


const MAX_QUESTIONS = 20
const QUESTIONS_TO_CROWN = 5

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

const QuestionPage = ({setVictory}) => {
    const navigate = useNavigate()
    const{} = useFirebaseContext()

    const[question, setQuestion] = useState(undefined)
    const[currentAnswer, setCurrentAnswer] = useState(null)
    const[isReplied, setIsReplied] = useState(false)
    const[hits, setHits] = useState(0)

    // Creates a new question
    const createQuestion = (category) => {
        const question = category.results[Math.floor(Math.random() * (MAX_QUESTIONS - 1))]
    
        const title = question.question
        const answers = shuffleArray([...question.incorrect_answers, question.correct_answer])
        const correct = question.correct_answer
    
        setQuestion({title, answers, correct})
    }

    // Creates the first question
    useEffect(() => { createQuestion(categories[0]) }, [])

    // Checks if enough questions were correct
    useEffect(() => { console.log(hits) ; if(hits >= QUESTIONS_TO_CROWN) { setVictory(true) } },[hits])

    // Checks the submited reply
    const checkReply = () => {
        // Feedback
        console.log(currentAnswer, parse(question.correct), currentAnswer === parse(question.correct))
        if(!currentAnswer === parse(question.correct)) setVictory(false)
        
        // Creates a new question
        setTimeout(() => {
            setHits(hits + 1)
            setIsReplied(false)
            createQuestion(categories[(hits < QUESTIONS_TO_CROWN - 1) ? hits + 1 : QUESTIONS_TO_CROWN - 1])
            setCurrentAnswer(null)
        }, 1500)
    }
    useEffect(() => { if(isReplied) checkReply() }, [isReplied])

    return (
        <form>
            <h2 className={styles.title}>{question ? `${hits + 1}. ${parse(question.title)}` : "Loading..."}</h2>
            {question?.answers && (
                <div className={styles.questionsContainer}>
                    {question.answers.map((answer, index) => (
                        <input key={index} type="button"
                            className={currentAnswer === answer
                                ? `${styles.button} ${currentAnswer === parse(question.correct) ? styles.correct : styles.wrong}`
                                : styles.button}
                            value={parse(answer)}
                            onClick={(e) => {setCurrentAnswer(e.target.value) ; setIsReplied(true)}}
                            disabled={isReplied}
                        />))}
                    {isReplied && (<p className={styles.feedback}>{(currentAnswer === parse(question.correct)) ? "Correct" : "Incorrect"} answer!</p>)}
                </div>
            )}
        </form>
    )
}

export default QuestionPage