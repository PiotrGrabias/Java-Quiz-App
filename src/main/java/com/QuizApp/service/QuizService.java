package com.QuizApp.service;

import com.QuizApp.dao.QuestionDAO;
import com.QuizApp.dao.QuizDao;
import com.QuizApp.model.Question;
import com.QuizApp.model.QuestionWrapper;
import com.QuizApp.model.Quiz;
import com.QuizApp.model.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class QuizService {
    @Autowired
    QuizDao quizDao;
    @Autowired
    QuestionDAO questionDAO;
    public ResponseEntity<String> createQuiz(String category, int numQ, String title, int duration) {
        List<Question> questions = questionDAO.findRandomQuestionsByCategory(category, numQ);
        Quiz quiz = new Quiz();
        quiz.setTitle(title);
        quiz.setQuestions(questions);
        quiz.setNumQ(numQ);
        quiz.setDuration(duration);
        quizDao.save(quiz);
        return new ResponseEntity<>("success", HttpStatus.CREATED);
    }

    public ResponseEntity<List<QuestionWrapper>> getQuizQuestion(Integer id) {
        Optional<Quiz> quiz = quizDao.findById(id);
        List<Question> questionsFromDB = quiz.get().getQuestions();
        List<QuestionWrapper> questionForUser = new ArrayList<>();
        for(Question q : questionsFromDB){
            QuestionWrapper qw = new QuestionWrapper(q.getId(),q.getQuestionTitle(), q.getOption1(),q.getOption2(),q.getOption3(),q.getOption4(), q.getCorrectAnswer(), q.getImagePath());
            questionForUser.add(qw);
        }

        return new ResponseEntity<>(questionForUser, HttpStatus.OK);

    }

    public ResponseEntity<Integer> calculateQuizScore(Integer id, List<Response> responses) {
        Quiz quiz = quizDao.findById(id).get();
        List<Question> questions = quiz.getQuestions();
        int i = 0;
        int correct = 0;
        for(Response response: responses){
            if(response.getResponse().equals(questions.get(i).getCorrectAnswer())){
                correct += 1;
            }
            i+=1;
        }
        return new ResponseEntity<>(correct,HttpStatus.OK);
    }
    public HttpStatus deleteQuiz(Integer id) {
        Optional<Quiz> quizOptional = quizDao.findById(id);

        if (quizOptional.isPresent()) {
            Quiz quiz = quizOptional.get();
            quizDao.delete(quiz);
            return HttpStatus.OK;
        } else {
            return HttpStatus.NOT_FOUND;
        }
    }
    public ResponseEntity<List<Quiz>> getAllQuizzes() {
        List<Quiz> quizzes = quizDao.findAll();
        return ResponseEntity.ok(quizzes);
   }

    public Quiz getQuizById(Integer id) {
        Optional<Quiz> quizOptional = quizDao.findById(id);
        return quizOptional.orElse(null);
    }



}
