import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";

function App() {
  const [login, setLogin] = useState(sessionStorage.getItem("token") || null);

  return (
    <Routes>
      <Route path="*" element={<Login setLogin={setLogin}/>} />
      {login ? (
        <Route path="/home" element={<Home />} />
      ) : (
        <Route path="/login" element={<Login setLogin={setLogin} />} />
      )}
    </Routes>
  );
}

export default App;
