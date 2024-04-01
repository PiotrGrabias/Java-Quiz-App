import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme();

const CreateQuiz = ({isLoggedIn}) => {
  const [formData, setFormData] = useState({
    category: '',
    numQ: '',
    title: '',
    duration: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const queryParams = new URLSearchParams({
      category: formData.category,
      numQ: formData.numQ,
      title: formData.title,
      duration: formData.duration,
    });
  
    try {
      const response = await fetch(`http://localhost:8080/Quiz/create?${queryParams}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
  
      if (response.ok) {
        console.log('Quiz created successfully');
        setFormData({
            category: '',
            numQ: '',
            title: '',
            duration: '',
          });
      } else {
        console.error('Quiz creation failed');
      }
    } catch (error) {
      console.error('An error occurred during quiz creation:', error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
      {isLoggedIn ? (
        <div>
        <Typography component="h1" variant="h5">
       
          Dodaj Test
        </Typography>
        <form onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="category"
            label="Kategoria pytań"
            name="category"
            value={formData.category}
            onChange={handleChange}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="numQ"
            label="Ilość pytań"
            name="numQ"
            value={formData.numQ}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Tytuł"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="duration"
            label="Czas"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Dodaj quiz
          </Button>
        </form>
        </div>
        ) : (
            <div>
                 <Typography component="h1" variant="h5">  
       Musisz być zalogowany jako admin aby tworzyć quizy
     </Typography>
            </div>

        )}
      </Container>
    </ThemeProvider>
  );
};

export default CreateQuiz;
