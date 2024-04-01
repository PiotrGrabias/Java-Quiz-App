import * as React from 'react';
import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CreateQuiz from './Create';
import Alert from '@mui/material/Alert';

const defaultTheme = createTheme();

export default function SignIn() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isRight, setIsRight] = useState(false);

  useEffect(() => {
    const storedLoggedInState = sessionStorage.getItem('isLoggedIn');

    if (storedLoggedInState === 'true') {
      setLoggedIn(true);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch('http://localhost:8080/Quiz/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formData).toString(),
      });

      if (response.ok) {
        setIsRight(false);
        setLoggedIn(true);
        sessionStorage.setItem('isLoggedIn', 'true'); // Use sessionStorage instead of localStorage
        console.log('Login successful');
      } else {
        setIsRight(true);
        console.error('Login failed');
      }
    } catch (error) {
      console.error('An error occurred during login:', error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        {isLoggedIn ? (
          <CreateQuiz isLoggedIn={isLoggedIn} />
        ) : (
          <div>
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography component="h1" variant="h5">
                Zaloguj się
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Nazwa użytkownika"
                  name="username"
                  autoComplete="username"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Hasło"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Zaloguj się
                </Button>
                {isRight === true && (
                  <Alert variant="outlined" severity="warning">
                    Błędne hasło lub login
                  </Alert>
                )}
              </Box>
            </Box>
          </div>
        )}
      </Container>
    </ThemeProvider>
  );
}
