package com.example.demo;

import com.google.gson.Gson;
import org.springframework.web.bind.annotation.*;

@RestController
public class GameMoveController {

    private final GameMoveRepository gameMoveRepository;
    private TicTacToeGame game = new TicTacToeGame();

    public GameMoveController(GameMoveRepository gameMoveRepository) {
        this.gameMoveRepository = gameMoveRepository;
    }

    public String serializeToString(CellStatus[][] gameTable) {
        Gson gson = new Gson();
        return gson.toJson(gameTable);
    }

    @GetMapping("/state")
    public Iterable<GameMove> getAllStates() {
        return gameMoveRepository.findAll();
    }

    @PostMapping("/move")
    public GameMove play(@RequestParam("posI") int i, @RequestParam("posJ") int j) {
        String winner = "There's no winner yet!";

        if (game.getTheWinner().isPresent()) {
            winner = "The winner is " + game.getTheWinner().get() + ", clear the table to start a new game!";
            GameMove fakeMove = new GameMove(serializeToString(game.gameTable), game.currentPlayer, winner);
            return gameMoveRepository.save(fakeMove);
        }

        game.makeMove(i, j);
        GameMove trueMove = new GameMove(serializeToString(game.gameTable), game.currentPlayer, winner);
        return gameMoveRepository.save(trueMove);
    }

    @DeleteMapping("/deleteStates")
    public void deleteAll() {
        game = new TicTacToeGame();
        gameMoveRepository.deleteAll();
    }

}
