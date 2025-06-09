
import React, { useState } from "react";
import axios from "axios";
import "./Register.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/auth/login", {   // change this accordingly 
        username,
        email,
        password,
      });
      alert(response.data.message);
    } catch (error) {
      alert(error.response.data.detail);
    }
  };
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="username"
            placeholder="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />  
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};
export default Register;

