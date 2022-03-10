import React from 'react';
import ReactDOM from 'react-dom';
import {Button, TextField} from "@mui/material";
import axios from 'axios';

type GameMoveProps = {
    currentPlayer: string;
    gameTableSerialized: string;
}

const GameMove = (prop: GameMoveProps) => {
    return <div>
        <h3>{"Player: " + prop.currentPlayer}</h3>
        <h5>{"Game Table:\n" + prop.gameTableSerialized}</h5>
    </div>
}

const TicTacToe = () => {
    // const [newCurrentPlayer, setNewCurrentPlayer] = React.useState("");
    // const [newGameTableSerialized, setNewGameTableSerialized] = React.useState("");
    const [gameMoves, setGameMoves] = React.useState<GameMoveProps[]>([]);

    React.useEffect(() => {
        getGameMoves().then(setGameMoves);
    }, []);

    return <div>
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

ReactDOM.render(
    <React.StrictMode>
        <TicTacToe></TicTacToe>
    </React.StrictMode>,
    document.getElementById('root')
);
