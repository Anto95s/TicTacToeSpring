import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import {Button} from "@mui/material";
import axios from 'axios';
import {JsonToTable} from "react-json-to-table";

type GameMoveProps = {
    currentPlayer: string;
    gameTableSerialized: string;
    winner: string;
}

const GameMove = (prop: GameMoveProps) => {
    const reg = /"/g;
    const str = prop.gameTableSerialized;
    const tableJson = str.replace(reg, ""); //Remove ""

    const regexMatch = /\[\[(.+)\],\[(.+)],\[(.+)\]\]/; //Take the 3 rows in 3 regex groups
    const trueJson = {
        "First Row": regexMatch.exec(tableJson)![1].replace(/,/g, " "),
        "Second Row": regexMatch.exec(tableJson)![2].replace(/,/g, " "),
        "Third Row": regexMatch.exec(tableJson)![3].replace(/,/g, " "),
    }

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
    const [newPosI, setNewPosI] = React.useState(0);
    const [newPosJ, setNewPosJ] = React.useState(0);

    React.useEffect(() => {
        getGameMoves().then(setGameMoves);
    }, []);

    // const handleInputPosI = (e: any) => setNewPosI(parseInt(e.target.value)); //Setting inputs (two numbers/positions)
    // const handleInputPosJ = (e: any) => setNewPosJ(parseInt(e.target.value));
    const handleAddPositions = (e: any) => {
        const strArray = e.target.value.split("");
        const posI = Number(strArray[0]);
        const posJ = Number(strArray[1]);

        setNewPosI(posI);
        setNewPosJ(posJ);
        saveMove(newPosI, newPosJ);
        window.location.reload();
    }

    return <div>
        {/*<TextField style={{margin: "20px"}} value={newPosI} type="number" onInput={handleInputPosI}></TextField>*/}
        {/*<TextField style={{margin: "20px"}} value={newPosJ} type="number" onInput={handleInputPosJ}></TextField>*/}

        <div style={{display: "table", margin: "0 auto", marginTop: "20px"}}>
            <div style={{display: "block"}}>
                <Button value="00" variant="outlined" onClick={handleAddPositions}>+</Button>
                <Button value="01" variant="outlined" onClick={handleAddPositions}>+</Button>
                <Button value="02" variant="outlined" onClick={handleAddPositions}>+</Button>
            </div>
            <div style={{display: "block"}}>
                <Button value="10" variant="outlined" onClick={handleAddPositions}>+</Button>
                <Button value="11" variant="outlined" onClick={handleAddPositions}>+</Button>
                <Button value="12" variant="outlined" onClick={handleAddPositions}>+</Button>
            </div>
            <div style={{display: "block"}}>
                <Button value="20" variant="outlined" onClick={handleAddPositions}>+</Button>
                <Button value="21" variant="outlined" onClick={handleAddPositions}>+</Button>
                <Button value="22" variant="outlined" onClick={handleAddPositions}>+</Button>
            </div>
        </div>

        {/*<Button style={{display: "table", margin: "0 auto", marginTop: "20px"}} variant="contained"*/}
        {/*        onClick={handleAddPositions}>Add</Button>*/}

        <Button style={{backgroundColor: "#FF3333", display: "table", margin: "0 auto", marginTop: "20px"}}
                variant="contained" onClick={clearMoves}>Clear</Button>

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
    await axios.delete('http://localhost:8080/deleteStates');
    window.location.reload();
}

ReactDOM.render(
    <React.StrictMode>
        <h2 style={{textAlign: "center", fontFamily: "Arial", color: "#3c3c6a"}}>Tic Tac Toe</h2>
        <TicTacToe></TicTacToe>
    </React.StrictMode>,
    document.getElementById('root')
);
