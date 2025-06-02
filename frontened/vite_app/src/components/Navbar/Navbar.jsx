import React from "react";
import "./Navbar.css";
import Dropdown from "./Dropdown"
import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Button,
  Container,
} from "react-bootstrap";
import { Link } from "react-router-dom";


export const MyNavbar = () => {
  return (
    <div>
      <div className="navbar1" >
        <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
          {/* <a className="navbar-brand" href="#">
            HomeHunt
          </a> */}
          <h1
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              color: "#2C3E50",
              letterSpacing: "1px",
            }}
          >
            Home<span style={{ color: "#27AE60" }}>Hunt</span>
          </h1>

          <div className="collapse navbar-collapse justify-content-end">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="#">
                  About
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Contact Us
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  {/* Profile icon using emoji or Unicode */}
                  👤
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <div className="navbar2">
        <Navbar expand="lg" bg="light" variant="light">
          <Container fluid>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav className="me-auto my-2 my-lg-0" navbarScroll>
                <Dropdown title="Sell" />
                <Dropdown title="Buy" />
                <Dropdown title="Rent" />
              </Nav>
              <Form className="d-flex">
                <FormControl
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                />
                <Button variant="outline-success">Search</Button>
              </Form>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    </div>
  );
};

