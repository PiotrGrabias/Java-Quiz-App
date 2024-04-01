package com.QuizApp.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private  String category;
    private  String questionTitle;
    private  String option1;
    private  String option2;
    private  String option3;
    private  String option4;
    @ElementCollection
    private List<String> correctAnswer;
    private  String difficultyLevel;
    private String imagePath;
}
