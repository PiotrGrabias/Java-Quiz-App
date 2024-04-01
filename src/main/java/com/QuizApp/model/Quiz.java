package com.QuizApp.model;

import lombok.Data;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Data
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String title;
    private Integer numQ;
    private Integer duration;
    @ManyToMany
    private List<Question> questions;
}
