// import { createTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";

import {
  Button,
  Card,
  CardContent,
  createTheme,
  Grid2,
  ThemeProvider,
} from "@mui/material";

import "./App.css";
import Points from "./Points";
import Task from "./Task";

function Profile() {
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

  // 3 modes to follow for the point system
  // 1. Eisenhower Matrix | Gives points based on how the ai ordered your tasks.
  // 2. Difficulty multipliers |
  // 3. Streak Bonuses | Awards additional based on a SERIES of previous tasks
  // Note: Wouldn't 1 and 3 be additional points and 2 be the base points?

  // Updated and shown to the user
  const [totalPoints, setTotalPoints] = useState(0);

  // Difficulty multiplier

  // Used for STREAK bonuses | They're applied only after the first task such that there is a series of tasks
  const [prevDiff, setPrevDiff] = useState(0);
  const [curDiff, setCurDiff] = useState(0);

  // 0 -> easy
  // 1 -> medium
  // 2 -> hard

  const [createTask, setCreateTask] = useState(false);
  const [importance, setImportance] = useState("");
  const [urgency, setUrgency] = useState("");
  const [mode, setMode] = useState("");

  useEffect(() => {
    if (importance && urgency && mode) {
      // Put the task in one of the modes
      // Run task in eisenhower matrix for the respective mode
      // Add a tag to each task with the eisenhower matrix order
      // Display to user
      // ...
    } // Else, do nothing.
  }, [importance, urgency, mode]);

  return (
    <>
      {createTask ? (
        <Task
          // submitTask={createTask}
          setSubmitTask={setCreateTask}
          importance={importance}
          setImportance={setImportance}
          urgency={urgency}
          setUrgency={setUrgency}
          mode={mode}
          setMode={setMode}
        />
      ) : (
        <Card variant="outlined" style={{ backgroundColor: " #F5EBFF " }}>
          <CardContent>
            <h2>Your Points</h2>
            <ThemeProvider theme={theme}>
              <Grid2 container spacing={2}>
                <Grid2 size={6}>
                  {/* <Points points={totalPoints} setPoints={setTotalPoints} /> */}
                  <p>Points</p>
                </Grid2>
                <Grid2 size={6}>
                  {/* <Streaks /> */}
                  <p>Streaks</p>
                </Grid2>
                <Grid2 size={4}>Work</Grid2>
                <Grid2 size={4}>School</Grid2>
                <Grid2 size={4}>Home</Grid2>
                <br />
                <Grid2 size={12}>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "#FF5733" }}
                    onClick={() => setCreateTask(true)}
                  >
                    Create Task
                  </Button>
                </Grid2>
              </Grid2>
            </ThemeProvider>
          </CardContent>
        </Card>
      )}
    </>
  );
}
export default Profile;
