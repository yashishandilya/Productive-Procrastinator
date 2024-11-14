// import { createTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { TaskClass } from "./TaskClass";

import {
  Box,
  Button,
  Card,
  CardContent,
  createTheme,
  Grid2,
  Paper,
  ThemeProvider,
  Tooltip,
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

  // Task Creation/Setup
  const [createTask, setCreateTask] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [importance, setImportance] = useState("");
  const [urgency, setUrgency] = useState("");
  const [mode, setMode] = useState("");

  // Task Management | Keeping track of the current tasks
  // ^ This would be replaced by the db later on
  const [workTasks, setWorkTasks] = useState<TaskClass[]>([]);
  const [schoolTasks, setSchoolTasks] = useState<TaskClass[]>([]);
  const [homeTasks, setHomeTasks] = useState<TaskClass[]>([]);

  // Creates the created task and sorts it into its mode
  function createAndSortTasks() {
    const newTask = new TaskClass(
      taskName,
      importance,
      urgency,
      mode,
      workTasks.length + 1
    );
    console.log("Inside the createAndSortTasks() function.");
    console.log(newTask.taskName);
    console.log(newTask.importance);
    console.log(newTask.urgency);
    console.log(newTask.mode);

    // Put the task in one of the modes
    // Run task in the matrix for the respective mode
    if (mode == "work") {
      const updatedWorkTasks: TaskClass[] = workTasks;
      updatedWorkTasks.push(newTask);

      setWorkTasks(updatedWorkTasks);
      // runMatrix re-evaluates the tasks and sets the matrixOrder
      // property in each task, as shown in TaskClass
      runMatrix(updatedWorkTasks, "work");
    } else if (mode == "school") {
      const updatedSchoolTasks: TaskClass[] = schoolTasks;
      updatedSchoolTasks.push(newTask);

      setSchoolTasks(updatedSchoolTasks);

      runMatrix(updatedSchoolTasks, "school");
    } else if (mode == "home") {
      const updatedHomeTasks: TaskClass[] = homeTasks;
      updatedHomeTasks.push(newTask);

      setHomeTasks(updatedHomeTasks);

      runMatrix(updatedHomeTasks, "home");
    } else {
      console.log("Internal Client Error...");
    }
  }

  function runMatrix(tasks: TaskClass[], mode: string) {
    // Placeholder for the actual matrix implementation | Orders in reverse order
    const tasksToUpdate: TaskClass[] = tasks;
    tasksToUpdate.map((task) => {
      task.setMatrixOrder(tasksToUpdate.length - task.insertedOrder + 1);
    });
    if (mode == "work") {
      setWorkTasks(tasksToUpdate);
    } else if (mode == "school") {
      setSchoolTasks(tasksToUpdate);
    } else if (mode == "home") {
      setHomeTasks(tasksToUpdate);
    } else {
      console.log("Internal Client Error...");
    }
  }

  useEffect(() => {
    if (!createTask && taskName && importance && urgency && mode) {
      console.log(taskName);
      console.log(importance);
      console.log(urgency);
      console.log(mode);

      createAndSortTasks();
      setTaskName("");
      setImportance("");
      setUrgency("");
      setMode("");
    }
    // if (taskName && importance && urgency && mode) {
    //   console.log(taskName);
    //   console.log(importance);
    //   console.log(urgency);
    //   console.log(mode);

    //   createAndSortTasks();
    //   // Display to user
    //   // Add a tag to each task with the matrix order
    //   // ...
    // } // Else, do nothing.
  }, [createTask, taskName, importance, urgency, mode]);

  return (
    <>
      {createTask ? (
        <Task
          taskName={taskName}
          setTaskName={setTaskName}
          setSubmitTask={setCreateTask}
          importance={importance}
          setImportance={setImportance}
          urgency={urgency}
          setUrgency={setUrgency}
          mode={mode}
          setMode={setMode}
        />
      ) : (
        // () => {
        // createAndSortTasks();

        // return (
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
                <Grid2 size={4}>
                  <Card
                    variant="outlined"
                    style={{ backgroundColor: " #F5EBFF " }}
                  >
                    <CardContent>
                      {createTask == false && workTasks.length > 0 ? (
                        workTasks.map((task) => (
                          <Box>
                            <Paper
                              elevation={3}
                              sx={{
                                borderRadius: 1,
                                bgcolor: "primary.main",
                                "&:hover": {
                                  bgcolor: "primary.dark",
                                },
                              }}
                            >
                              {task.taskName} {task.importance} {task.urgency}{" "}
                              {"Recommended Order:"} {task.matrixOrder}
                            </Paper>
                            <br />
                          </Box>
                        ))
                      ) : (
                        <Paper
                          elevation={3}
                          sx={{
                            borderRadius: 1,
                            bgcolor: "primary.main",
                            "&:hover": {
                              bgcolor: "primary.dark",
                            },
                          }}
                        >
                          {"No tasks..."}
                        </Paper>
                      )}
                    </CardContent>
                  </Card>
                </Grid2>
                <Grid2 size={4}>
                  <Card
                    variant="outlined"
                    style={{ backgroundColor: " #F5EBFF " }}
                  >
                    <CardContent>
                      {createTask == false && schoolTasks.length > 0 ? (
                        schoolTasks.map((task) => (
                          <Box>
                            <Paper
                              elevation={3}
                              sx={{
                                borderRadius: 1,
                                bgcolor: "primary.main",
                                "&:hover": {
                                  bgcolor: "primary.dark",
                                },
                              }}
                            >
                              {task.taskName} {task.importance} {task.urgency}{" "}
                              {"Recommended Order:"} {task.matrixOrder}
                            </Paper>
                            <br />
                          </Box>
                        ))
                      ) : (
                        <Paper
                          elevation={3}
                          sx={{
                            borderRadius: 1,
                            bgcolor: "primary.main",
                            "&:hover": {
                              bgcolor: "primary.dark",
                            },
                          }}
                        >
                          {"No tasks..."}
                        </Paper>
                      )}
                    </CardContent>
                  </Card>
                </Grid2>
                <Grid2 size={4}>
                  <Card
                    variant="outlined"
                    style={{ backgroundColor: " #F5EBFF " }}
                  >
                    <CardContent>
                      {createTask == false && homeTasks.length > 0 ? (
                        homeTasks.map((task) => (
                          <Box>
                            <Paper
                              elevation={3}
                              sx={{
                                borderRadius: 1,
                                bgcolor: "primary.main",
                                "&:hover": {
                                  bgcolor: "primary.dark",
                                },
                              }}
                            >
                              {task.taskName} {task.importance} {task.urgency}{" "}
                              {"Recommended Order:"} {task.matrixOrder}
                            </Paper>
                            <br />
                          </Box>
                        ))
                      ) : (
                        <Paper
                          elevation={3}
                          sx={{
                            borderRadius: 1,
                            bgcolor: "primary.main",
                            "&:hover": {
                              bgcolor: "primary.dark",
                            },
                          }}
                        >
                          {"No tasks..."}
                        </Paper>
                      )}
                    </CardContent>
                  </Card>
                </Grid2>
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
        // );
        // }
      )}
    </>
  );
}
export default Profile;
