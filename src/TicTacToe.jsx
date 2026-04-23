import { useRef, useState, useEffect } from 'react'
import circle_icon from './assets/green_circle.png'
import cross_icon from './assets/cross.png'

function TicTacToe() {
    const [board, setBoard] = useState(Array(9).fill(""));
    const [count, setCount] = useState(0);
    const [player1, setPlayer1] = useState("");
    const [player2, setPlayer2] = useState("");
    const [nameAi, setNameAi] = useState("AI");
    const [view, setView] = useState("menu"); {/* menu, naming, countdown, playing, winner-x, winner-o*/}
    const [lock, setLock] = useState(false);
    const [timer, setTimer] = useState(3);

    useEffect(() => {
        let interval = null;
        if (view === "countdown") {
            setLock(true);
            interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        setView("playing");
                        clearInterval(interval);
                        setLock(false);
                        return 0;
                    }
                    return prev - 1;
                })
            }, 1000)
        }

        return () => clearInterval(interval);

    }, [view]);

    useEffect(() => {
        if (view === "playing" && player2 === nameAi && count % 2 !== 0 && !lock) {
            moveAI(board);
        }
    }, [count, view])

    const moveAI = (currentBoard) => {
        let emptyIndices = currentBoard
            .map((value, idx) => value === "" ? idx : null)
            .filter(value => value !== null);
        
        if (emptyIndices.length > 0) {
            let random_index = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
            setTimeout(() => {
                const newBoard = [...board];
                newBoard[random_index] = "o";
                setBoard(newBoard);
                setCount(c => c + 1);
                checkWin(newBoard);
            }, 3000)
        }
    }

    const timerCountdown = () => {
        if (player1.trim() === "" || player2.trim() === "") {
            alert("Please enter both names!");
            return;
        }
        setView("countdown");
    }

    const reset = () => {
        setBoard(Array(9).fill(""));
        setCount(0);
        setView("menu");
        setLock(false);
        setTimer(3);
        setPlayer1("");
        setPlayer2("");
    }

    const displayIcon = (e, num) => {
        if (lock || board[num] !== "" || (player2 === nameAi && count % 2 !== 0 && !lock)) {
            return;
        }
    
        const newBoard = [...board];
        newBoard[num] = count % 2 === 0 ? "x" : "o";

        setCount(c => c + 1);
        setBoard(newBoard);
        checkWin(newBoard);
    }

    const startNaming = () => {
        setView("naming");
    }

    const startNamingWithAI = () => {
        setPlayer2(nameAi);
        setView("namingWithAI");
    }

    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]             
    ];

    const checkWin = (currentBoard) => {
        let winner = null;
        for (let combination of winningCombinations) {
            const [a, b, c] = combination;
            if (currentBoard[a] === currentBoard[b] && currentBoard[b] === currentBoard[c] && currentBoard[c] !== "") {
                winner = currentBoard[c];
                win(winner);
                return;
            }
        }

        if (currentBoard.every(box => box !== "")) {
            tie();
        }
        return null;
    }

    const tie = () => {
        setLock(true);
        setView("tie");
    }

    const win = (winner) => {
        setLock(true);
        setView("winner-" + winner);
    }

    return (
        <div className="container">
            <div className="container-title">
                <h1 id="title">
                    {view === "countdown" && `Si parte tra... ${timer}`}
    
                    {(view === "menu" || view === "naming" || view === "namingWithAI") ? 
                        <>Tic Tac Toe in <span>React</span></> : null}
                    
                    {view === "playing" && <>Match in progress...</>}
                    
                    {view === "winner-x" && <>Congratulations: <span>{player1}</span> is the winner!!</>}
                    
                    {view === "winner-o" && <>Congratulations: <span>{player2}</span> is the winner!!</>}
                    
                    {view === "tie" && "It is a TIE!!"}
                </h1>
            </div>

            <div className="game-header">
                {view === "menu" && (
                    <div className="players">
                        <button id="btn-players" onClick={startNaming}>2 Players</button>
                        <button id="btn-players" onClick={startNamingWithAI}>You vs AI</button>
                    </div>
                )}
            </div>


            {view == "naming" && (
                <>
                    <div className="players-container">
                        <input 
                        type="text"
                        id="player-name"
                        value={player1}
                        placeholder="Player 1 name (X)"
                        onChange={(e) => setPlayer1(e.target.value)}
                        />
                        <input 
                        type="text"
                        id="player-name"
                        value={player2}
                        placeholder="Player 2 name (O)"
                        onChange={(e) => setPlayer2(e.target.value)}
                        />
                        <button id="btn-countdown" onClick={timerCountdown}>Start!</button>
                    </div>

                </>
            )}

            {view === "namingWithAI" && (
                <>
                    <div className="players-container">
                        <input 
                        type="text"
                        id="player-name"
                        value={player1}
                        placeholder="Player 1 name (X)"
                        onChange={(e) => setPlayer1(e.target.value)}
                        />
                        <input 
                        type="text"
                        id="player-name"
                        value={nameAi}
                        />
                        <button id="btn-countdown" onClick={timerCountdown}>Start!</button>
                    </div>

                </>
            )}

            {view === "playing" && (
                <div className="turn-indicator">
                    Turno di: <span>{count % 2 == 0 ? player1 : player2}</span>
                </div>
            )}
            
            {(view === "playing" || view === "countdown"|| view === "winner-x" 
                || view === "winner-o" || view === "tie") && (
                <div className="board-game">
                    {board.map((value, index) => 
                        <div
                            key={index}
                            className={`box${index + 1}`}
                            onClick={(e) => displayIcon(e, index)}
                        >
                            {value === "x" && <img src={cross_icon} />}
                            {value === "o" && <img src={circle_icon} />}
                        </div>
                    )}
                </div>
            )}

            <div className="btn-container">
                {(view === "playing" || view === "winner-x" || view === "winner-o" || view === "tie") && (
                    <button className="btn-reset" onClick={reset}>Reset</button>
                )}
            </div>
        </div>
    );
}

export default TicTacToe