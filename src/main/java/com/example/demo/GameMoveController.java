package com.example.demo;

import com.google.gson.Gson;
import org.springframework.web.bind.annotation.*;

@RestController
public class GameMoveController {

    private final GameMoveRepository gameMoveRepository;
    private TicTacToeGame game = new TicTacToeGame();
    private boolean winnerPresent = false;

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
        String winner = "None";

        if (game.getTheWinner().isPresent()) {
            return new GameMove(serializeToString(game.gameTable), game.currentPlayer, "" + game.getTheWinner().get());
        }

        game.makeMove(i, j);
        if (game.getTheWinner().isPresent()) {
            winnerPresent = true;
            return gameMoveRepository.save(new GameMove(serializeToString(game.gameTable), game.currentPlayer, "" + game.getTheWinner().get()));
        } else
            return gameMoveRepository.save(new GameMove(serializeToString(game.gameTable), game.currentPlayer, winner));
    }

    @GetMapping("/end")
    public String matchIsEnded() {
        return "a";
    }

    @DeleteMapping("/deleteStates")
    public void deleteAll() {
        game = new TicTacToeGame();
        gameMoveRepository.deleteAll();
    }

}
