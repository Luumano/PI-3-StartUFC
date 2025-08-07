import React from 'react';
import './Navbar2.css';
import seta from '../../assets/seta.png';
import { Link } from "react-router-dom";


function Navbar2() {
  return (
    <nav className='nav2'>
   
      <div className='navbar2-container'>
        <Link to="/">
          <img src={seta} alt="Voltar para a página inicial" className='navbar2-seta' />
        </Link>
      </div>
    </nav>
  );
}

export default Navbar2;