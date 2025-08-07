import React from 'react';
import './Description.css';

const Description = () => {
  return (

    <section className='description-section'>

      {/* 1. Div EXTERNA: cuida do fundo azul de ponta a ponta */}
      <div className='description-full-background'>

        {/* 2. Div INTERNA: o nosso container de 1180px que alinha o conteúdo */}
        <div className='description-inner-container'>

          {/* Conteúdo da Esquerda (título) */}
          <div className='description-title'>
           
            <h2>
              Com a ideia certa,<br />
              grandes coisas<br />
              acontecem
            </h2>
          </div>

          <div className='description-text'>
          
            <p>
            O StartUFC é um programa de incentivo ao empreendedorismo, criado como um projeto de extensão em 2020 por Matheus, um estudante de Tecnologia da Informação. Seu objetivo é promover a mentalidade empreendedora dentro e fora da Universidade, incentivando os estudantes a se engajarem de forma produtiva e colaborativa.
O programa é coordenado por Arnaldo Barreto Vila Lobo e Lilian Carneiro, com a subcoordenação de Frankecion Bernardino Mesquita (StartUFC) e Thiago Sales Macedo (Germinar).
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Description;