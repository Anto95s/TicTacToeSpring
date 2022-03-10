package com.example.demo;

import javax.persistence.*;

@Entity
public class GameMove {
    public String gameTableSerialized;
    public Player currentPlayer;
    public String winner;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false)
    private Long id;

    public GameMove(String gameTable, Player currentlayer, String winner) {
        this.gameTableSerialized = gameTable;
        this.currentPlayer = currentlayer;
        this.winner = winner;
    }

    public GameMove() {
    }

    public Long getId() {
        return id;
    }
}
