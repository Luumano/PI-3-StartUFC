import React from 'react';
import './RedesSociais.css';
import { Link } from 'react-router-dom';
import Navbar2 from '../../components/Navbar2/Navbar2';
import { FaInstagram, FaLinkedin, FaTiktok } from 'react-icons/fa';
import { MdOutlineEmail } from 'react-icons/md';
import Logo from '../../assets/StartUFC-logo.svg';
import ImgMao from '../../assets/mao_logo.png';

const RedesSociais = () => {
  return (

    <div className="comunicacao-page">

      <Navbar2 />

      <div className="comunicacao-container">
        <main className="comunicacao-content">

  
          <section className="left-column">
            <h1>Canais de comunicação</h1>
            <div className="social-icons-wrapper">
              <a href="https://www.instagram.com/startufc" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
              <a href="mailto:startufc@crateus.ufc.br" aria-label="Email"><MdOutlineEmail /></a>
              <a href="https://www.linkedin.com/in/startufc-programa-de-incentivo-ao-empreendedorismo-9bbb61289/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
              <a href="https://www.tiktok.com/@startufc" target="_blank" rel="noopener noreferrer" aria-label="TikTok"><FaTiktok /></a>
            </div>
            <img src={Logo} alt="StartUFC Logo" className="comunicacao-logo" />
          </section>

          
          <aside className="right-column">
            <img src={ImgMao} alt="Mão segurando um celular com o perfil do StartUFC" className="mao-celular-img" />
          </aside>
          
        </main>
      </div>
    </div>
  );
};

export default RedesSociais;