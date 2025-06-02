import React from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import { BrowserRouter, Routes,Route } from "react-router-dom";

function App() {
  return (
    <div>
    
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/home" element={<Home/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;


