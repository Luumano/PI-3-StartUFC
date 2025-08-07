

import React, { useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import "./Carrossel.css";

const Carrossel = ({ imagens }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    // Calcula o quanto rolar: a largura do container - um pouco de margem
    const scrollAmount = scrollRef.current.clientWidth * 0.8; 
    if (direction === 'left') {
      scrollRef.current.scrollLeft -= scrollAmount;
    } else {
      scrollRef.current.scrollLeft += scrollAmount;
    }
  };

  return (
    <div className="carrossel-wrapper">
      <button className="carrossel-btn prev" onClick={() => scroll('left')}>
        <FaChevronLeft />
      </button>

      <div className="carrossel-track" ref={scrollRef}>
        {imagens.map((img, index) => (
          <div key={index} className="carrossel-imagem-container">
            <img
              src={img}
              alt={`Imagem da galeria ${index + 1}`}
              className="carrossel-imagem"
            />
          </div>
        ))}
      </div>

      <button className="carrossel-btn next" onClick={() => scroll('right')}>
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Carrossel;