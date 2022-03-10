package com.example.demo;

import javax.persistence.*;

@Entity
public class GameMove {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false)
    private Long id;

    public String gameTableSerialized;
    public Player currentPlayer;

    public GameMove(String gameTable, Player currentlayer) {
        this.gameTableSerialized = gameTable;
        this.currentPlayer = currentlayer;
    }

    public GameMove() {}

    public Long getId() {
        return id;
    }
}
