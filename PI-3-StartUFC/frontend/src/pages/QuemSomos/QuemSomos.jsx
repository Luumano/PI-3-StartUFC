import React from 'react';
import './QuemSomos.css';
import Img from '../../assets/quem_somos.png';
import Img2 from '../../assets/foto1Start.png';

const QuemSomos = () => {
  return (
 
    <section className='about' id='about-id'>
      
      {/* Container principal de duas colunas */}
      <div className='about-content'>
        
        {/* Coluna da Esquerda: Título e Imagem */}
        <div className='about-image-column'>
          <h1 className='about-title'>Quem Somos</h1>
          <img src={Img} alt="Equipe do projeto SParC reunida" className='img' />
          <img src={Img2} alt="equipe" className='img'/>
        </div>
       


        {/* Coluna da Direita: Todo o conteúdo de texto */}
        <div className='about-text-column'>
          <p>
            O SParC (Ecossistema Parque Tecnológico Crateús) é um ecossistema criado em maio de 2019. O núcleo tem realizado e participado, entre outras ações, de eventos nas áreas de tecnologia, informação e inovação, sempre com foco em ações empreendedoras dos estudantes.
          </p>
          <p>
            O SParC é vinculado à diretoria do Campus de Crateús. Além de disseminar o conhecimento desenvolvido no campus e contribuir para a transformação socioeconômica da região do sertão de Crateús, o núcleo busca proporcionar aos alunos um ambiente que potencialize o estabelecimento de novos contatos profissionais e a busca de soluções na sociedade.
          </p>
          <p>
            O SParC está em permanente articulação com o Comitê de Inovação Tecnológica (COMIT), com a Coordenadoria de Inovação Tecnológica (CIT) da UFC e com o Parque Tecnológico da UFC.
          </p>
          <p>
            Atualmente, é formado por um grupo de docentes dos Cursos de Sistemas de Informação e Ciência da Computação, além de técnicos do campus, que representam o núcleo da UFC. O comitê gestor é composto também por outras entidades, como o Governo do Estado do Ceará; a Prefeitura de Crateús; o Instituto Federal de Educação, Ciência e Tecnologia do Ceará (IFCE); e o SEBRAE. O objetivo do comitê é traçar as diretrizes e políticas, bem como avaliar periodicamente o desempenho do núcleo.
          </p>
          <p>
            A comunidade pode participar do núcleo por meio dos eventos promovidos e de editais para instalação de empresas e startups no Parque Tecnológico. Esses editais buscam captar empresas que possam agregar valor ao campus e à região de Crateús.
          </p>

          {/* Seção de Apoiadores no final da coluna de texto */}
          <div className='supporters-section'>
            <h4>Apoiadores:</h4>
            <ul>
              <li>Corredores Digitais</li>
              <li>Sebrae</li>
              <li>Funcap</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuemSomos;