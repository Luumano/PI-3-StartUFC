import React, { useEffect, useState } from "react";
import "./EditarEventos.css";
import api from "../../services/api";
import NavbarAdmin from "../../components/Navbar/NavbarAdmin";
import Footer from "../../components/Footer/Footer";
import { useAuth } from '../../context/AuthContext';

function EditarEventos() {
    const [eventos, setEventos] = useState([]);
    const [mensagem, setMensagem] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete api.defaults.headers.common['Authorization'];
            setMensagem("Você não está autenticado. Faça login para acessar.");
        }
    }, [user]);

    useEffect(() => {
        if (localStorage.getItem('authToken')) {
            fetchEventos();
        } else {
            setMensagem("Faça login para ver e editar os eventos.");
            setLoading(false);
        }
    }, [user]);

    const fetchEventos = async () => {
        setLoading(true);
        setError(false);
        setMensagem('');
        try {
            const response = await api.get("/Event");
            const fetchedEvents = Array.isArray(response.data.data) ? response.data.data : [];
            
            const formattedEvents = fetchedEvents.map(eventoBackend => {
                const formattedStartTime = eventoBackend.startTime ? eventoBackend.startTime.substring(0, 5) : '';
                const formattedEndTime = eventoBackend.endTime ? eventoBackend.endTime.substring(0, 5) : '';
                const formattedDate = eventoBackend.date;

                let displayImageUrl = 'https://placehold.co/150x150?text=Sem+Imagem';
                let currentImageDetails = eventoBackend.imageDetails || [];

                if (currentImageDetails.length > 0 && currentImageDetails[0].base64 && currentImageDetails[0].extension) {
                    const base64 = currentImageDetails[0].base64;
                    // AQUI: A extensão do backend já vem com o ponto, então não precisamos adicionar
                    const extension = currentImageDetails[0].extension.replace('.', '');
                    displayImageUrl = `data:image/${extension};base64,${base64}`;
                }

                return {
                    id: eventoBackend.id,
                    name: eventoBackend.name,
                    description: eventoBackend.description,
                    place: eventoBackend.place,
                    date: formattedDate,
                    startTime: formattedStartTime,
                    endTime: formattedEndTime,
                    capacity: eventoBackend.capacity,
                    userId: eventoBackend.creationUserId,
                    imageDetails: currentImageDetails,
                    displayUrl: displayImageUrl
                };
            });
            setEventos(formattedEvents);
            if (formattedEvents.length === 0) {
                setMensagem("Nenhum evento encontrado. Crie um novo evento.");
                setError(false);
            }
        } catch (err) {
            console.error("Erro ao buscar eventos:", err);
            setMensagem("Erro ao carregar eventos. Verifique sua conexão ou autenticação.");
            setError(true);
            setEventos([]);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (id, field, value) => {
        setEventos((prev) =>
            prev.map((ev) =>
                ev.id === id ? { ...ev, [field]: value } : ev
            )
        );
    };

    const handleImageFileChange = (id, file) => {
        if (!file) {
            setEventos((prev) =>
                prev.map((item) =>
                    item.id === id
                        ? {
                            ...item,
                            imageDetails: [],
                            displayUrl: 'https://placehold.co/150x150?text=Sem+Imagem'
                        }
                        : item
                )
            );
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            try {
                const base64String = reader.result;
                const parts = base64String.split(';');
                const mimeType = parts[0].split(':')[1];
                const extensionWithoutDot = mimeType.split('/')[1];
                const base64Data = parts[1].split(',')[1];
                
                // CORREÇÃO AQUI: Adiciona o ponto antes da extensão
                const extensionWithDot = `.${extensionWithoutDot}`;

                const newImageDetails = [{ base64: base64Data, extension: extensionWithDot }];
                const newDisplayUrl = `data:${mimeType};base64,${base64Data}`;
                
                console.log('Nova imagem convertida para Base64 e URL:');
                console.log('Base64:', base64Data.substring(0, 30) + '...');
                console.log('Extension:', extensionWithDot);
                console.log('Display URL:', newDisplayUrl.substring(0, 50) + '...');

                setEventos((prev) =>
                    prev.map((item) =>
                        item.id === id
                            ? {
                                ...item,
                                imageDetails: newImageDetails,
                                displayUrl: newDisplayUrl
                            }
                            : item
                    )
                );
            } catch (e) {
                console.error("Erro ao processar o arquivo de imagem:", e);
                setMensagem("Erro ao carregar a imagem. Tente outro arquivo.");
                setError(true);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSalvar = async (id) => {
        const eventoToSave = eventos.find((e) => e.id === id);
        if (!eventoToSave) {
            setMensagem("Erro: Evento não encontrado para salvar.");
            setError(true);
            return;
        }

        const currentUserId = eventoToSave.userId || (user ? (user.nameid || user.sub) : null);
        if (!currentUserId) {
            setMensagem("Erro: ID do usuário não disponível. Faça login novamente.");
            setError(true);
            return;
        }

        const payload = {
            Id: eventoToSave.id,
            Name: eventoToSave.name,
            Description: eventoToSave.description,
            Place: eventoToSave.place,
            StartTime: eventoToSave.startTime,
            EndTime: eventoToSave.endTime,
            Date: eventoToSave.date,
            Capacity: parseInt(eventoToSave.capacity, 10),
            ImageDetails: eventoToSave.imageDetails,
            UserId: currentUserId
        };
        
        console.log("Payload enviado para a API (Salvar Evento):", JSON.stringify(payload, null, 2));

        try {
            await api.put(`/Event`, payload);
            setMensagem("Evento salvo com sucesso!");
            setError(false);
            fetchEventos();
        } catch (err) {
            console.error("Erro ao salvar evento:", err);
            if (err.response && err.response.data) {
                console.error('Detalhes do erro do backend:', JSON.stringify(err.response.data, null, 2));
                setMensagem(err.response.data.message || 'Erro ao salvar evento.');
            } else {
                setMensagem("Erro ao salvar evento. Verifique os dados e tente novamente.");
            }
            setError(true);
        }
    };

    const handleExcluir = async (id) => {
        const confirmDelete = window.confirm("Tem certeza que deseja excluir este evento?");
        if (!confirmDelete) return;

        try {
            await api.delete(`/Event/${id}`);
            setEventos((prev) => prev.filter((e) => e.id !== id));
            setMensagem("Evento excluído com sucesso!");
            setError(false);
        } catch (err) {
            console.error("Erro ao excluir evento:", err);
            if (err.response && err.response.data) {
                console.error('Detalhes do erro do backend:', JSON.stringify(err.response.data, null, 2));
                setMensagem(err.response.data.message || 'Erro ao excluir evento.');
            } else {
                setMensagem("Erro ao excluir evento. Tente novamente.");
            }
            setError(true);
        }
    };

    return (
        <div className="editar-eventos">
            <NavbarAdmin />
            <div className="container-editar">
                <h2>Editar Eventos</h2>
                {mensagem && <p className={`mensagem ${error ? 'error' : 'success'}`}>{mensagem}</p>}
                
                {loading ? (
                    <p className="no-events">Carregando eventos...</p>
                ) : eventos.length > 0 ? (
                    <div className="grid-cards">
                        {eventos.map((evento) => (
                            <div className="card" key={evento.id}>
                                <img src={evento.displayUrl} alt={evento.name} className="img-evento" />
                                
                                <label htmlFor={`name-${evento.id}`}>Título:</label>
                                <input
                                    id={`name-${evento.id}`}
                                    type="text"
                                    value={evento.name}
                                    onChange={(e) => handleChange(evento.id, "name", e.target.value)}
                                />
                                
                                <label htmlFor={`description-${evento.id}`}>Descrição:</label>
                                <textarea
                                    id={`description-${evento.id}`}
                                    rows="4"
                                    value={evento.description}
                                    onChange={(e) => handleChange(evento.id, "description", e.target.value)}
                                />

                                <label htmlFor={`place-${evento.id}`}>Local:</label>
                                <input
                                    id={`place-${evento.id}`}
                                    type="text"
                                    value={evento.place}
                                    onChange={(e) => handleChange(evento.id, "place", e.target.value)}
                                />

                                <label htmlFor={`date-${evento.id}`}>Data:</label>
                                <input
                                    id={`date-${evento.id}`}
                                    type="date"
                                    value={evento.date}
                                    onChange={(e) => handleChange(evento.id, "date", e.target.value)}
                                />

                                <label htmlFor={`startTime-${evento.id}`}>Hora de Início:</label>
                                <input
                                    id={`startTime-${evento.id}`}
                                    type="time"
                                    value={evento.startTime}
                                    onChange={(e) => handleChange(evento.id, "startTime", e.target.value)}
                                />

                                <label htmlFor={`endTime-${evento.id}`}>Hora de Fim:</label>
                                <input
                                    id={`endTime-${evento.id}`}
                                    type="time"
                                    value={evento.endTime}
                                    onChange={(e) => handleChange(evento.id, "endTime", e.target.value)}
                                />

                                <label htmlFor={`capacity-${evento.id}`}>Capacidade:</label>
                                <input
                                    id={`capacity-${evento.id}`}
                                    type="number"
                                    value={evento.capacity}
                                    onChange={(e) => handleChange(evento.id, "capacity", e.target.value)}
                                    min="1"
                                />

                                <label htmlFor={`image-${evento.id}`}>Alterar Imagem:</label>
                                <input
                                    id={`image-${evento.id}`}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageFileChange(evento.id, e.target.files[0])}
                                />

                                <div className="card-buttons">
                                    <button className="salvar" onClick={() => handleSalvar(evento.id)}>
                                        Salvar
                                    </button>
                                    <button className="excluir" onClick={() => handleExcluir(evento.id)}>
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-events">{!mensagem && "Nenhum evento para editar no momento."}</p>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default EditarEventos;