import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./NewsDetail.css";
import Button from "../../components/Button/Button";
import Navbar2 from "../../components/Navbar2/Navbar2";
import Footer from "../../components/Footer/Footer";

const NewsDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNewsDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                // CORREÇÃO 1: Endpoint da API ajustado para '/news/{id}' para evitar URL duplicada.
                const response = await api.get(`/news/${id}`);
                
                // MUDANÇA: Verifica se a resposta contém dados e atualiza o estado
                if (response.data) {
                    setNews(response.data);
                } else {
                    setNews(null);
                }

            } catch (error) {
                console.error("Erro ao carregar a notícia:", error);
                setError("Não foi possível carregar a notícia. Tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        };
        fetchNewsDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="news-detail-container">
                <div className="loading">Carregando notícia...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="news-detail-container">
                <div className="error">{error}</div>
            </div>
        );
    }
    
    // CORREÇÃO 2: Caso a API não retorne dados, exibe "não encontrada"
    if (!news) {
        return (
            <div className="news-detail-container">
                <div className="no-news">Notícia não encontrada.</div>
            </div>
        );
    }

    return (
        <section className="details">
            <Navbar2/>
            <div className="news-detail">
                {/* CORREÇÃO 3: Nomes das propriedades ajustados para corresponder ao NewsList.jsx */}
                <h1>{news.title}</h1>
                <p className="meta">{new Date(news.createdAt).toLocaleDateString()}</p>
                <div className="image-public">
                    <img src={news.imgURL} alt={news.title} className="news-image" />
                </div>
                <p>{news.content}</p>
                <div className="btn-more">
                    {/* CORREÇÃO 4: Texto e rota do botão ajustados para 'Voltar para notícias' */}
                    <Button text="Voltar para notícias" color="green" onClick={() => navigate("/noticias")} />
                </div>
            </div>
            <Footer/>
        </section>
    );
};

export default NewsDetail;