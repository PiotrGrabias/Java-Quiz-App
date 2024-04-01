package com.QuizApp.controller;

import com.QuizApp.model.QuestionWrapper;
import com.QuizApp.model.Quiz;
import com.QuizApp.model.Response;
import com.QuizApp.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("Quiz")
public class QuizController{
    @Autowired
    QuizService quizService;

    private static final String ADMIN_USERNAME = "admin";
    private static final String ADMIN_PASSWORD = "admin";
    @PostMapping("login")
    public ResponseEntity<String> login(@RequestParam String username, @RequestParam String password) {
        if (ADMIN_USERNAME.equals(username) && ADMIN_PASSWORD.equals(password)) {
            return new ResponseEntity<>("Login successful", new HttpHeaders(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Invalid credentials", new HttpHeaders(), HttpStatus.UNAUTHORIZED);
        }
    }
    @PostMapping("create")
    public ResponseEntity<String> createQuiz(@RequestParam String category, @RequestParam int numQ, @RequestParam String title, @RequestParam int duration){
        return quizService.createQuiz(category, numQ, title, duration);
    }
   @GetMapping("all")
    public ResponseEntity<List<Quiz>> getAllQuizzes() {
    return quizService.getAllQuizzes();
    }

    @GetMapping("get/{id}")
    public ResponseEntity<List<QuestionWrapper>> getQuizQuestions(@PathVariable Integer id){
        return quizService.getQuizQuestion(id);
    }
    @DeleteMapping("delete/{id}")
    public ResponseEntity<String> deleteQuiz(@PathVariable Integer id) {
        HttpStatus status = quizService.deleteQuiz(id);
        return new ResponseEntity<>("Quiz deleted successfully", new HttpHeaders(), status);
    }
    @PostMapping("submit/{id}")
    public ResponseEntity<Integer> submitQuiz(@PathVariable Integer id, @RequestBody List<Response> responses){
        return  quizService.calculateQuizScore(id, responses);
    }
    @GetMapping("{id}")
    public ResponseEntity<Quiz> getQuizById(@PathVariable Integer id) {
        Quiz quiz = quizService.getQuizById(id);

        if (quiz != null) {
            return new ResponseEntity<>(quiz, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}