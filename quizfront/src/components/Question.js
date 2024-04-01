import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import { Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@material-ui/core';
import Typography from '@mui/material/Typography';
import { Card, Col } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  timer: {
    position: 'fixed',
    alignItems: 'left',
    right: 0,
    top: '0px',
    background: 'rgba(255, 255, 255, 0.0)', // White with 70% opacity
    padding: '10px',
    textAlign: 'center',
    zIndex: 1000,
  },
}));

const Timer = ({ time, submitted }) => {
  const classes = useStyles();
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className={classes.timer}>
      {!submitted ? (
        <p style={{ fontSize: '20px' }}>Czas pozostały do końca testu: {formatTime(time)}</p>
      ) : null}
    </div>
  );
};

const Question = () => {
  const [username, setUserName] = useState('');
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [totalquestions, setTotalQuestions] = useState([]);
  const [questionChangeDisabled, setQuestionChangeDisabled] = useState(false);
  const [timer, setTimer] = useState();
  const [showResult, setShowResult] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const classes = useStyles();
  const [quizId, setQuizId] = useState(id);

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    if (timer === 0 && !submitted) {
      handleSubmit();
    }
  }, [timer, submitted]);

  useEffect(() => {
    fetch(`http://localhost:8080/Quiz/${id}`, { method: 'GET' })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setTimer(result.duration * 60);
      });
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:8080/Quiz/get/${id}`, { method: 'GET' })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setQuestions(result);
      });
  }, [id]);

  const handleAnswerClick = (questionId, selectedAnswer) => {
    if (!submitted) {
      setSelectedAnswers((prevAnswers) => {
        const updatedAnswers = { ...prevAnswers };
        if (!updatedAnswers[questionId]) {
          updatedAnswers[questionId] = [];
        }

        const answerIndex = updatedAnswers[questionId].indexOf(selectedAnswer);
        if (answerIndex !== -1) {
          updatedAnswers[questionId].splice(answerIndex, 1);
        } else {
          updatedAnswers[questionId].push(selectedAnswer);
        }

        return updatedAnswers;
      });
    }
  };

  const getAnswerStyle = (questionId, option) => {
    const selectedAnswersList = selectedAnswers[questionId] || [];

    if (submitted) {
      const correctAnswersList = questions.find((q) => q.id === questionId)?.correctAnswer || [];
      const isCorrect = correctAnswersList.includes(option);
      const isSelected = selectedAnswersList.includes(option);

      if (isSelected && isCorrect) {
        return 'selected-answer-correct';
      } else if (isSelected && !isCorrect) {
        return 'selected-answer-incorrect';
      } else {
        return 'unselected-answer';
      }
    } else {
      return selectedAnswersList.includes(option) ? 'selected-answer' : 'unselected-answer';
    }
  };

  const handleSubmit = async () => {
    const totalQuestions = questions.length;
    let newScore = 0;
    questions.forEach((question) => {
      const selectedAnswersList = selectedAnswers[question.id] || [];
      const correctAnswersList = question.correctAnswer || [];

      const isCorrect =
        selectedAnswersList.length === correctAnswersList.length &&
        selectedAnswersList.every((answer) => correctAnswersList.includes(answer));

      if (isCorrect) {
        newScore = newScore + 1;
        console.log(`Question ${question.id} is correct!`);
      } else {
        console.log(`Question ${question.id} is incorrect!`);
      }
    });

    setScore(newScore);
    setSubmitted(true);
    setQuestionChangeDisabled(true);

    const percentage = (newScore / totalQuestions) * 100;
    setResultMessage(`Twój wynik: ${newScore}/${totalQuestions} (${percentage.toFixed(2)}%)`);
    const passThreshold = 50;
    const passed = percentage >= passThreshold;

    if (passed) {
      setResultMessage(`Twój wynik: ${newScore}/${totalQuestions} (${percentage.toFixed(2)}%) Zaliczone! ${resultMessage}`);
      console.log('Student passed!');
    } else {
      setResultMessage(`Twój wynik: ${newScore}/${totalQuestions} (${percentage.toFixed(2)}%) Niezaliczone! ${resultMessage} Musisz zdobyć przynajmniej 50%`);
      console.log('Student failed.');
    }

    const queryString = `http://localhost:8080/api/test-results/submit?result=${newScore}&name=${encodeURIComponent(username)}&passed=${passed}&quizId=${quizId}`;

    try {
      const response = await fetch(queryString, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          result: newScore,
          name: username,
          passed: passed,
          quizId: quizId,
        }),
      });
      if (response.ok) {
        console.log('POST request successful');
      } else {
        console.error('Failed to send POST request:', response.statusText);
      }
    } catch (error) {
      console.error('Error during POST request:', error);
    }

    setShowResult(true);
  };

  return (
    <div className='quiz-container'>
      {!submitted && (
        <form style={{ marginLeft: '20px' }}>
          <TextField
            label="Imie i nazwisko"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          />
        </form>
      )}

      <Timer time={timer} submitted={submitted} />
      {questions.map((question) => (
        <Container key={question.id}>
          {(!questionChangeDisabled || submitted) && (
            <form>
              <Typography>
                <li style={{ fontSize: '25px' }}>{question.questionTitle}</li>
              </Typography>
              <Col className='pytanka'>
                <Card>
                  <div className='klasa'>
                    {question.imagePath ? (
                      <p>
                        <img src={`http://localhost:8080${question.imagePath}`} alt="Quiz Image" />
                      </p>
                    ) : null}
                    <span>
                      <input
                        type="checkbox"
                        className={getAnswerStyle(question.id, '1')}
                        onChange={() => handleAnswerClick(question.id, '1')}
                        checked={selectedAnswers[question.id]?.includes('1') || false}
                        disabled={submitted}
                      />
                      {question.option1}
                    </span>
                  </div>
                  <div className='klasa'>
                    <span>
                      <input
                        type="checkbox"
                        className={getAnswerStyle(question.id, '2')}
                        onChange={() => handleAnswerClick(question.id, '2')}
                        checked={selectedAnswers[question.id]?.includes('2') || false}
                        disabled={submitted}
                      />
                      {question.option2}
                    </span>
                  </div>
                  <div className='klasa'>
                    <span>
                      <input
                        type="checkbox"
                        className={getAnswerStyle(question.id, '3')}
                        onChange={() => handleAnswerClick(question.id, '3')}
                        checked={selectedAnswers[question.id]?.includes('3') || false}
                        disabled={submitted}
                      />
                      {question.option3}
                    </span>
                  </div>
                  <div className='klasa'>
                    <span>
                      <input
                        type="checkbox"
                        className={getAnswerStyle(question.id, '4')}
                        onChange={() => handleAnswerClick(question.id, '4')}
                        checked={selectedAnswers[question.id]?.includes('4') || false}
                        disabled={submitted}
                      />
                      {question.option4}
                    </span>
                  </div>
                </Card>
              </Col>
            </form>
          )}
        </Container>
      ))}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        onClick={handleSubmit}
        disabled={questionChangeDisabled}
      >
        Zatwierdź
      </Button>
      <p>Uwaga: jeśli naciśniesz przycisk zatwierdź, nie będziesz mieć możliwości edycji odpowiedzi.</p>

      {showResult && (
        <Dialog open={showResult} onClose={() => setShowResult(false)}>
          <DialogTitle>Wynik testu</DialogTitle>
          <DialogContent>
            <DialogContentText>{resultMessage}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowResult(false)} color="primary">
              Zamknij
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default Question;
