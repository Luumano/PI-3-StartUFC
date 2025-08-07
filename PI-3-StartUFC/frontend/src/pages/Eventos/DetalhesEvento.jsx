import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import './DetalhesEvento.css'; 

import Footer from '../../components/Footer/Footer';
import Navbar2 from '../../components/Navbar2/Navbar2';
import Button from '../../components/Button/Button';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const DetalhesEvento = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [evento, setEvento] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEvento = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/event/${id}`);
                if (response.data && response.data.success) {
                    setEvento(response.data.data);
                } else {
                    setError("Evento não encontrado.");
                }
            } catch (err) {
                setError("Evento não encontrado ou erro ao carregar.");
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchEvento();
    }, [id]);

    const formatTime = (timeString) => timeString ? timeString.substring(0, 5) : '';

    if (loading) return <div>Carregando...</div>;
    if (error || !evento) return <div>{error || "Evento não encontrado"} <Link to="/eventos">Voltar</Link></div>;

    return (
        <div className="pagina-detalhes-evento">
            <Navbar2 />
            <header className="evento-banner" style={{ backgroundImage: `url(https://placehold.co/1200x400/a7e5d5/333333?text=${encodeURIComponent(evento.name)})` }}>
                <div className="evento-banner-overlay">
                    <h1 className="evento-titulo-principal">{evento.name}</h1>
                </div>
            </header>
            <main className="evento-conteudo-wrapper">
                <section className="evento-descricao-main">
                    <h2>Sobre o Evento</h2>
                    <div dangerouslySetInnerHTML={{ __html: evento.description }} />
                </section>
                <aside className="evento-info-sidebar">
                    <div className="info-card">
                        <h3>Detalhes</h3>
                        <div className="info-item">
                            <FaCalendarAlt className="info-icon" />
                            <span>{new Date(evento.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
                        </div>
                        <div className="info-item">
                            <FaClock className="info-icon" />
                            <span>{formatTime(evento.startTime)} - {formatTime(evento.endTime)}</span>
                        </div>
                        <div className="info-item">
                            <FaMapMarkerAlt className="info-icon" />
                            <span>{evento.place}</span>
                        </div>
                        <div className="detalhe-evento-cta">
                           {user && (
                             // O botão agora é um LINK para a página de inscrição, passando o ID do evento
                             <Link to={`/inscricaoevento/${evento.id}`} className="evento-cta-link"> 
                               <Button text="Inscreva-se" color="green" />
                             </Link>
                           )}
                           {!user && <p>Faça login para se inscrever.</p>}
                        </div>
                    </div>
                </aside>
            </main>
            <Footer />
        </div>
    );
};

export default DetalhesEvento;
