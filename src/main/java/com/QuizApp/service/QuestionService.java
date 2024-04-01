package com.QuizApp.service;

import com.QuizApp.model.Question;
import com.QuizApp.dao.QuestionDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@Service
public class QuestionService {
    @Autowired
    QuestionDAO questionDAO;
    public ResponseEntity<List<Question>> getAllQuestions() {
        try {
            return new ResponseEntity<>(questionDAO.findAll(), HttpStatus.OK);
        }catch (Exception e){
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>() , BAD_REQUEST);
    }

    public ResponseEntity<List<Question>> getQuestionsByCategory(String category) {
        try {
            return new ResponseEntity<>(questionDAO.findByCategory(category), HttpStatus.OK);
        }catch (Exception e){
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>() , BAD_REQUEST);
    }


    public ResponseEntity<String> addQuestion(Question question) {
        try {
            questionDAO.save(question);
            return new ResponseEntity<>("succes", HttpStatus.OK);
        }catch (Exception e){
            e.printStackTrace();
        }
        return new ResponseEntity<>("Failed", BAD_REQUEST);


    }

    public ResponseEntity<String> deleteQuestion(int questionId) {
        questionDAO.deleteById(questionId);
        return ResponseEntity.ok("Question deleted successfully");
    }
    public ResponseEntity<String> changeCorrectAnswer(int questionId, List<String> newCorrectAnswers) {
        Question question = questionDAO.findById(questionId).orElse(null);

        if (question != null) {
            question.setCorrectAnswer(newCorrectAnswers);
            questionDAO.save(question);
            return ResponseEntity.ok("Correct answer changed successfully");
        } else {
            return ResponseEntity.badRequest().body("Question not found");
        }
    }
}
