package com.QuizApp.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class TestResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer number;
    private int result;
    private String name;
    private boolean passed;
    @ManyToOne
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

    @Column(name = "quiz_name")
    private String quizName;

    @Column(name = "quiz_id", insertable = false, updatable = false)
    private Integer quizId;

    public TestResult() {
    }

    public TestResult(int result, String name, boolean passed, Quiz quiz) {
        this.result = result;
        this.name = name;
        this.passed = passed;
        this.quiz = quiz;
    }
    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getResult() {
        return result;
    }

    public void setResult(int result) {
        this.result = result;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    public boolean isPassed() {
        return passed;
    }

    public void setPassed(boolean passed) {
        this.passed = passed;
    }
    public void setQuizId(Integer quizId) {
        this.quizId = quizId;
    }

    public void setQuizName(String quizName) {
        this.quizName = quizName;
    }

}
