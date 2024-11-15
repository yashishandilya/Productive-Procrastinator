import { useState, useEffect } from "react";
import Login from "./Login";
import Profile from "./Profile";
import { onAuthStateChanged, User } from "@firebase/auth";
import { auth } from "./firebase";
import "./App.css";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed:", currentUser?.email);
      setUser(currentUser);
      setIsLoading(false);
    });

    // Cleanup subscription
    return () => {
      console.log("Cleaning up auth listener");
      unsubscribe();
    };
  }, []); // Empty dependency array means this only runs once on mount

  // Debug log
  useEffect(() => {
    console.log("Current user state:", user?.email);
  }, [user]);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#F5EBFF'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="app">
      {user ? (
        <Profile />
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;