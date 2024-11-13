import {
  Button,
  Card,
  CardContent,
  createTheme,
  FormControl,
  FormHelperText,
  Grid2,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  ThemeProvider,
} from "@mui/material";
import { useState } from "react";
import React from "react";

import "./App.css";

interface TaskProp {
  // submitTask: boolean;
  setSubmitTask: React.Dispatch<React.SetStateAction<boolean>>;

  importance: string;
  setImportance: React.Dispatch<React.SetStateAction<string>>;
  urgency: string;
  setUrgency: React.Dispatch<React.SetStateAction<string>>;

  mode: string;
  setMode: React.Dispatch<React.SetStateAction<string>>;
}

function Task({
  // submitTask,
  setSubmitTask,
  importance,
  setImportance,
  urgency,
  setUrgency,
  mode,
  setMode,
}: TaskProp) {
  const [selectError, setSelectError] = useState(false);

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

  const handleTaskSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    // Handling task submission.
    if (importance && urgency && mode) {
      setSelectError(false);
      setSubmitTask(false);
    } else {
      setSelectError(true);
    }
  };

  return (
    <>
      <Card variant="outlined" style={{ backgroundColor: " #F5EBFF " }}>
        <CardContent>
          <ThemeProvider theme={theme}>
            <form onSubmit={handleTaskSubmit}>
              <h2 style={{ fontSize: "40px" }}>Create a Task</h2>
              <Grid2 container>
                <Grid2 size={6}>
                  <h3>Task Name:</h3>
                </Grid2>
                <Grid2 size={6}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="component-outlined">
                      Task Name
                    </InputLabel>
                    <OutlinedInput
                      // sx={{ input: { color: "#F5EBFF" } }}
                      id="component-outlined"
                      placeholder="Task Name"
                      label="Task Name"
                      type="string"
                      // value={email}
                      // onChange={(event) => setEmail(event.target.value)}
                      required
                    ></OutlinedInput>
                    <FormHelperText>Enter the task's name</FormHelperText>
                  </FormControl>
                  {/* <br /> */}
                </Grid2>
                <Grid2 size={6}>
                  <h3>How important is it?</h3>
                </Grid2>
                <Grid2 size={6}>
                  <FormControl fullWidth>
                    <InputLabel>Importance</InputLabel>
                    <Select
                      style={{ width: "200px" }}
                      value={importance}
                      label="Importance" // Might need to change this later
                      onChange={(event) => setImportance(event.target.value)}
                    >
                      <MenuItem value={"important"}>Important</MenuItem>
                      <MenuItem value={"not-important"}>Not Important</MenuItem>
                    </Select>
                    <FormHelperText>Enter the task's importance</FormHelperText>
                  </FormControl>
                </Grid2>
                <Grid2 size={6}>
                  <h3> How urgent is it?</h3>
                </Grid2>
                <Grid2 size={6}>
                  <FormControl fullWidth>
                    <InputLabel>Urgency</InputLabel>
                    <Select
                      style={{ width: "200px" }}
                      value={urgency}
                      label="Urgency" // Might need to change this later
                      onChange={(event) => setUrgency(event.target.value)}
                    >
                      <MenuItem value={"urgent"}>Urgent</MenuItem>
                      <MenuItem value={"not-urgent"}>Not Urgent</MenuItem>
                    </Select>
                    <FormHelperText>Enter the task's urgency</FormHelperText>
                  </FormControl>
                </Grid2>

                <Grid2 size={6}>
                  <h3>What mode is this for?</h3>
                </Grid2>
                <Grid2 size={6}>
                  <FormControl fullWidth>
                    <InputLabel>Mode</InputLabel>
                    <Select
                      style={{ width: "200px" }}
                      value={mode}
                      label="Mode" // Might need to change this later
                      onChange={(event) => setMode(event.target.value)}
                    >
                      <MenuItem value={"work"}>Work</MenuItem>
                      <MenuItem value={"school"}>School</MenuItem>
                      <MenuItem value={"home"}>Home</MenuItem>
                    </Select>
                    <FormHelperText>Enter the task's mode</FormHelperText>
                  </FormControl>
                </Grid2>
              </Grid2>
              <p style={{ color: "red", marginTop: "10px" }}>
                {selectError == true
                  ? "Must Select a Level of Importance, Urgency, and Mode or Click Cancel"
                  : ""}
              </p>
              <br />
              <Button type="submit" variant="contained" color="primary">
                Create Task
              </Button>
              <br />
              <br />
              <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={() => {
                  setSubmitTask(false);
                  setImportance("");
                  setMode("");
                  setUrgency("");
                }}
              >
                Cancel
              </Button>
            </form>
          </ThemeProvider>
        </CardContent>
      </Card>
    </>
  );
}

export default Task;
