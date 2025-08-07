import React from 'react';
import './Info.css';
import Logo from '../../assets/StartUFC-logo.png'; 
import { IoAddCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const InfoCard = ({ to, text, type, isLogo = false }) => (
  <Link to={to} className={`info-box ${type} ${isLogo ? 'logo-box' : ''}`}>
   
    {isLogo ? (
      <img src={Logo} alt="Start UFC Logo" />
    ) : (
      <>
        <span className="box-text">{text}</span>
        <IoAddCircleOutline className="box-icon" />
      </>
    )}
  </Link>
);

const Info = () => {
  return (
    <section className="info-section">
      <div className="info-grid">
        <InfoCard to="/" isLogo={true} />
        <InfoCard to="/germinar-page" text="Germinar" type="green-box" />
        <InfoCard to="/galeria" text="Galeria" type="dark-box" />
        <InfoCard to="/apoiadores" text="Apoiadores" type="dark-box" />
        <InfoCard to="/redesSociais" text="Redes Sociais" type="green-box" />
        <InfoCard to="/noticias" text="Notícias" type="dark-box" />
        <InfoCard to="/eventos" text="Eventos" type="green-box" />
      </div>
    </section>
  );
};

export default Info;