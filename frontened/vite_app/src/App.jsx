import React from "react";
<<<<<<< HEAD
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import { BrowserRouter, Routes,Route } from "react-router-dom";
=======
import Login from "./pages/Login"
import Home from "./pages/Home"
import Register from "./pages/Register";
>>>>>>> pr3

function App() {
  return (
    <div>
<<<<<<< HEAD
    
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/home" element={<Home/>} />
        </Routes>
      </BrowserRouter>
=======
     
      {/* <Home/> */}
      <Register />
      {/* <Login/> */}
>>>>>>> pr3
    </div>
  );
}

export default App;


