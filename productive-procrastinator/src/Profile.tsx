// import { createTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { TaskClass } from "./TaskClass";
import { auth } from "./firebase";
import { signOut } from "@firebase/auth";
import {
  Box,
  Button,
  Card,
  CardContent,
  // Checkbox,
  createTheme,
  // FormControlLabel,
  // FormGroup,
  Grid2,
  Paper,
  ThemeProvider,
} from "@mui/material";

import "./App.css";
// import Points from "./Points";
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

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("Successfully signed out");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // 3 modes to follow for the point system
  // 1. Eisenhower Matrix | Gives points based on how the ai ordered your tasks.
  // 2. Difficulty multipliers |
  // 3. Streak Bonuses | Awards additional based on a SERIES of previous tasks
  // Note: Wouldn't 1 and 3 be additional points and 2 be the base points?

  // Updated and shown to the user
  // const [totalPoints, setTotalPoints] = useState(0);

  // Difficulty multiplier

  // Used for STREAK bonuses | They're applied only after the first task such that there is a series of tasks
  // const [prevDiff, setPrevDiff] = useState(0);
  // const [curDiff, setCurDiff] = useState(0);

  // 0 -> easy
  // 1 -> medium
  // 2 -> hard

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
  const [prevDiff, _setPrevDiff] = useState("");
  const [streak, setStreak] = useState(0);
  // const [curDiff, setCurDiff] = useState("");

  // const handleTaskCompletion = (
  //   task: TaskClass,
  //   event: { preventDefault: () => void }
  // ) => {
  //   event.preventDefault();
  //   // console.log(task.taskName);
  //   // console.log(task.importance);
  //   // console.log(task.urgency);
  //   // console.log(task.insertedOrder);
  //   // console.log(task.matrixOrder);
  //   // console.log(task.mode);

  //   // 1. Assign the points
  //   // 1a. Assign the base points wrt matrix quadrants
  //   // Assign base points based on where the importance
  //   // and urgency of the task on the matrix
  //   // 1b. Assign points based on task streaks
  //   // Keep track of the difficulty of the current task in
  //   // relation to the matrix quadrants, then assign points
  //   // based on that while keeping track of the 'streak' (when the user has already completed a previous task).
  //   // 1c. Assign points based on difficulty multiplier points
  //   // Assign points if the new task is even HARDER than the one
  //   // recommended on the matrix
  //   const basePoints = assignBasePoints(task);
  //   const streakPoints = assignStreakPoints(task) * basePoints;
  //   const diffMultPoints = assignDiffMultiPoints(task) * basePoints;
  //   const curPoints = basePoints + streakPoints + diffMultPoints;
  //   setTotalPoints(curPoints);

  //   // 2. Remove THIS task from the list of tasks in correlation to the mode
  //   // let updateTasks
  //   if (mode == "work") {
  //     const updateTasks: TaskClass[] = workTasks;
  //     let i = 0;
  //     for (i = 0; i < updateTasks.length; i++) {
  //       if (task.insertedOrder == updateTasks[i].insertedOrder) {
  //         break;
  //       }
  //     }
  //     if (i > 0) {
  //       updateTasks.splice(i, 1);
  //     }
  //     setWorkTasks(updateTasks);
  //   } else if (mode == "school") {
  //     const updateTasks: TaskClass[] = schoolTasks;
  //     let i = 0;
  //     for (i = 0; i < updateTasks.length; i++) {
  //       if (task.insertedOrder == updateTasks[i].insertedOrder) {
  //         break;
  //       }
  //     }
  //     if (i > 0) {
  //       updateTasks.splice(i, 1);
  //     }
  //     setSchoolTasks(updateTasks);
  //   } else if (mode == "home") {
  //     const updateTasks: TaskClass[] = homeTasks;
  //     let i = 0;
  //     for (i = 0; i < updateTasks.length; i++) {
  //       if (task.insertedOrder == updateTasks[i].insertedOrder) {
  //         break;
  //       }
  //     }
  //     if (i > 0) {
  //       updateTasks.splice(i, 1);
  //     }
  //     setHomeTasks(updateTasks);
  //   } else {
  //     console.log("Internal Client Error...");
  //   }

  //   // 3. Update the list of tasks that are displayed ?????????
  // };

  // // Assigns all points
  // function assignPoints(task: TaskClass) {
  //   console.log(task.taskName);
  // }
  // In Profile.tsx, modify handleTaskCompletion:
  const handleTaskCompletion = (task: TaskClass, event: React.FormEvent) => {
    event.preventDefault();

    // Calculate points
    const basePoints = assignBasePoints(task);
    const streakPoints = assignStreakPoints(task) * basePoints;
    const diffMultPoints = assignDiffMultiPoints(task) * basePoints;
    const earnedPoints = basePoints + streakPoints + diffMultPoints;
    
    // Update total points
    setTotalPoints(prev => prev + earnedPoints);

    // Remove the completed task
    if (task.mode === "work") {
      setWorkTasks(workTasks.filter(t => t.insertedOrder !== task.insertedOrder));
    } else if (task.mode === "school") {
      setSchoolTasks(schoolTasks.filter(t => t.insertedOrder !== task.insertedOrder));
    } else if (task.mode === "home") {
      setHomeTasks(homeTasks.filter(t => t.insertedOrder !== task.insertedOrder));
    }

    // Update the previous difficulty for streak calculation
    _setPrevDiff(task.difficulty);
  };

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

  const handleDeleteTask = (task: TaskClass, mode: string) => {
    if (mode === "work") {
      setWorkTasks(workTasks.filter(t => t.insertedOrder !== task.insertedOrder));
    } else if (mode === "school") {
      setSchoolTasks(schoolTasks.filter(t => t.insertedOrder !== task.insertedOrder));
    } else if (mode === "home") {
      setHomeTasks(homeTasks.filter(t => t.insertedOrder !== task.insertedOrder));
    }
  };
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

  //   return (
  //     <>
  //       {createTask ? (
  //         <Task
  //           taskName={taskName}
  //           setTaskName={setTaskName}
  //           setSubmitTask={setCreateTask}
  //           importance={importance}
  //           setImportance={setImportance}
  //           urgency={urgency}
  //           setUrgency={setUrgency}
  //           mode={mode}
  //           setMode={setMode}
  //         />
  //       ) : (
  //         <Card variant="outlined" style={{ backgroundColor: " #F5EBFF " }}>
  //           <CardContent>
  //             <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
  //               <h2>Your Points</h2>
  //               <Button
  //                 variant="contained"
  //                 onClick={handleSignOut}
  //                 sx={{
  //                   backgroundColor: "#FF5733",
  //                   '&:hover': {
  //                     backgroundColor: '#E64A2E'
  //                   }
  //                 }}
  //               >
  //                 Sign Out
  //               </Button>
  //             </Box>
  //             <ThemeProvider theme={theme}>
  //               {/* Rest of your existing Profile component JSX */}
  //               <Grid2 container spacing={2}>
  //                 {/* ... [Keep all your existing Grid2 components] */}
  //               </Grid2>
  //             </ThemeProvider>
  //           </CardContent>
  //         </Card>
  //       )}
  //     </>
  //   );
  // }
  // return (
  //   <>
  //     {createTask ? (
  //       <Task
  //         id={taskName}
  //         taskName={taskName}
  //         setTaskName={setTaskName}
  //         setSubmitTask={setCreateTask}
  //         importance={importance}
  //         setImportance={setImportance}
  //         urgency={urgency}
  //         difficulty={difficulty}
  //         setDifficulty={setDifficulty}
  //         setUrgency={setUrgency}
  //         mode={mode}
  //         setMode={setMode}
  //       />
  //     ) : (
  //       <Card variant="outlined" style={{ backgroundColor: " #F5EBFF " }}>
  //         <CardContent>
  //           <Box
  //             display="flex"
  //             justifyContent="space-between"
  //             alignItems="center"
  //             mb={2}
  //           >
  //             <h2>Your Points</h2>
  //             <Button
  //               variant="contained"
  //               onClick={handleSignOut}
  //               sx={{
  //                 backgroundColor: "#FF5733",
  //                 "&:hover": {
  //                   backgroundColor: "#E64A2E",
  //                 },
  //               }}
  //             >
  //               Sign Out
  //             </Button>
  //           </Box>
  //           <ThemeProvider theme={theme}>
  //             <Grid2 container spacing={2}>
  //               <Grid2 size={6}>
  //                 {/* <Points points={totalPoints} setPoints={setTotalPoints} /> */}
  //                 <p>Points {totalPoints}</p>
  //               </Grid2>
  //               <Grid2 size={6}>
  //                 {/* <Streaks /> */}
  //                 <p>Streaks {streak}</p>
  //               </Grid2>
  //               <Grid2 size={4}>
  //                 <Card
  //                   variant="outlined"
  //                   style={{ backgroundColor: " #F5EBFF " }}
  //                 >
  //                   {/* Note: Need to change card color to the site's background color and te text to the card's color. */}
  //                   <CardContent>
  //                     <h3>Work</h3>
  //                     {createTask == false && workTasks.length > 0 ? (
  //                       workTasks.map((task) => (
  //                         <Box>
  //                           <Paper
  //                             elevation={3}
  //                             sx={{
  //                               borderRadius: 1,
  //                               bgcolor: "primary.main",
  //                               "&:hover": {
  //                                 bgcolor: "primary.dark",
  //                               },
  //                             }}
  //                           >
  //                             <form
  //                               onSubmit={(event) =>
  //                                 handleTaskCompletion(task, event)
  //                               }
  //                             >
  //                               {/* <FormGroup>
  //                                 <FormControlLabel
  //                                   control={<Checkbox />}
  //                                   label={task.taskName}
  //                                 /> */}
  //                               {task.taskName}
  //                               {task.importance} {task.urgency}{" "}
  //                               {"Recommended Order:"} {task.matrixOrder}{" "}
  //                               {task.difficulty}
  //                               {/* </FormGroup> */}
  //                               <br />
  //                               <Button
  //                                 type="submit"
  //                                 variant="contained"
  //                                 color="primary"
  //                               >
  //                                 Mark Completed
  //                               </Button>
  //                             </form>
  //                           </Paper>
  //                           <br />
  //                         </Box>
  //                       ))
  //                     ) : (
  //                       <Paper
  //                         elevation={3}
  //                         sx={{
  //                           borderRadius: 1,
  //                           bgcolor: "primary.main",
  //                           "&:hover": {
  //                             bgcolor: "primary.dark",
  //                           },
  //                         }}
  //                       >
  //                         {"No tasks..."}
  //                       </Paper>
  //                     )}
  //                   </CardContent>
  //                 </Card>
  //               </Grid2>
  //               <Grid2 size={4}>
  //                 <Card
  //                   variant="outlined"
  //                   style={{ backgroundColor: " #F5EBFF " }}
  //                 >
  //                   <CardContent>
  //                     <h3>School</h3>
  //                     {createTask == false && schoolTasks.length > 0 ? (
  //                       schoolTasks.map((task) => (
  //                         <Box>
  //                           <Paper
  //                             elevation={3}
  //                             sx={{
  //                               borderRadius: 1,
  //                               bgcolor: "primary.main",
  //                               "&:hover": {
  //                                 bgcolor: "primary.dark",
  //                               },
  //                             }}
  //                           >
  //                             <form
  //                               onSubmit={(event) =>
  //                                 handleTaskCompletion(task, event)
  //                               }
  //                             >
  //                               {/* <FormGroup>
  //                                 <FormControlLabel
  //                                   control={<Checkbox />}
  //                                   label={task.taskName}
  //                                 /> */}
  //                               {task.taskName}
  //                               {task.importance} {task.urgency}{" "}
  //                               {"Recommended Order:"} {task.matrixOrder}{" "}
  //                               {task.difficulty}
  //                               {/* </FormGroup> */}
  //                               <br />
  //                               <Button
  //                                 type="submit"
  //                                 variant="contained"
  //                                 color="primary"
  //                               >
  //                                 Mark Completed
  //                               </Button>
  //                             </form>
  //                           </Paper>
  //                           <br />
  //                         </Box>
  //                       ))
  //                     ) : (
  //                       <Paper
  //                         elevation={3}
  //                         sx={{
  //                           borderRadius: 1,
  //                           bgcolor: "primary.main",
  //                           "&:hover": {
  //                             bgcolor: "primary.dark",
  //                           },
  //                         }}
  //                       >
  //                         {"No tasks..."}
  //                       </Paper>
  //                     )}
  //                   </CardContent>
  //                 </Card>
  //               </Grid2>
  //               <Grid2 size={4}>
  //                 <Card
  //                   variant="outlined"
  //                   style={{ backgroundColor: " #F5EBFF " }}
  //                 >
  //                   <CardContent>
  //                     <h3>Home</h3>
  //                     {createTask == false && homeTasks.length > 0 ? (
  //                       homeTasks.map((task) => (
  //                         <Box>
  //                           <Paper
  //                             elevation={3}
  //                             sx={{
  //                               borderRadius: 1,
  //                               bgcolor: "primary.main",
  //                               "&:hover": {
  //                                 bgcolor: "primary.dark",
  //                               },
  //                             }}
  //                           >
  //                             <form
  //                               onSubmit={(event) =>
  //                                 handleTaskCompletion(task, event)
  //                               }
  //                             >
  //                               {/* <FormGroup>
  //                                 <FormControlLabel
  //                                   control={<Checkbox />}
  //                                   label={task.taskName}
  //                                 /> */}
  //                               {task.taskName}
  //                               {task.importance} {task.urgency}{" "}
  //                               {"Recommended Order:"} {task.matrixOrder}{" "}
  //                               {task.difficulty}
  //                               {/* </FormGroup> */}
  //                               <br />
  //                               <Button
  //                                 type="submit"
  //                                 variant="contained"
  //                                 color="primary"
  //                               >
  //                                 Mark Completed
  //                               </Button>
  //                             </form>
  //                           </Paper>
  //                           <br />
  //                         </Box>
  //                       ))
  //                     ) : (
  //                       <Paper
  //                         elevation={3}
  //                         sx={{
  //                           borderRadius: 1,
  //                           bgcolor: "primary.main",
  //                           "&:hover": {
  //                             bgcolor: "primary.dark",
  //                           },
  //                         }}
  //                       >
  //                         {"No tasks..."}
  //                       </Paper>
  //                     )}
  //                   </CardContent>
  //                 </Card>
  //               </Grid2>
  //               <br />
  //               <Grid2 size={12}>
  //               <Button
  //                 variant="contained"
  //                 sx={{ backgroundColor: "#FF5733" }}
  //                 onClick={() => {
  //                   setCreateTask(true);
  //                   // Reset all form fields when opening the create task form
  //                   setTaskName("");
  //                   setImportance("");
  //                   setUrgency("");
  //                   setDifficulty("");
  //                   setMode("");
  //                 }}
  //               >
  //                 Create Task
  //               </Button>
  //               </Grid2>
  //             </Grid2>
  //           </ThemeProvider>
  //         </CardContent>
  //       </Card>
  //     )}
  //   </>
  // );
  return (
    <>
      {createTask ? (
        <Task
          id={taskName}
          taskName={taskName}
          setTaskName={setTaskName}
          setSubmitTask={setCreateTask}
          importance={importance}
          setImportance={setImportance}
          urgency={urgency}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          setUrgency={setUrgency}
          mode={mode}
          setMode={setMode}
        />
      ) : (
        <Card variant="outlined" style={{ backgroundColor: " #F5EBFF " }}>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <h2>Your Points</h2>
              <Button
                variant="contained"
                onClick={handleSignOut}
                sx={{
                  backgroundColor: "#FF5733",
                  "&:hover": {
                    backgroundColor: "#E64A2E",
                  },
                }}
              >
                Sign Out
              </Button>
            </Box>
            <ThemeProvider theme={theme}>
              <Grid2 container spacing={2}>
                <Grid2 size={6}>
                  <p>Points {totalPoints}</p>
                </Grid2>
                <Grid2 size={6}>
                  <p>Streaks {streak}</p>
                </Grid2>
                
                {/* Work Tasks Section */}
                <Grid2 size={4}>
                  <Card variant="outlined" style={{ backgroundColor: " #F5EBFF " }}>
                    <CardContent>
                      <h3>Work</h3>
                      {workTasks.length > 0 ? (
                        workTasks.map((task) => (
                          <Box key={task.insertedOrder} sx={{ mb: 2 }}>
                            <Paper
                              elevation={3}
                              sx={{
                                borderRadius: 1,
                                bgcolor: "primary.main",
                                "&:hover": {
                                  bgcolor: "primary.dark",
                                },
                                p: 2
                              }}
                            >
                              <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column',
                                gap: '8px'
                              }}>
                                <div>
                                  <strong>{task.taskName}</strong>
                                  <br />
                                  Status: {task.importance}, {task.urgency}
                                  <br />
                                  Difficulty: {task.difficulty}
                                  <br />
                                  Recommended Order: {task.matrixOrder}
                                </div>
                                <div style={{ 
                                  display: 'flex', 
                                  gap: '8px',
                                  justifyContent: 'flex-end'
                                }}>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={(event) => handleTaskCompletion(task, event)}
                                    sx={{ minWidth: '120px' }}
                                  >
                                    Complete
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleDeleteTask(task, "work")}
                                    sx={{ minWidth: '120px' }}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </Paper>
                          </Box>
                        ))
                      ) : (
                        <Paper
                          elevation={3}
                          sx={{
                            borderRadius: 1,
                            bgcolor: "primary.main",
                            p: 2,
                            textAlign: 'center'
                          }}
                        >
                          No tasks...
                        </Paper>
                      )}
                    </CardContent>
                  </Card>
                </Grid2>

                {/* School Tasks Section */}
                <Grid2 size={4}>
                  <Card variant="outlined" style={{ backgroundColor: " #F5EBFF " }}>
                    <CardContent>
                      <h3>School</h3>
                      {schoolTasks.length > 0 ? (
                        schoolTasks.map((task) => (
                          <Box key={task.insertedOrder} sx={{ mb: 2 }}>
                            <Paper
                              elevation={3}
                              sx={{
                                borderRadius: 1,
                                bgcolor: "primary.main",
                                "&:hover": {
                                  bgcolor: "primary.dark",
                                },
                                p: 2
                              }}
                            >
                              <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column',
                                gap: '8px'
                              }}>
                                <div>
                                  <strong>{task.taskName}</strong>
                                  <br />
                                  Status: {task.importance}, {task.urgency}
                                  <br />
                                  Difficulty: {task.difficulty}
                                  <br />
                                  Recommended Order: {task.matrixOrder}
                                </div>
                                <div style={{ 
                                  display: 'flex', 
                                  gap: '8px',
                                  justifyContent: 'flex-end'
                                }}>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={(event) => handleTaskCompletion(task, event)}
                                    sx={{ minWidth: '120px' }}
                                  >
                                    Complete
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleDeleteTask(task, "school")}
                                    sx={{ minWidth: '120px' }}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </Paper>
                          </Box>
                        ))
                      ) : (
                        <Paper
                          elevation={3}
                          sx={{
                            borderRadius: 1,
                            bgcolor: "primary.main",
                            p: 2,
                            textAlign: 'center'
                          }}
                        >
                          No tasks...
                        </Paper>
                      )}
                    </CardContent>
                  </Card>
                </Grid2>

                {/* Home Tasks Section */}
                <Grid2 size={4}>
                  <Card variant="outlined" style={{ backgroundColor: " #F5EBFF " }}>
                    <CardContent>
                      <h3>Home</h3>
                      {homeTasks.length > 0 ? (
                        homeTasks.map((task) => (
                          <Box key={task.insertedOrder} sx={{ mb: 2 }}>
                            <Paper
                              elevation={3}
                              sx={{
                                borderRadius: 1,
                                bgcolor: "primary.main",
                                "&:hover": {
                                  bgcolor: "primary.dark",
                                },
                                p: 2
                              }}
                            >
                              <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column',
                                gap: '8px'
                              }}>
                                <div>
                                  <strong>{task.taskName}</strong>
                                  <br />
                                  Status: {task.importance}, {task.urgency}
                                  <br />
                                  Difficulty: {task.difficulty}
                                  <br />
                                  Recommended Order: {task.matrixOrder}
                                </div>
                                <div style={{ 
                                  display: 'flex', 
                                  gap: '8px',
                                  justifyContent: 'flex-end'
                                }}>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={(event) => handleTaskCompletion(task, event)}
                                    sx={{ minWidth: '120px' }}
                                  >
                                    Complete
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleDeleteTask(task, "home")}
                                    sx={{ minWidth: '120px' }}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </Paper>
                          </Box>
                        ))
                      ) : (
                        <Paper
                          elevation={3}
                          sx={{
                            borderRadius: 1,
                            bgcolor: "primary.main",
                            p: 2,
                            textAlign: 'center'
                          }}
                        >
                          No tasks...
                        </Paper>
                      )}
                    </CardContent>
                  </Card>
                </Grid2>

                {/* Create Task Button */}
                <Grid2 size={12}>
                  <Button
                    variant="contained"
                    sx={{ 
                      backgroundColor: "#FF5733",
                      "&:hover": {
                        backgroundColor: "#E64A2E",
                      },
                    }}
                    onClick={() => {
                      setCreateTask(true);
                      setTaskName("");
                      setImportance("");
                      setUrgency("");
                      setDifficulty("");
                      setMode("");
                    }}
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
