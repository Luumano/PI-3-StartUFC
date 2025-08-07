import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom'; 
import './Inscricao.css';
import Navbar2 from "../../components/Navbar2/Navbar2";
import Footer from "../../components/Footer/Footer";
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Inscricao = () => {
    const { id: eventIdFromUrl } = useParams(); 
    const navigate = useNavigate();
    const { user } = useAuth();

    const [events, setEvents] = useState([]);
    const [selectedEvents, setSelectedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const response = await api.get('/event');
                
                if (response.data && Array.isArray(response.data.data)) {
                    const hoje = new Date();
                    hoje.setHours(0, 0, 0, 0);

                    const eventosFuturos = response.data.data.filter(e => new Date(e.date) >= hoje);
                    setEvents(eventosFuturos);

                    if (eventIdFromUrl) {
                        const idNumerico = parseInt(eventIdFromUrl, 10);
                        if (eventosFuturos.some(e => e.id === idNumerico)) {
                            setSelectedEvents([idNumerico]);
                        }
                    }
                } else {
                    setEvents([]);
                }
            } catch (err) {
                setError("Não foi possível carregar os eventos.");
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [eventIdFromUrl]);

    const handleCheckboxChange = (eventId) => {
        setSelectedEvents(prevSelected =>
            prevSelected.includes(eventId)
                ? prevSelected.filter(id => id !== eventId)
                : [...prevSelected, eventId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user) {
            alert('Você precisa estar logado para se inscrever.');
            navigate('/login');
            return;
        }

        if (selectedEvents.length === 0) {
            setError('Selecione pelo menos um evento para se inscrever.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        const userId = user?.nameid || user?.sub; 
        if (!userId) {
            setError("Não foi possível identificar o usuário. Faça login novamente.");
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('authToken');

        if (!token) {
            setError("Sua sessão expirou. Por favor, faça login novamente.");
            setLoading(false);
            navigate('/login');
            return;
        }

        
        const inscricaoPromises = selectedEvents.map(eventId => {
           
            const inscricaoData = {
                userId: parseInt(userId, 10),
                eventId: eventId
            };

            
            return api.post(
                '/event/signup', // A URL fica "limpa"
                inscricaoData,   // Os dados vão aqui
                { 
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
        });
        
        try {
            await Promise.all(inscricaoPromises);
            setSuccess('Inscrição(ões) realizada(s) com sucesso!');
            setTimeout(() => navigate('/perfil'), 2000); 
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError("Você não tem autorização. Faça login novamente.");
            } else {
                
                const errorMessage = err.response?.data?.message || 'Erro ao realizar uma ou mais inscrições.';
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper">
            <Navbar2 />
            <div className="content-wrapper">
                <div className="page-container">
                    <header className="page-header">
                        <img src="/src/assets/StartUFC-logo.svg" alt="StartUFC Logo" className="page-logo" />
                    </header>
                    <main className="main-content">
                        
                        <div className="options-menu">
                            <Link to="/inscricao" className="option-link active">
                                <span className="icon-edit"></span> Inscreva-se
                            </Link>
                            <Link to="/eventos" className="option-link">
                                <span className="icon-list"></span> Programação
                            </Link>
                        </div>

                        <form onSubmit={handleSubmit} className="form-box">
                            {loading && <p>Carregando eventos...</p>}
                            
                            {!loading && events.length > 0 && events.map(event => (
                                <div key={event.id} className="event-item">
                                    <input
                                        type="checkbox"
                                        id={`event-${event.id}`}
                                        className="event-checkbox"
                                        onChange={() => handleCheckboxChange(event.id)}
                                        checked={selectedEvents.includes(event.id)}
                                    />
                                    <label htmlFor={`event-${event.id}`} className="event-label">
                                        <div className="event-details">
                                            <span className="event-time">{new Date(event.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} / {event.startTime.substring(0, 5)}h</span>
                                            <span className="event-name">{event.name}</span>
                                        </div>
                                        <span className="event-vacancies">{event.capacity} vagas</span>
                                    </label>
                                </div>
                            ))}

                            {!loading && events.length === 0 && !error && <p>Nenhum evento disponível para inscrição no momento.</p>}
                            
                            {error && <p className="message error-message">{error}</p>}
                            {success && <p className="message success-message">{success}</p>}
                            
                            <button type="submit" className="submit-btn" disabled={loading || selectedEvents.length === 0}>
                                <span className="icon-check"></span>
                                {loading ? 'Inscrevendo...' : 'Confirmar Inscrição'}
                            </button>
                        </form>
                    </main>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Inscricao;