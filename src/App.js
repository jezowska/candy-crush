import { useEffect, useState } from "react"
import ScoreBoard from "./components/ScoreBoard"

import blueCandy from './images/blue-candy.png'
import greenCandy from './images/green-candy.png'
import orangeCandy from './images/orange-candy.png'
import purpleCandy from './images/purple-candy.png'
import redCandy from './images/red-candy.png'
import yellowCandy from './images/yellow-candy.png'
import blank from './images/blank.png'



const width = 8
const candyColors = [blueCandy, greenCandy, orangeCandy, purpleCandy, redCandy, yellowCandy]

const App = () => {
    const [currentColorArrangment, setCurrentColorArrangment] = useState([])
    const [squareBeingDragged, setSquareBeingDragged] = useState(null)
    const [squareBeingReplaced, setSquareBeingReplaces] = useState(null)
    const [scoreDisplay, setScoreDisplay] = useState(0)

    const checkForColumnOfFour = () => {
        for (let i = 0; i <= 39; i++) {
            const columnOfFour = [i, i + width, i + width * 2, i + width * 3]
            const decidedColor = currentColorArrangment[i]
            const isBlank = currentColorArrangment[i] === blank

            if (columnOfFour.every(square => currentColorArrangment[square] === decidedColor) && !isBlank) {
                setScoreDisplay((score) => score + 4)
                columnOfFour.forEach(square => currentColorArrangment[square] = blank)
                return true
            }
        }
    }

    const checkForRowOfFour = () => {
        for (let i = 0; i < 64; i++) {
            const rowOfFour = [i, i + 1, i + 2, i + 3]
            const decidedColor = currentColorArrangment[i]
            const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64,]
            const isBlank = currentColorArrangment[i] === blank

            if (notValid.includes(i)) continue

            if (rowOfFour.every(square => currentColorArrangment[square] === decidedColor && !isBlank)) {
                setScoreDisplay((score) => score + 4)
                rowOfFour.forEach(square => currentColorArrangment[square] = blank)
                return true
            }
        }
    }

    const checkForColumnOfThree = () => {
        for (let i = 0; i <= 47; i++) {
            const columnOfThree = [i, i + width, i + width * 2]
            const decidedColor = currentColorArrangment[i]
            const isBlank = currentColorArrangment[i] === blank

            if (columnOfThree.every((square) => currentColorArrangment[square] === decidedColor && !isBlank)) {
                setScoreDisplay((score) => score + 3)
                columnOfThree.forEach((square) => (currentColorArrangment[square] = blank))
                return true
            }
        }
    }

    const checkForRowOfThree = () => {
        for (let i = 0; i < 64; i++) {
            const rowOfThree = [i, i + 1, i + 2]
            const decidedColor = currentColorArrangment[i]
            const isBlank = currentColorArrangment[i] === blank
            const notValid = [
                6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64,
            ]

            if (notValid.includes(i)) continue

            if (rowOfThree.every(square => currentColorArrangment[square] === decidedColor && !isBlank)) {
                setScoreDisplay((score) => score + 3)
                rowOfThree.forEach(square => currentColorArrangment[square] = blank)
                return true
            }
        }
    }



    const moveIntoSquareBelow = () => {
        for (let i = 0; i <= 55; i++) {
            const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
            const isFirstRow = firstRow.includes(i)
            const isBlank = currentColorArrangment[i] === blank

            if (isFirstRow && currentColorArrangment[i] === blank) {
                let randomNumber = Math.floor(Math.random() * candyColors.length)
                currentColorArrangment[i] = candyColors[randomNumber]
            }

            if (currentColorArrangment[i + width] === blank) {
                currentColorArrangment[i + width] = currentColorArrangment[i]
                currentColorArrangment[i] = blank
                return true
            }
        }
    }

    const dragStart = (e) => {
        setSquareBeingDragged(e.target)
    }

    const dragDrop = (e) => {
        setSquareBeingReplaces(e.target)
    }

    const dragEnd = (e) => {
        const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'))
        const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'))

        currentColorArrangment[squareBeingReplacedId] = squareBeingDragged.getAttribute('src')
        currentColorArrangment[squareBeingDraggedId] = squareBeingReplaced.getAttribute('src')

        const validMoves = [
            squareBeingDraggedId - 1,
            squareBeingDraggedId - width,
            squareBeingDraggedId + 1,
            squareBeingDraggedId + width
        ]

        const validMove = validMoves.includes(squareBeingReplacedId)

        const isAColumnOfFour = checkForColumnOfFour()
        const isARowOfFour = checkForRowOfFour()
        const isAColumnOfThree = checkForColumnOfThree()
        const isARowOfThree = checkForRowOfThree()

        if (squareBeingReplacedId &&
            validMove &&
            (isAColumnOfFour || isAColumnOfThree || isARowOfFour || isARowOfThree)) {
            setSquareBeingDragged(null)
            setSquareBeingDragged(null)
        } else {
            currentColorArrangment[squareBeingReplacedId] = squareBeingReplaced.getAttribute('src')
            currentColorArrangment[squareBeingDraggedId] = squareBeingDragged.getAttribute('src')
            setCurrentColorArrangment([...currentColorArrangment])

        }
    }

    const createBoard = () => {
        const randomColorArrangment = []

        for (let i = 0; i < width * width; i++) {
            const randomColor =
                candyColors[Math.floor(Math.random() * candyColors.length)]
            randomColorArrangment.push(randomColor)
        }

        setCurrentColorArrangment(randomColorArrangment)
    }

    useEffect(() => {
        createBoard()
    }, [width])

    useEffect(() => {
        const timer = setInterval(() => {
            checkForColumnOfFour()
            checkForRowOfFour()
            checkForColumnOfThree()
            checkForRowOfThree()
            moveIntoSquareBelow()

            setCurrentColorArrangment([...currentColorArrangment])
        }, 100)
        return () => clearInterval(timer)
    }, [
        checkForColumnOfFour,
        checkForRowOfFour,
        checkForColumnOfThree,
        checkForRowOfThree,
        moveIntoSquareBelow,
        currentColorArrangment,
    ])

    console.log(currentColorArrangment)

    return (
        <div className="app">
            <ScoreBoard score={scoreDisplay}></ScoreBoard>
            <div className="game">
                {currentColorArrangment.map((candyColor, index) => (
                    <img
                        key={index}
                        src={candyColor}
                        alt={candyColor}
                        data-id={index}
                        draggable={true}
                        onDragStart={dragStart}
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnter={(e) => e.preventDefault()}
                        onDragLeave={(e) => e.preventDefault()}
                        onDrop={dragDrop}
                        onDragEnd={dragEnd}
                    />
                ))}
            </div>
        </div>
    )
}

export default App
