package com.example.demo;

import javax.persistence.*;
import javax.persistence.Entity;
import java.util.Arrays;
import java.util.Optional;

enum CellStatus {EMPTY, X, O}

enum Player {X, O}

class InvalidTicTacToeInput extends RuntimeException {
    InvalidTicTacToeInput(String msg) {
        super(msg);
    }
}

public class TicTacToeGame {

    CellStatus[][] gameTable = new CellStatus[3][3];
    Player currentPlayer; // X o O

    public TicTacToeGame() {
        for (int i = 0; i < 3; i++)                 // <-
            for (int j = 0; j < 3; j++)             // <- iterate over all the cells of the board
                gameTable[i][j] = CellStatus.EMPTY; // <- Set all cells empty

        currentPlayer = Player.X;                   // <- Set the initial player
    }

    public void makeMove(int i, int j) throws InvalidTicTacToeInput {
        if (i < 0 || i > 2 || j < 0 || j > 2) { // <- Check for out of bounds
            throw new InvalidTicTacToeInput("Out of Bounds");
        }
        if (gameTable[i][j] != CellStatus.EMPTY) { // <- check for already filled
            throw new InvalidTicTacToeInput("Position already used");
        }

        gameTable[i][j] = currentPlayer == Player.X ? CellStatus.X : CellStatus.O;
        currentPlayer = currentPlayer == Player.X ? Player.O : Player.X;
    }

    public void printBoard() {
        for (var row : gameTable) {
            for (var cell : row)
                System.out.print(cell == CellStatus.EMPTY ? "." : cell.toString());
            System.out.println();
        }
    }

    @Override
    public String toString() {
        var str = new StringBuilder();
        for (var row : gameTable) {
            for (var cell : row) {
                str.append(cell == CellStatus.EMPTY ? "." : cell.toString());
            }
            str.append("\n");
        }
        return str.toString();
    }

    static private boolean isWinning(CellStatus c0, CellStatus c1, CellStatus c2) {
        return c0 != CellStatus.EMPTY && c0 == c1 && c1 == c2;
    }

    static private Optional<Player> getWinner(CellStatus c) {
        return Optional.of(c == CellStatus.X ? Player.X : Player.O);
    }

    public Optional<Player> getTheWinner() {
        // Rows
        var g = this.gameTable;

        if (isWinning(g[0][0], g[0][1], g[0][2])) return getWinner(g[0][0]);
        if (isWinning(g[1][0], g[1][1], g[1][2])) return getWinner(g[1][0]);
        if (isWinning(g[2][0], g[2][1], g[2][2])) return getWinner(g[2][0]);

        // Columns
        if (isWinning(g[0][0], g[1][0], g[2][0])) return getWinner(g[0][0]);
        if (isWinning(g[0][1], g[1][1], g[2][1])) return getWinner(g[0][1]);
        if (isWinning(g[0][2], g[1][2], g[2][2])) return getWinner(g[0][2]);

        // Diagonals
        if (isWinning(g[0][0], g[1][1], g[2][2])) return getWinner(g[0][0]);
        if (isWinning(g[0][2], g[1][1], g[2][0])) return getWinner(g[0][2]);

        return Optional.empty();
    }

    public boolean isGameOver() {
        return Arrays.stream(gameTable).allMatch(r -> Arrays.stream(r).noneMatch(c -> c == CellStatus.EMPTY));
    }
}


