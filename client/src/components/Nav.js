import React from 'react';
import { Link } from 'react-router-dom';

import './Nav.css';

const Nav = () => {
  return(
    <header className='nav-container'>
      <div style={{marginLeft: '22px'}}>
        <h1>Events... With GraphQL!</h1>
      </div>
      <div className='nav-links'>
        <Link to='/bookings'>Bookings</Link>
        <Link to='/events'>Events</Link>
        <Link to='/'>Home</Link>
      </div>
    </header>
  )
}


export default Nav;