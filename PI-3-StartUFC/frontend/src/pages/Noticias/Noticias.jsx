import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import './Noticias.css';
import Navbar2 from '../../components/Navbar2/Navbar2';
import Footer from '../../components/Footer/Footer';

function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function carregarNoticias() {
      try {
        const response = await api.get('/News');
        const fetchedNews = response.data.data || response.data;

        // Filtra notícias com ID inválido (null, undefined ou 0)
        const noticiasComIdValido = fetchedNews.filter(n => (n.id || n.Id) > 0);
        
        // Ordena as notícias por data de criação (mais recente primeiro)
        const sortedNews = noticiasComIdValido.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.CreatedDate || a.dataCriacao);
          const dateB = new Date(b.createdAt || b.CreatedDate || b.dataCriacao);
          return dateB - dateA;
        });

        const mappedNews = sortedNews.map(noticiaBackend => {
          const imageDetailsArray = noticiaBackend.imageDetails || noticiaBackend.ImageDetails;
          const primeiraImagem = imageDetailsArray && imageDetailsArray.length > 0 ? imageDetailsArray[0] : null;
          
          let imageUrl = 'https://via.placeholder.com/400x250?text=Sem+Imagem';

          if (primeiraImagem && primeiraImagem.base64 && primeiraImagem.extension) {
            const extensionWithoutDot = primeiraImagem.extension.startsWith('.')
              ? primeiraImagem.extension.substring(1)
              : primeiraImagem.extension;
            imageUrl = `data:image/${extensionWithoutDot};base64,${primeiraImagem.base64}`;
          }

          return {
            id: noticiaBackend.id || noticiaBackend.Id,
            title: noticiaBackend.title || noticiaBackend.Title || 'Título Desconhecido',
            content: noticiaBackend.content || noticiaBackend.Content || 'Nenhum conteúdo disponível.',
            imgURL: imageUrl,
            createdAt: noticiaBackend.createdAt
          };
        });

        setNoticias(mappedNews);
      } catch (err) {
        console.error("Ocorreu um erro ao buscar as notícias:", err);
        setError("Não foi possível carregar as notícias. Por favor, tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    }
    carregarNoticias();
  }, []);

  if (loading) {
    return <p className="loading">Carregando notícias...</p>;
  }

  if (error) {
    return <p className="no-news">{error}</p>;
  }

  return (
    <div className="noticias-page-background">
      <Navbar2 />

      <div className="noticias-container">
        <div className="header-noticias">
          <h1 className="title-noticias">Últimas Notícias</h1>
        </div>

        {noticias && noticias.length > 0 ? (
          <div className="noticias-grid">
            {noticias.map(noticia => (
              <Link to={`/noticiasDetalhadas/${noticia.id}`} className="news-card-link-wrapper" key={noticia.id}>
                <div className="news-card">
                  <img
                    src={noticia.imgURL}
                    alt={noticia.title}
                    className="news-card-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x250?text=Sem+Imagem';
                    }}
                  />
                  <div className="news-card-content">
                    <h2 className="news-card-title">{noticia.title}</h2>
                    <p className="news-card-date">
                      {noticia.createdAt ? `Publicado em: ${new Date(noticia.createdAt).toLocaleDateString()}` : ''}
                    </p>
                    <p className="news-card-text">
                      {noticia.content ?
                        (noticia.content.length > 150 ? noticia.content.substring(0, 150) + '...' : noticia.content)
                        : 'Conteúdo indisponível.'}
                    </p>
                    <span className="news-card-read-more">Ler mais</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="no-news">Nenhuma notícia encontrada.</p>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Noticias;