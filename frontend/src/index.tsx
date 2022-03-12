import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import {Button} from "@mui/material";
import axios from 'axios';
import {JsonToTable} from "react-json-to-table";

enum Cell { X = 'X', O = 'O', Empty = 'Empty' }

type GameMoveProps = {
    currentPlayer: string;
    gameTableSerialized: string;
    winner: string;
}

const GameMove = (prop: GameMoveProps) => { //Taking status from the database and returning a ready-to-show html
    const reg = /"/g;
    const str = prop.gameTableSerialized;
    const tableJson = str.replace(reg, ""); //Remove ""

    const regexMatch = /\[\[(.+)\],\[(.+)],\[(.+)\]\]/; //Take the 3 rows in 3 regex groups
    const trueJson = {
        "First Row": regexMatch.exec(tableJson)![1].replace(/,/g, " "),
        "Second Row": regexMatch.exec(tableJson)![2].replace(/,/g, " "),
        "Third Row": regexMatch.exec(tableJson)![3].replace(/,/g, " "),
    }

    // if (prop.winner !== "There's no winner yet!") {
    //     localStorage.setItem("storedEnd", JSON.stringify(true));
    // }

    return <div>
        <h2>{"Player: " + prop.currentPlayer}</h2>
        <h3 style={{color: "blue"}}>{prop.winner}</h3>
        <JsonToTable json={trueJson}/>
    </div>
}

const TicTacToe = () => {
    useEffect(() => {
        document.title = "Tic Tac Toe"
    }, []);

    const [gameMoves, setGameMoves] = React.useState<GameMoveProps[]>([]);

    //-------------------- Persistent values ----------------------------------------------------
    // const storedEnd = JSON.parse(localStorage.getItem("storedEnd")!);
    // const [end, setEnd] = React.useState(storedEnd == null ? false : storedEnd);

    const storedPlayer = JSON.parse(localStorage.getItem("storedPlayer")!);
    const [player, setPlayer] = React.useState(storedPlayer == null ? 0 : storedPlayer);

    const storedTable = JSON.parse(localStorage.getItem("storedTable")!); //Getting the table from localstorage (so i have a matrix that persist even if i reload the page)
    const [table, setTable] = React.useState<Cell[][]>(storedTable == null ? Array(3).fill(Cell.Empty).map(() => Array(3).fill(Cell.Empty)) : storedTable); //If the stored table doesn't exists: creating a const matrix, and filling it with Cell.Empty
    //-----------------------------------------------------------------------------------------

    React.useEffect(() => {
        getGameMoves().then(setGameMoves);
    }, []);

    const handleAddPositions = (e: any) => {
        const strArray = e.target.value.split("");
        const i = Number(strArray[0]);
        const j = Number(strArray[1]);

        console.log(JSON.parse(localStorage.getItem("storedEnd")!));
        if (table[i][j] == Cell.Empty) {
            let copy = [...table];
            copy[i][j] = player == 0 ? Cell.X : Cell.O;

            setTable(copy);
            localStorage.setItem("storedTable", JSON.stringify(copy));

            let next = player == 0 ? 1 : 0;
            setPlayer(next);
            localStorage.setItem("storedPlayer", JSON.stringify(next));

            saveMove(i, j);
            window.location.reload();
        }
    }

    return <div>

        <div style={{
            fontFamily: "Arial",
            color: "white",
            display: "table",
            margin: "0 auto",
            marginTop: "20px",
            textAlign: "center",
            width: "70px",
            borderRadius: "30px",
            backgroundColor: "#7833ff"
        }}>Next: {player == 0 ? "X" : "0"}</div>

        <div style={{display: "table", margin: "0 auto", marginTop: "20px"}}>
            <div style={{display: "block"}}>
                <Button value="00" variant="outlined"
                        onClick={handleAddPositions}>{table[0][0] == Cell.Empty ? "-" : table[0][0]}</Button>
                <Button value="01" variant="outlined"
                        onClick={handleAddPositions}>{table[0][1] == Cell.Empty ? "-" : table[0][1]}</Button>
                <Button value="02" variant="outlined"
                        onClick={handleAddPositions}>{table[0][2] == Cell.Empty ? "-" : table[0][2]}</Button>
            </div>
            <div style={{display: "block"}}>
                <Button value="10" variant="outlined"
                        onClick={handleAddPositions}>{table[1][0] == Cell.Empty ? "-" : table[1][0]}</Button>
                <Button value="11" variant="outlined"
                        onClick={handleAddPositions}>{table[1][1] == Cell.Empty ? "-" : table[1][1]}</Button>
                <Button value="12" variant="outlined"
                        onClick={handleAddPositions}>{table[1][2] == Cell.Empty ? "-" : table[1][2]}</Button>
            </div>
            <div style={{display: "block"}}>
                <Button value="20" variant="outlined"
                        onClick={handleAddPositions}>{table[2][0] == Cell.Empty ? "-" : table[2][0]}</Button>
                <Button value="21" variant="outlined"
                        onClick={handleAddPositions}>{table[2][1] == Cell.Empty ? "-" : table[2][1]}</Button>
                <Button value="22" variant="outlined"
                        onClick={handleAddPositions}>{table[2][2] == Cell.Empty ? "-" : table[2][2]}</Button>
            </div>
        </div>

        {/*<div></div>*/}

        <Button style={{backgroundColor: "#7833ff", display: "table", margin: "0 auto", marginTop: "20px"}}
                variant="contained" onClick={clearMoves}>Start a new Game</Button>

        <hr style={{marginTop: "20px"}}></hr>
        {gameMoves.map((move, id) =>
            <GameMove key={id} currentPlayer={move.currentPlayer}
                      gameTableSerialized={move.gameTableSerialized} winner={move.winner}></GameMove>)
        }
    </div>
}

const getGameMoves = async () => {
    const result = await axios.get('http://localhost:8080/state');
    return result.data as GameMove[];
}

type GameMove = { currentPlayer: string, gameTableSerialized: string, winner: string }

const saveMove = async (i: number, j: number) => {
    const posI = i;
    const posJ = j;
    await axios.post('http://localhost:8080/move', null, {
        params: {
            posI,
            posJ
        }
    });
}

const clearMoves = async () => {
    localStorage.removeItem("storedTable");
    localStorage.removeItem("storedPlayer");
    // localStorage.removeItem("storedEnd");

    await axios.delete('http://localhost:8080/deleteStates');
    window.location.reload();
}

ReactDOM.render(
    <React.StrictMode>
        <h2 style={{textAlign: "center", fontFamily: "Arial", color: "#7833ff"}}>Tic Tac Toe</h2>
        <TicTacToe></TicTacToe>
    </React.StrictMode>,
    document.getElementById('root')
);
