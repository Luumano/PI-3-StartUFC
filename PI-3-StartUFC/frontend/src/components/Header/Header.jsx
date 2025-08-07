import React from 'react';
import './Header.css';
import Image from '../../assets/StartUFC-logo-simples.png';
import Logo from '../../assets/StartUFC-logo.png';
import Button from '../Button/Button';
import { Link } from 'react-router-dom';

//  GESTOR DE AUTENTICAÇÃO
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  //  GESTOR PARA OBTER O ESTADO DO UTILIZADOR
  const { user } = useAuth();

  return (
    <header>
      <div className='header'>
        <div className="header-content">


          <div className='header-start'>
            <img src={Logo} alt="StartUFC Logo" className='header-logo' />
            <div className='text-initial'>
              <p>Impulsionando ideias, conectando </p>
              <p>futuros: onde a proatividade </p>
              <p> encontra o empreendedorismo</p>
            </div>
            
            {/* 3. AQUI ESTÁ A LÓGICA CONDICIONAL */}
            {/* O botão "Cadastre-se" só será mostrado se NÃO houver um utilizador logado. */}
            {!user && (
              <Link to="/register" className="header-cta-button">
                <Button text="Cadastre-se agora" color="green" />
              </Link>
            )}
            
          </div>

          <img src={Image} alt="Ilustração" className='header-img' />

        </div>
      </div>
    </header>
  );
};

export default Header;
