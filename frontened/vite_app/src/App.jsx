//import { Navbar } from "./components/Navbar";
import React  from "react";
import {BrowserRouter as Router , Routes , Route} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
 
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="properties" element={<PropertyList />} />
        <Route path="properties/:id" element={<PropertyDetails />} />
      </Routes>
    </Router>
  );
}

export default App
