// import { createTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { TaskClass } from "./TaskClass";

import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  createTheme,
  FormControlLabel,
  FormGroup,
  Grid2,
  Paper,
  ThemeProvider,
} from "@mui/material";

import "./App.css";
import Points from "./Points";
import Task from "./Task";

function Profile() {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#FF5733", // Orange
      },
      secondary: {
        main: "#F5EBFF", // Lavender White
        contrastText: "#47008F",
      },
    },
  });

  // Task Creation/Setup
  const [createTask, setCreateTask] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [importance, setImportance] = useState("");
  const [urgency, setUrgency] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [mode, setMode] = useState("");

  // Task Management | Keeping track of the current tasks
  // ^ This would be replaced by the db later on
  const [workTasks, setWorkTasks] = useState<TaskClass[]>([]);
  const [schoolTasks, setSchoolTasks] = useState<TaskClass[]>([]);
  const [homeTasks, setHomeTasks] = useState<TaskClass[]>([]);

  // 3 modes to follow for the point system
  // 1. Eisenhower Matrix | Gives points based on how the ai ordered your tasks.
  // 2. Difficulty multipliers |
  // 3. Streak Bonuses | Awards additional based on a SERIES of previous tasks
  // Note: Wouldn't 1 and 3 be additional points and 2 be the base points?

  const [totalPoints, setTotalPoints] = useState(0);
  const [prevDiff, setPrevDiff] = useState("");
  const [streak, setStreak] = useState(0);
  const [curDiff, setCurDiff] = useState("");

  const handleTaskCompletion = (
    task: TaskClass,
    event: { preventDefault: () => void }
  ) => {
    event.preventDefault();
    // console.log(task.taskName);
    // console.log(task.importance);
    // console.log(task.urgency);
    // console.log(task.insertedOrder);
    // console.log(task.matrixOrder);
    // console.log(task.mode);

    // 1. Assign the points
    // 1a. Assign the base points wrt matrix quadrants
    // Assign base points based on where the importance
    // and urgency of the task on the matrix
    // 1b. Assign points based on task streaks
    // Keep track of the difficulty of the current task in
    // relation to the matrix quadrants, then assign points
    // based on that while keeping track of the 'streak' (when the user has already completed a previous task).
    // 1c. Assign points based on difficulty multiplier points
    // Assign points if the new task is even HARDER than the one
    // recommended on the matrix
    const basePoints = assignBasePoints(task);
    const streakPoints = assignStreakPoints(task) * basePoints;
    const diffMultPoints = assignDiffMultiPoints(task) * basePoints;
    const curPoints = basePoints + streakPoints + diffMultPoints;
    setTotalPoints(curPoints);

    // 2. Remove THIS task from the list of tasks in correlation to the mode
    // let updateTasks
    if (mode == "work") {
      const updateTasks: TaskClass[] = workTasks;
      let i = 0;
      for (i = 0; i < updateTasks.length; i++) {
        if (task.insertedOrder == updateTasks[i].insertedOrder) {
          break;
        }
      }
      if (i > 0) {
        updateTasks.splice(i, 1);
      }
      setWorkTasks(updateTasks);
    } else if (mode == "school") {
      const updateTasks: TaskClass[] = schoolTasks;
      let i = 0;
      for (i = 0; i < updateTasks.length; i++) {
        if (task.insertedOrder == updateTasks[i].insertedOrder) {
          break;
        }
      }
      if (i > 0) {
        updateTasks.splice(i, 1);
      }
      setSchoolTasks(updateTasks);
    } else if (mode == "home") {
      const updateTasks: TaskClass[] = homeTasks;
      let i = 0;
      for (i = 0; i < updateTasks.length; i++) {
        if (task.insertedOrder == updateTasks[i].insertedOrder) {
          break;
        }
      }
      if (i > 0) {
        updateTasks.splice(i, 1);
      }
      setHomeTasks(updateTasks);
    } else {
      console.log("Internal Client Error...");
    }

    // 3. Update the list of tasks that are displayed ?????????
  };

  // // Assigns all points
  // function assignPoints(task: TaskClass) {
  //   console.log(task.taskName);
  // }

  // Assign the base points wrt matrix quadrants
  function assignBasePoints(task: TaskClass) {
    if (task.urgency == "urgent" && task.importance == "important") {
      return 40;
    } else if (task.urgency == "not-urgent" && task.importance == "important") {
      return 30;
    } else if (task.urgency == "urgent" && task.importance == "not-important") {
      return 20;
    } else {
      return 10;
    }
  }

  // Assign points based on task streaks
  function assignStreakPoints(task: TaskClass) {
    if (streak >= 2.5) {
      // Returns the streak multiplier
      //This needs to be multiplied with the base points in the previous function
      return streak;
    }

    if (
      (prevDiff == "medium" && task.difficulty == "easy") ||
      (prevDiff == "hard" &&
        (task.difficulty == "medium" || task.difficulty == "easy"))
    ) {
      setStreak(0.0);
      return streak; // No steak bonus
    } else if (prevDiff == task.difficulty) {
      if (streak + 0.1 > 2.5) {
        setStreak(2.5);
        return streak;
      } else {
        setStreak(streak + 0.1);
        return streak;
      }
    } else if (
      (prevDiff == "easy" &&
        (task.difficulty == "medium" || task.difficulty == "hard")) ||
      (prevDiff == "medium" && task.difficulty == "hard")
    ) {
      if (streak + 0.25 > 2.5) {
        setStreak(2.5);
        return streak;
      } else {
        setStreak(streak + 0.25);
        return streak;
      }
    } else {
      console.log("Invalid assignStreakPoints state...");
      return 1;
    }
    // return 1;
  }

  // Assign points based on difficulty multiplier points
  function assignDiffMultiPoints(task: TaskClass) {
    // Returns the multiplier to multiply with the base
    // points in the previous function
    if (task.difficulty == "easy") {
      return 1;
    } else if (task.difficulty == "medium") {
      return 1.5;
    } else if (task.difficulty == "hard") {
      return 2;
    } else {
      console.log("Invalid assignDiffMultiPoints state...");
      return 1;
    }
  }

  // Creates the created task and sorts it into its mode
  function createAndSortTasks() {
    // Put the task in one of the modes
    // Run task in the matrix for the respective mode
    if (mode == "work") {
      const newTask = new TaskClass(
        taskName,
        importance,
        urgency,
        difficulty,
        mode,
        workTasks.length + 1
      );
      const updatedWorkTasks: TaskClass[] = workTasks;
      updatedWorkTasks.push(newTask);

      setWorkTasks(updatedWorkTasks);

      // runMatrix re-evaluates the tasks and sets the matrixOrder
      // property in each task, as shown in the TaskClass file/class
      runMatrix(updatedWorkTasks, "work");
    } else if (mode == "school") {
      const newTask = new TaskClass(
        taskName,
        importance,
        urgency,
        difficulty,
        mode,
        schoolTasks.length + 1
      );
      const updatedSchoolTasks: TaskClass[] = schoolTasks;
      updatedSchoolTasks.push(newTask);

      setSchoolTasks(updatedSchoolTasks);

      runMatrix(updatedSchoolTasks, "school");
    } else if (mode == "home") {
      const newTask = new TaskClass(
        taskName,
        importance,
        urgency,
        difficulty,
        mode,
        homeTasks.length + 1
      );
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
      console.log(tasksToUpdate.length - task.insertedOrder + 1);
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
    if (
      !createTask &&
      taskName &&
      importance &&
      urgency &&
      mode &&
      difficulty
    ) {
      createAndSortTasks();
      setTaskName("");
      setImportance("");
      setUrgency("");
      setDifficulty("");
      setMode("");
    }
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
          difficulty={difficulty}
          setDifficulty={setDifficulty}
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
                <Grid2 size={4}>
                  <Card
                    variant="outlined"
                    style={{ backgroundColor: " #F5EBFF " }}
                  >
                    {/* Note: Need to change card color to the site's background color and te text to the card's color. */}
                    <CardContent>
                      <h3>Work</h3>
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
                              <form
                                onSubmit={(event) =>
                                  handleTaskCompletion(task, event)
                                }
                              >
                                {/* <FormGroup>
                                  <FormControlLabel
                                    control={<Checkbox />}
                                    label={task.taskName}
                                  /> */}
                                {task.importance} {task.urgency}{" "}
                                {"Recommended Order:"} {task.matrixOrder}{" "}
                                {task.difficulty}
                                {/* </FormGroup> */}
                                <br />
                                <Button
                                  type="submit"
                                  variant="contained"
                                  color="primary"
                                >
                                  Mark Completed
                                </Button>
                              </form>
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
                      <h3>School</h3>
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
                              <FormGroup>
                                <FormControlLabel
                                  control={<Checkbox />}
                                  label={task.taskName}
                                />
                                {task.importance} {task.urgency}{" "}
                                {"Recommended Order:"} {task.matrixOrder}{" "}
                                {task.difficulty}
                              </FormGroup>
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
                      <h3>Home</h3>
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
                              <FormGroup>
                                <FormControlLabel
                                  control={<Checkbox />}
                                  label={task.taskName}
                                />
                                {task.importance} {task.urgency}{" "}
                                {"Recommended Order:"} {task.matrixOrder}{" "}
                                {task.difficulty}
                              </FormGroup>
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
      )}
    </>
  );
}
export default Profile;
