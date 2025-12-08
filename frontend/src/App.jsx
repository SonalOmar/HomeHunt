import React from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import { BrowserRouter, Routes,Route } from "react-router-dom";

import "./App.css";
import About from "./pages/About"; 
import Contact from "./pages/Contact"; 
import PropertyDetail from "./pages/PropertyDetail"; 

import PropertyManagement from "./pages/PropertyManagement";
import AllProperties from "./pages/AllProperties";
import { AuthProvider } from "./context/AuthContext";
import Profile from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route
              path="/home/manage-properties"
              element={<PropertyManagement />}
            />
            <Route path="/manage-properties" element={<PropertyManagement />} />
            <Route path="/home/all-properties" element={<AllProperties />} />
            <Route path="/all-properties/*" element={<AllProperties />} />

            <Route path="/profile" element={<Profile />} />
            
           
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;


