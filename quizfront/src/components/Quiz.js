import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Paper, Grid } from '@material-ui/core';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

export default function Quiz() {
  const paperStyle = { padding: '50px 20px', width: 600, margin: '20px auto' };
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const classes = useStyles();
  const navigate = useNavigate();
  useEffect(() => {
    fetch("http://localhost:8080/Quiz/all", { method: 'GET' })
      .then(res => res.json())
      .then((result) => {
        setQuizzes(result);
      });
  }, []);

 

  const handleQuizClick = (quiz) => {
    navigate(`/quiz/${quiz.id}`)
    setSelectedQuiz(quiz);
  };
  
  return (
    <Container>
      <h1>Testy Java</h1>
      <Paper elevation={3} style={paperStyle}>
        {quizzes.map((quiz) => (
          <Grid container spacing={2} key={quiz.id}>
            <Grid item xs={8}>
              <Paper elevation={6} style={{ padding: '15px', textAlign: 'left' }}>
                Nazwa: {quiz.title}<br />
                Limit czasu: {quiz.duration}, 
                Pytania: {quiz.numQ}
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Button
                onClick={() => handleQuizClick(quiz)}
                type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              >
                Rozwiąż
              </Button>
              
            </Grid>
          </Grid>
        ))}
      </Paper>
    </Container>
  );
}