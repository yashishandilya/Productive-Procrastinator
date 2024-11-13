import { useState } from "react";
import Login from "./Login";
import Profile from "./Profile";

function App() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <>{showLogin ? <Login setLoginState={setShowLogin} /> : <Profile />}</>
  );
}
export default App;
