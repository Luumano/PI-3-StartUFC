import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api'; 
import './NoticiasDetalhadas.css'; 
import Navbar2 from '../../components/Navbar2/Navbar2'; 
import Footer from '../../components/Footer/Footer';

function NoticiaDetalhadas() {
  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); 
  const { id } = useParams();

  useEffect(() => {
    const fetchNoticia = async () => {
      try {
        setLoading(true);
        setError('');

        // Verifica se o ID é válido antes de fazer a requisição
        if (!id || id === 'undefined') {
          setError("ID da notícia não fornecido na URL.");
          setLoading(false);
          return;
        }

        const response = await api.get(`/News/${id}`); 
        const newsData = response.data.data || response.data;

        // --- LÓGICA CORRIGIDA PARA LER A IMAGEM BASE64 DO ARRAY imageDetails ---
        const imageDetailsArray = newsData.imageDetails || newsData.ImageDetails;
        const primeiraImagem = imageDetailsArray && imageDetailsArray.length > 0 ? imageDetailsArray[0] : null;
        
        let finalImageUrl = 'https://via.placeholder.com/800x500?text=Imagem+N%C3%A3o+Dispon%C3%ADvel';

        if (primeiraImagem && primeiraImagem.base64 && primeiraImagem.extension) {
          const extensionWithoutDot = primeiraImagem.extension.startsWith('.')
            ? primeiraImagem.extension.substring(1)
            : primeiraImagem.extension;
          finalImageUrl = `data:image/${extensionWithoutDot};base64,${primeiraImagem.base64}`;
        }
        // ------------------------------------------------------------------------

        setNoticia({
          id: newsData.id || newsData.Id,
          titulo: newsData.title || newsData.Title || 'Sem Título',
          conteudo: newsData.content || newsData.Content || 'Nenhum conteúdo disponível.',
          dataCriacao: newsData.createdAt || newsData.CreatedAt || new Date().toISOString(),
          imageUrl: finalImageUrl
        });

      } catch (err) {
        console.error("Erro ao carregar a notícia:", err.response ? err.response.data : err.message);
        if (err.response && err.response.status === 404) {
          setError("A notícia que você está procurando não foi encontrada.");
        } else {
          setError("Não foi possível carregar a notícia. Ocorreu um problema ao acessar o conteúdo."); 
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNoticia();
  }, [id]); // A dependência [id] está correta aqui

  if (loading) {
    return (
      <div className="noticia-detalhada-page">
        <Navbar2 />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Carregando notícia...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="noticia-detalhada-page">
        <Navbar2 />
        <div className="error-message-container">
          <h2>Erro</h2>
          <p>{error}</p>
          <Link to="/noticias" className="btn-back-to-news">Voltar para Notícias</Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (!noticia) { 
    return (
      <div className="noticia-detalhada-page">
        <Navbar2 />
        <div className="no-news-message-container">
          <h2>Notícia não encontrada</h2>
          <p>Não foi possível encontrar os detalhes para esta notícia.</p>
          <Link to="/noticias" className="btn-back-to-news">Voltar para Notícias</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className='noticia-detalhada-page'>
      <Navbar2 />
      <main className='noticia-detalhada-container'>
        <div className="header-detalhes">
          <Link to="/noticias" className="back-arrow-detalhes">←</Link>
          <p>Notícias</p>
        </div>
        <article className="noticia-article">
          <h1 className="noticia-titulo">{noticia.titulo}</h1>
          <p className="noticia-data">
            {noticia.dataCriacao ? 
             new Date(noticia.dataCriacao).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
             : 'Data não disponível'}
          </p>
          <div className="image-wrapper">
            <div className="dots dots-left"></div>
            <img 
              src={noticia.imageUrl} 
              alt={noticia.titulo} 
              className="noticia-imagem-principal" 
              onError={(e) => { 
                e.target.onerror = null; 
                e.target.src = 'https://via.placeholder.com/800x500?text=Imagem+N%C3%A3o+Dispon%C3%ADvel'; 
              }}
            />
            <div className="dots dots-right"></div>
          </div>
          <div className="noticia-corpo">
            {noticia.conteudo ? (
              noticia.conteudo.split('\n').map((paragrafo, index) => (
                <p key={index}>{paragrafo}</p>
              ))
            ) : (
              <p>Conteúdo da notícia não disponível.</p>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

export default NoticiaDetalhadas;