import React, { useState, useEffect } from "react";
import './EventosExclusivos.css';
import api from '../../services/api';
import NavbarAdmin from "../../components/Navbar/NavbarAdmin";
import Footer from "../../components/Footer/Footer";
import { Link } from "react-router-dom";

function EventosExclusivos() {
const [eventos, setEventos] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

useEffect(() => {
    const fetchEventos = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get('/Event');

            const fetchedEvents = response.data.data.map(eventoBackend => {
                let imageUrl = '[https://placehold.co/300x200?text=Evento+Sem+Imagem](https://placehold.co/300x200?text=Evento+Sem+Imagem)';
                const imageDetailsArray = eventoBackend.imageDetails || eventoBackend.ImageDetails;
                const primeiraImagem = imageDetailsArray && imageDetailsArray.length > 0 ? imageDetailsArray[0] : null;

                if (primeiraImagem && primeiraImagem.base64 && primeiraImagem.extension) {
                    const extensionWithoutDot = primeiraImagem.extension.startsWith('.')
                        ? primeiraImagem.extension.substring(1)
                        : primeiraImagem.extension;
                    imageUrl = `data:image/${extensionWithoutDot};base64,${primeiraImagem.base64}`;
                }

                return {
                    id: eventoBackend.id,
                    titulo: eventoBackend.name || eventoBackend.Title,
                    conteudo: eventoBackend.description || eventoBackend.Description,
                    imagem: imageUrl, // Usando a URL construída
                    local: eventoBackend.place || eventoBackend.Place,
                    data: eventoBackend.date || eventoBackend.Date,
                    horaInicio: eventoBackend.startTime || eventoBackend.StartTime,
                    horaFim: eventoBackend.endTime || eventoBackend.EndTime,
                    capacidade: eventoBackend.capacity || eventoBackend.Capacity
                };
            });
            setEventos(fetchedEvents);
        } catch (err) {
            console.error("Erro ao buscar eventos:", err);
            setError('Não foi possível carregar os eventos. Tente novamente mais tarde.');
            setEventos([]);
        } finally {
            setLoading(false);
        }
    };

    fetchEventos();
}, []);

return (
    <div className="eventos-exclusivos">
        <NavbarAdmin />
        <div className="eventos-container">
            <h2 className="titulo-eventos">Gerenciar Eventos</h2>
            <div className="grid-eventos">
                {loading ? (
                    <p>Carregando eventos...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : eventos.length > 0 ? (
                    eventos.map((evento) => (
                        <div className="card-evento" key={evento.id}>
                            <img src={evento.imagem} alt={`Imagem do evento ${evento.titulo}`} className="img-evento"
                                 onError={(e) => {
                                     e.target.onerror = null;
                                     e.target.src = '[https://placehold.co/300x200?text=Evento+Sem+Imagem](https://placehold.co/300x200?text=Evento+Sem+Imagem)';
                                 }} />
                            <h3>{evento.titulo}</h3>
                            <p>{evento.conteudo}</p>
                            <p><strong>Local:</strong> {evento.local}</p>
                            <p><strong>Data:</strong> {evento.data ? new Date(evento.data).toLocaleDateString('pt-BR') : 'Data Indisponível'}</p>
                            <p><strong>Horário:</strong> {evento.horaInicio} - {evento.horaFim}</p>
                            <p><strong>Vagas:</strong> {evento.capacidade}</p>
                        </div>
                    ))
                ) : (
                    <p>Nenhum evento exclusivo disponível no momento.</p>
                )}
            </div>
            <Link to="/criarEvento">
                <button className="btn-criar-evento">Criar Novo Evento</button>
            </Link>
            <Link to="/editarEventos">
                <button className="btn-editar-evento">Editar Evento</button>
            </Link>
        </div>
        <Footer />
    </div>
);
}

export default EventosExclusivos;
