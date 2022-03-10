package com.example.demo;

import org.springframework.web.bind.annotation.*;
import com.google.gson.Gson;

@RestController
public class GameMoveController {

    public String serializeToString(CellStatus[][] gameTable) {
        Gson gson = new Gson();
        return gson.toJson(gameTable);
    }

    private final GameMoveRepository gameMoveRepository;
    private TicTacToeGame game = new TicTacToeGame();

    public GameMoveController(GameMoveRepository gameMoveRepository) {
        this.gameMoveRepository = gameMoveRepository;
    }

    @GetMapping("/state")
    public Iterable<GameMove> getAllStates() {
        return gameMoveRepository.findAll();
    }

    @PostMapping("/move")
    public GameMove play(@RequestParam("posI") int i, @RequestParam("posJ") int j) {
        game.makeMove(i, j);
        GameMove move = new GameMove(serializeToString(game.gameTable), game.currentPlayer);
        return gameMoveRepository.save(move);
    }

    @DeleteMapping("/deleteStates")
    public void deleteAll() {
        game = new TicTacToeGame();
        gameMoveRepository.deleteAll();
    }

}
