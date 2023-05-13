import "./App.css";
import { useEffect, createContext, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import { validateUser } from "./utils";
import { User } from "./Types";

export const SignedInContext = createContext<User>({signedIn: false});

function App() {
  const [signedIn, setSignedIn] = useState(false)

  useEffect(() => {
    validateUser().then((res) => {
      setSignedIn(res);
    });
  }, [setSignedIn]);

  return (
    <SignedInContext.Provider value={{signedIn, setSignedIn}}>
      <div className="App">
        <Navbar />
        <div className="content-container">
          <Outlet />
        </div>
      </div>
    </SignedInContext.Provider>
  );
}

export default App;
