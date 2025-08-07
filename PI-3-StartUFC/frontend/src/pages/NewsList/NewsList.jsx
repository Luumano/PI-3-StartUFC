import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './NewsList.css';
import Button from '../../components/Button/Button';

const NewsList = () => {
    const navigate = useNavigate();
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                const response = await api.get('/news');

                if (response.data && Array.isArray(response.data.data)) {
                    let dados = response.data.data;

                    // Lógica de ordenação pela data de criação
                    const dadosOrdenados = dados.slice().sort((a, b) => {
                        const dateA = new Date(a.createdAt);
                        const dateB = new Date(b.createdAt);
                        return dateB - dateA;
                    });
                    
                    setNewsList(dadosOrdenados);
                } else {
                    console.error("Erro: Os dados recebidos da API não são um array!", response.data);
                    setNewsList([]);
                }
            } catch (err) {
                console.error('Erro ao carregar as notícias:', err);
                setError('Não foi possível carregar as notícias.');
                setNewsList([]);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    return (
        <section className="news-section-container" id='news-id'>
            <div className="news-header">
                <h1 className='news-title'>Últimas Notícias</h1>
                <div className="decorative-dots">
                    <span className="dot"></span>
                    <span className="dot dark"></span>
                    <span className="dot dark"></span>
                </div>
            </div>

            {loading ? (
                <div className="loading">Carregando notícias...</div>
            ) : error ? (
                <div className="no-news">{error}</div>
            ) : newsList.length === 0 ? (
                <div className="no-news">Nenhuma notícia encontrada.</div>
            ) : (
                <>
                    <div className='news-grid'>
                        {newsList.slice(0, 3).map((news) => {
                            // CORREÇÃO: Criamos a URL da imagem em Base64
                            const imageDetails = news.imageDetails && news.imageDetails[0];
                            const imageUrl = imageDetails && imageDetails.base64 && imageDetails.extension
                                ? `data:image/${imageDetails.extension.replace('.', '')};base64,${imageDetails.base64}`
                                : 'https://placehold.co/600x400/a7e5d5/333333?text=Sem+Imagem';
                            
                            return (
                                <div key={news.id} className="news-card">
                                    <img src={imageUrl} alt={news.title} className="news-image" />
                                    <div className="card-content">
                                        <h3>{news.title}</h3>
                                        <p>{`${news.content.substring(0, 150)}...`}</p>
                                        <Link to={`/noticiasDetalhadas/${news.id}`}>
                                            <button className="ler-mais-btn">Ler mais</button>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className='all-news-button-container'>
                        <Button text="Ir para notícias" color="green" onClick={() => navigate('/noticias')} />
                    </div>
                </>
            )}
        </section>
    );
};

export default NewsList;