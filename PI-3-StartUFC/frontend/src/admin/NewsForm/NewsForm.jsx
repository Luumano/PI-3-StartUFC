import React, { useState } from 'react';
import './NewsForm.css'
import Navbar2 from '../../components/Navbar2/Navbar2';
import { IoImagesOutline } from "react-icons/io5";
import Button from '../../components/Button/Button'
// 1. MUDANÇA PADRÃO: Trocamos a importação do axios pela nossa 'api'
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

function NewsForm() {
  
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    titulo: '',
    conteudo: '',
    imagem: '',
    dataCriacao: new Date().toISOString().split('T')[0],
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.titulo || !formData.conteudo || !image) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('titulo', formData.titulo);
    formDataToSend.append('conteudo', formData.conteudo);
    formDataToSend.append('dataCriacao', formData.dataCriacao);
    formDataToSend.append('imagem', image);

    try {
      // 2. MUDANÇA PADRÃO: Usamos 'api.post' e removemos a URL base e os headers
      const response = await api.post('/api/news', formDataToSend);

      setMessage('Notícia criada com sucesso!');
      setError(null);

      setTimeout(() => {
        navigate('/noticias'); 
      }, 1500);
    } catch (err) {
      setError('Erro ao criar notícia. Tente novamente.');
      setMessage(null);
    }

  };

  return (
    <section className='news-form'>
      <Navbar2/>
        <div className='news-form-content'>
          <h2>Criar Notícia</h2>
          
          {message && <p className="success">{message}</p>}
          {error && <p className="error">{error}</p>}
          
          <form className="form-group" onSubmit={handleSubmit}>
            <div className="input-title">
              <label>Título:</label>
              <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} required />
            </div>

            <div className="textarea-content">
              <label>Conteúdo:</label>
              <textarea name="conteudo" value={formData.conteudo} onChange={handleChange} required />
            </div>

            <div className="uploud-img">
              <IoImagesOutline />
              <label>Imagem:</label>
              <input type="file" accept="image/*" onChange={handleImageChange} required />
            </div>
            {preview && (
              <div className="image-preview">
                <p>Pré-visualização:</p>
                <img src={preview} alt="Pré-visualização" />
              </div>
            )}

            <div className="creation-date">
              <label>Data de Criação:</label>
              <input type="date" name="dataCriacao" value={formData.dataCriacao} onChange={handleChange} required />
            </div>

            <Button text="Criar Notícia" type="submit" />

        </form>
      </div>
    </section>
  );
}

export default NewsForm;