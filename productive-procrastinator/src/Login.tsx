import { useState } from "react";
import "./App.css";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  ThemeProvider,
  Button,
  CardContent,
  Card,
  Link,
  Typography,
  CircularProgress,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { loginWithEmail, signUpWithEmail } from './firebase';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const theme = createTheme({
    palette: {
      primary: {
        main: "#FF5733",
      },
      secondary: {
        main: "#F5EBFF",
        contrastText: "#47008F",
      },
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      console.log("Attempting auth with:", email);
      const authResult = isSignUp 
        ? await signUpWithEmail(email, password)
        : await loginWithEmail(email, password);

      if (authResult.error) {
        throw authResult.error;
      }

      console.log("Auth successful:", authResult.user?.email);
      // No need to manually navigate - App.tsx will handle the state change
    } catch (error: any) {
      console.error("Auth error:", error.code, error.message);
      switch (error.code) {
        case 'auth/email-already-in-use':
          setErrorMessage('Email already registered. Please login instead.');
          break;
        case 'auth/user-not-found':
          setErrorMessage('No account found with this email.');
          break;
        case 'auth/wrong-password':
          setErrorMessage('Invalid password.');
          break;
        case 'auth/invalid-email':
          setErrorMessage('Please enter a valid email address.');
          break;
        case 'auth/too-many-requests':
          setErrorMessage('Too many attempts. Please try again later');
          break;
        default:
          setErrorMessage('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card variant="outlined" style={{ backgroundColor: "#F5EBFF" }}>
      <CardContent>
        <h2>Login/Signup</h2>
        <ThemeProvider theme={theme}>
          <form onSubmit={handleSubmit}>
            <FormControl>
              <InputLabel htmlFor="email">Email</InputLabel>
              <OutlinedInput
                id="email"
                placeholder="email@example.com"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <FormHelperText>Enter your email</FormHelperText>
            </FormControl>
            <br />
            <br />
            <FormControl>
              <InputLabel htmlFor="password">Password</InputLabel>
              <OutlinedInput
                id="password"
                placeholder="••••••"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <FormHelperText>Enter your password</FormHelperText>
              <br />
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={isLoading}
                style={{
                  backgroundColor: "#FF5733",
                  width: '100%',
                  padding: '10px'
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'SUBMIT'
                )}
              </Button>
              {errorMessage && (
                <Typography 
                  color="error" 
                  style={{ 
                    marginTop: '10px', 
                    textAlign: 'center',
                    color: 'red' 
                  }}
                >
                  {errorMessage}
                </Typography>
              )}
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrorMessage("");
                }}
                style={{
                  marginTop: '10px',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              >
                {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
              </Link>
            </FormControl>
          </form>
        </ThemeProvider>
      </CardContent>
    </Card>
  );
}

export default Login;