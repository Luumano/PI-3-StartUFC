import React from 'react';
import './ConhecendoGerminar.css';
import ImagemLetraP from '../../assets/folhaazulG.png'; 
import ImagemConteudo from '../../assets/foto1Start.png'; 

const ConhecendoGerminar = () => {
  return (
   <section className="conhecendo-section">
  {/* O container agora envolve TUDO, inclusive o título */}
  <div className="conhecendo-content"> 
    <h2 className="conhecendo-title">Conhecendo o Germinar</h2>

        <p className="intro-paragraph">
           O Germinar é uma iniciativa de extensão que visa fomentar o 
           empreendedorismo e a inovação em Crateús, conectando a universidade à 
           comunidade e transformando ideias em negócios reais.
        </p>

        {/* Primeira seção com imagem (Letra P) e texto */}
        <div className="content-row">
          <img src={ImagemLetraP} alt="Letra P estilizada" className="drop-cap-image" />
          <p>
    O projeto é vinculado ao SPARC (Parque Tecnológico de Crateús), 
    núcleo de apoio à pesquisa, inovação e empreendedorismo, com espaço físico no 
    campus da UFC em Crateús. Destinado a universitários e à população em geral, o Germinar 
    oferece oficinas, mentorias, capacitações e apoio técnico, conduzindo os participantes desde a 
    ideação até a validação e modelagem de negócios.
         </p>
        </div>

        {/* Segunda seção com texto e imagem (quadrada) */}
        <div className="content-row">
          <p>
    A iniciativa conta com o apoio dos Corredores Digitais da SECITECE, do SEBRAE e outros 
    parceiros institucionais. Atualmente, acompanha startups em estágio inicial, fortalecendo o 
    ecossistema local. O projeto é coordenado pelo Prof. Me. Arnaldo Barreto e tem como subcoordenador
     Thiago Sales, ambos atuando ativamente na promoção da cultura empreendedora na região.
  </p>
          <img src={ImagemConteudo} alt="Conteúdo Germinar" className="content-image" />
        </div>

      </div>
    </section>
  );
};

export default ConhecendoGerminar;