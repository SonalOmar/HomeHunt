import React from 'react';


export const Navbar=()=>{
    return(
        <div>
         <div className="nav1">
          <Link to="/" className="c2">Home</Link>
          <Link to="/properties" className="c2">Properties</Link>
          <Link to="/about" className="c2">About</Link>
          <Link to="/contact" className="c2">Contact</Link>
        </div>
        <div className="nav2"></div>
        </div>
    )
}
export default Navbar;
