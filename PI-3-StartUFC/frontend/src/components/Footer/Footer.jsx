import React from 'react';
import './Footer.css';
import Logo from '../../assets/StartUFC-logo-verde.png';
import { FaInstagramSquare, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { AiFillTikTok } from "react-icons/ai";

const Footer = () => {
  return (
    <footer>

      <div className='footer-content'>
        {/* Div interna para alinhar o conteúdo com o resto do site */}
        <div className='footer-inner-container'>

          <div className='footer-main'>
            <img src={Logo} alt="StartUFC Logo" className='footer-logo' />
            
       
            <div className='footer-social'>
              <div className="social-group">
                <h2>Siga nossas redes</h2>
                <div className="icon-links">
                  <a href="https://www.instagram.com/startufc/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagramSquare /></a>
                  <a href="https://www.tiktok.com/@startufc" target="_blank" rel="noopener noreferrer" aria-label="TikTok"><AiFillTikTok /></a>
                  <a href="https://www.linkedin.com/in/startufc-programa-de-incentivo-ao-empreendedorismo-9bbb61289/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
                </div>
              </div>
              <div className="social-group">
                <h2>Contate-nos</h2>
                <div className="icon-links">
                  <a href="mailto:startufc@crateus.ufc.br" aria-label="Email"><MdEmail /></a>
                </div>
              </div>
            </div>
          </div>

          <hr />

          <div className='footer-bottom'>
            <div className='copyright-text'>
              <p>&copy; 2025 StartUFC. Todos os direitos reservados.</p>
            </div>
            <div className='address-text'>
              <p>Av. Professora Maria Machado, S/N, Campo do Avião, Crateús-CE, 63708-825</p>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;