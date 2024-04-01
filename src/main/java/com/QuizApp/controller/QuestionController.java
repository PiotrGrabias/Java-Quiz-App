package com.QuizApp.controller;


import com.QuizApp.model.Question;
import com.QuizApp.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("Question")
public class QuestionController {
    @Autowired
    QuestionService questionService;
    @GetMapping("allQuestions")
    public ResponseEntity<List<Question>> getAllQuestion(){
        return questionService.getAllQuestions();
    }

    @GetMapping("category/{category}")
    public ResponseEntity<List<Question>> getQuestionByCategory(@PathVariable String category){
        return questionService.getQuestionsByCategory(category);
    }

    @PostMapping("add")
    public ResponseEntity<String> addQuestion(@RequestBody Question question){
        return questionService.addQuestion(question);

    }
    @DeleteMapping("delete/{questionId}")
    public ResponseEntity<String> deleteQuestion(@PathVariable int questionId) {
        return questionService.deleteQuestion(questionId);
    }
    @PutMapping("edit/{questionId}")
    public ResponseEntity<String> changeCorrectAnswer(
            @PathVariable int questionId,
            @RequestBody List<String> newCorrectAnswers) {
        return questionService.changeCorrectAnswer(questionId, newCorrectAnswers);
    }
}
