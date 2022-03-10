import React from 'react';
import ReactDOM from 'react-dom';
import {Button, TextField} from "@mui/material";
import axios from 'axios';
import { JsonToTable } from "react-json-to-table";

type GameMoveProps = {
    currentPlayer: string;
    gameTableSerialized: string;
}

const GameMove = (prop: GameMoveProps) => {
    const tableJson = prop.gameTableSerialized;
    const regexMatch = /\[\[(.+)\],\[(.+)],\[(.+)\]\]/;
    const trueJson = {
        "First Row": regexMatch.exec(tableJson)![1],
        "Second Row": regexMatch.exec(tableJson)![2],
        "Third Row": regexMatch.exec(tableJson)![3],
    }

    return <div>
        <h3>{"Player: " + prop.currentPlayer}</h3>
        <JsonToTable json={trueJson} />
    </div>
}

const TicTacToe = () => {
    const [gameMoves, setGameMoves] = React.useState<GameMoveProps[]>([]);
    const [newPosI, setNewPosI] = React.useState(-1);
    const [newPosJ, setNewPosJ] = React.useState(-1);

    React.useEffect(() => {
        getGameMoves().then(setGameMoves);
    }, []);

    const handleInputPosI = (e: any) => setNewPosI(parseInt(e.target.value));
    const handleInputPosJ = (e: any) => setNewPosJ(parseInt(e.target.value));
    const handleAddPositions = () => saveMove(newPosI, newPosJ);

    return <div>
        <TextField style={{margin: "20px"}} value={newPosI} type="number" onInput={handleInputPosI}></TextField>
        <TextField style={{margin: "20px"}} value={newPosJ} type="number" onInput={handleInputPosJ}></TextField>
        <Button style={{margin: "20px", marginTop: "28px"}} variant="contained" onClick={handleAddPositions}>Add</Button>
        <Button style={{backgroundColor: "#FF3333", margin: "20px", marginTop: "28px"}} variant="contained" onClick={clearMoves}>Clear</Button>

        {gameMoves.map((move, id) =>
            <GameMove key={id} currentPlayer={move.currentPlayer}
                      gameTableSerialized={move.gameTableSerialized}></GameMove>)
        }
    </div>
}

const getGameMoves = async () => {
    const result = await axios.get('http://localhost:8080/state');
    return result.data as GameMove[];
}

type GameMove = { currentPlayer: string, gameTableSerialized: string }

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
}

ReactDOM.render(
    <React.StrictMode>
        <TicTacToe></TicTacToe>
    </React.StrictMode>,
    document.getElementById('root')
);
