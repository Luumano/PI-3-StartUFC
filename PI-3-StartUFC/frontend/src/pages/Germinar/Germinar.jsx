import React from 'react';
import './Germinar.css';
import Img from '../../assets/foto1Start.png';
import Button from '../../components/Button/Button';
import Logog from '../../assets/Germinar logo.png';
import { Link } from 'react-router-dom'; 

const Germinar = () => {

  return (

    <section className="germinar-section" id="germinar-id">

      {/* Container principal que cria o layout de duas colunas */}
      <div className="germinar-content">

        {/* Coluna da Esquerda: Logo e Texto */}
        <div className="germinar-left-column">
          <img src={Logog} alt="Logo do projeto Germinar" className="germinar-logo" />
          <p className="germinar-text">
            O projeto foi criado com objetivo de auxiliar Startups nas suas fases de criação e 
            desenvolvimento. Apoios como este são de suma importância para a consolidação de novos negócios 
            e para o desenvolvimento regional.
          </p>
        </div>

   
        <div className="germinar-right-column">
          <img src={Img} alt="Pessoas em uma reunião de trabalho" className="germinar-image" />
       
          <Link to="germinar-page">
            <Button text="Ir para Germinar" color="green" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default Germinar;