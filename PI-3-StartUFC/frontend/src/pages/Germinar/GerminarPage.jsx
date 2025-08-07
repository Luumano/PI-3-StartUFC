import React from 'react';
import './GerminarPage.css';
import ImgLogo from '../../assets/GerminarLogop.png'; 
import ImgIlustracao from '../../assets/folhaG.png'; 
import Footer from "../../components/Footer/Footer";
import Navbar2 from '../../components/Navbar2/Navbar2';
import ConhecendoGerminar from '../../components/ConhecendoGerminar/ConhecendoGerminar';
import NewsList from '../NewsList/NewsList'

const GerminarPage = () => {
  return (
    <div>
      <section className='germinarPage' id='germinar-id'>
        <Navbar2 />
        <div className='germinar-content'>
          <div className='germinar-start'>
            <img src={ImgLogo} alt="Logo do Projeto Germinar" className='germinar-logo' />
            <div className='text-germinar'>
              <p>Semeando inovação, colhendo desenvolvimento. Apoiamos sua Startup em cada fase.</p>
              <p></p>
            </div>
          </div>
          <img src={ImgIlustracao} alt="Ilustração do projeto Germinar" className='germinar-img' />
        </div>
      </section>

     
      <div>
        <ConhecendoGerminar />
      </div>
        <NewsList />
       <Footer />

    </div>
  );
}

export default GerminarPage;