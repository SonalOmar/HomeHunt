import React from "react";
import { NavDropdown, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom"; // import Link
import "./Dropdown.css";
const Dropdown = ({ title }) => {
  return (
    <NavDropdown title={title} id="rent-dropdown" className="custom-dropdown">
      <div className="dropdown-content p-3">
        <Row>
          <Col>
            <h4>Location</h4>
            <ul className="list-unstyled">
              <li>
                <Link to="/rent/bangalore">Bangalore</Link>
              </li>
              <li>
                <Link to="/rent/mumbai">Mumbai</Link>
              </li>
              <li>
                <Link to="/rent/delhi">Delhi</Link>
              </li>
              <li>
                <Link to="/rent/hyderabad">Hyderabad</Link>
              </li>
            </ul>
          </Col>
          <Col>
            <h4>Property Type</h4>
            <ul className="list-unstyled">
              <li>
                <Link to="/rent/flats">Flats</Link>
              </li>
              <li>
                <Link to="/rent/house">Independent House</Link>
              </li>
              <li>
                <Link to="/rent/pg">PG / Co-living</Link>
              </li>
              <li>
                <Link to="/rent/commercial">Commercial Space</Link>
              </li>
            </ul>
          </Col>
          <Col>
            <h4>Budget</h4>
            <ul className="list-unstyled">
              <li>
                <Link to="/rent/budget/under-10000">Under ₹10,000</Link>
              </li>
              <li>
                <Link to="/rent/budget/10k-20k">₹10,000 - ₹20,000</Link>
              </li>
              <li>
                <Link to="/rent/budget/20k-30k">₹20,000 - ₹30,000</Link>
              </li>
              <li>
                <Link to="/rent/budget/above-30k">Above ₹30,000</Link>
              </li>
            </ul>
          </Col>
        </Row>
      </div>
    </NavDropdown>
  );
};

export default Dropdown;
