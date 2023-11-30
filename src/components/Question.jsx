import { useEffect, useState } from "react"
import parse from 'html-react-parser'

// Database

import videogame from "../database/videogame.json"
import computer from "../database/computer.json"

const MAX_QUESTIONS = 20

const Question = ({category}) => {
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

    const[question, setQuestion] = useState(undefined);
    const[currentAnswer, setCurrentAnswer] = useState(null);
    const[confirmedAnswer, setConfirmedAnswer] = useState(false);

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
        setConfirmedAnswer(true)
        
        // Feedback
        console.log(currentAnswer, question.correct, currentAnswer === parse(question.correct))
    
        // Creates a new question
        setTimeout(() => {
            createQuestion(computer)
            setConfirmedAnswer(false)
        }, 1500)
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>{question ? parse(question.title) : "Loading..."}</h2>
            {question?.answers && (
                <div>
                    {question.answers.map((answer, index) => (
                        <input key={index} type="submit"
                            value={parse(answer)}
                            onClick={(e) => {setCurrentAnswer(e.target.value)}}
                            disabled={confirmedAnswer}
                        />))}
                    {confirmedAnswer && <p>{(currentAnswer === parse(question.correct)) ? "Correct" : "Incorrect"} answer!</p>}
                </div>)}
        </form>
    )
}

export default Question