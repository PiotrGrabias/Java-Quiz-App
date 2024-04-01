package com.QuizApp.controller;

import com.QuizApp.model.Quiz;
import com.QuizApp.model.TestResult;
import com.QuizApp.dao.QuizDao;
import com.QuizApp.dao.TestResultDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/test-results")
public class TestResultController {

    @Autowired
    QuizDao quizDao;
    @Autowired
    TestResultDao testResultDao;

    @Autowired
    public TestResultController(TestResultDao testResultDao) {
        this.testResultDao = testResultDao;
    }
    @GetMapping("/all")
    public List<TestResult> getAllTestResults() {
        return testResultDao.findAll();
    }
    @PostMapping("/submit")
    public String submitTestResult(
            @RequestBody TestResult testResult,
            @RequestParam Integer quizId
    ) {
        Optional<Quiz> quizOptional = quizDao.findById(quizId);

        if (quizOptional.isPresent()) {
            Quiz quiz = quizOptional.get();
            testResult.setQuizId(quizId);
            testResult.setQuizName(quiz.getTitle());
            testResult.setNumber(quiz.getNumQ());
        } else {
            return "Error: Quiz with ID " + quizId + " not found.";
        }

        testResultDao.save(testResult);

        System.out.println("Received test result: " + testResult.getResult() +
                ", Name: " + testResult.getName() +
                ", Quiz ID: " + quizId +
                ", Quiz Name: " + testResult.getQuizName()) ;


        return "Test result submitted successfully!";
    }
}