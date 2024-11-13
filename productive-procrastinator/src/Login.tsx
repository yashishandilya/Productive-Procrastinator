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
} from "@mui/material";

import { createTheme } from "@mui/material/styles";
// import { FormControl, FormHelperText, FormLabel, Input } from "@mui/joy";

interface SetLoginStateProp {
  setLoginState: React.Dispatch<React.SetStateAction<boolean>>;
}

function Login({ setLoginState }: SetLoginStateProp) {
  // Note: prepare an existing login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);

  const theme = createTheme({
    palette: {
      primary: {
        main: "#FF5733",
      },
      secondary: {
        main: "#F5EBFF", // Also the color of text...
        contrastText: "#47008F",
      },
    },
  });

  // Placeholder
  const handleAuth = () => {
    console.log("Auth coming soon");

    // Placeholder, use the if below in handleAuth later

    if (email !== "484@gmail.com" || password !== "484isok") {
      setLoginState(true);
      setErrorMessage(true);
      console.log("Invalid");
    } else {
      setLoginState(false);
      setErrorMessage(false);
      console.log("Valid");
      // Go to next page
    }

    // Use this after handleAuth is implemented
    // if (authSuccess){
    // }
    // else {
    //  // Displays invalid text
    // }
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    console.log(email);
    console.log(password);
    handleAuth();
  };

  return (
    <>
      <Card variant="outlined" style={{ backgroundColor: " #F5EBFF " }}>
        <CardContent>
          <h2>Login/Signup</h2>
          <ThemeProvider theme={theme}>
            <form
              onSubmit={handleSubmit}
              // onClick={(event) => event?.preventDefault()}
            >
              <FormControl>
                <InputLabel htmlFor="component-outlined">Email</InputLabel>
                <OutlinedInput
                  // sx={{ input: { color: "#F5EBFF" } }}
                  id="component-outlined"
                  placeholder="484@gmail.com"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                ></OutlinedInput>
                <FormHelperText>Enter your email</FormHelperText>
              </FormControl>
              <br />
              <br />
              <FormControl>
                <InputLabel htmlFor="component-outlined">Password</InputLabel>
                <OutlinedInput
                  // sx={{ input: { color: "#F5EBFF" } }}
                  id="component-outlined"
                  placeholder="484isok"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                ></OutlinedInput>
                <FormHelperText>Enter your password</FormHelperText>
                <br />
                <br />
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
                <p style={{ color: "red", marginTop: "10px" }}>
                  {errorMessage == true ? "Invalid Email or Password" : ""}
                </p>
              </FormControl>
            </form>
          </ThemeProvider>
        </CardContent>
      </Card>
    </>
  );
}

export default Login;
