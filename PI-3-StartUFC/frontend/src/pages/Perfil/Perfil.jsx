import React, { useEffect, useState } from "react";
import './Perfil.css';
import seta from '../../assets/seta2.png';
import logo from '../../assets/StartUFC-logo-verde.png';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Perfil = () => {
    const { user, logout } = useAuth();
    
    const [userDetails, setUserDetails] = useState(null);
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchProfileData = async () => {
            try {
                const userId = user.nameid || user.sub;

                
                const [userResponse, eventosResponse] = await Promise.all([
                    api.get(`/user/${userId}`),
                    api.get(`/event/user-events/${userId}`) 
                ]);
                
                if (userResponse.data?.data) {
                    setUserDetails(userResponse.data.data);
                }

                if (eventosResponse.data?.data?.eventList) {
                    setEventos(eventosResponse.data.data.eventList);
                } else {
                    setEventos([]);
                }

            } catch (err) {
                console.error("Erro ao buscar dados do perfil:", err);
                setError("Não foi possível carregar os dados do perfil.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleDeleteAccount = async () => {
        if (confirm("Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.")) {
            try {
                const userId = user.nameid || user.sub;
                await api.delete(`/user/${userId}`);
                handleLogout(); 
            } catch (err) {
                console.error("Erro ao excluir conta:", err);
                setError("Não foi possível excluir a conta. Tente novamente.");
            }
        }
    };

    if (loading) {
        return <div className="loading">Carregando perfil...</div>;
    }

    if (error) {
        return <div className="no-news">{error}</div>;
    }

    return (
        <>
            <div className="Nav">
             <Link to="/">
              <img src={seta} alt="Voltar" className="seta" />
             </Link>
             <div className="nav-center">
             <img src={logo} alt="logo" className="logo" />
             </div>
            </div>
            <div className="Nav1"></div>
            <div className="perfil-container">
                <h2>Perfil do Usuário</h2>
                <div className="traco1"></div>
                {userDetails ? (
                    <>
                        <img src={userDetails.foto || 'https://placehold.co/150x150/a7e5d5/333333?text=Perfil'} alt="Foto do usuário" className="foto-perfil" />
                        <p><strong>Nome:</strong> {userDetails.name}</p>
                        <p><strong>Email:</strong> {userDetails.email}</p>
                        <p><strong>CPF:</strong> {userDetails.cpf || 'Não informado'}</p>
                        <p><strong>Telefone:</strong> {userDetails.phone || 'Não informado'}</p>
                        
                        <div className="traco2"></div>
                        <h3 className="config">Eventos Cadastrados</h3>
                        
                        {eventos.length > 0 ? (
                            <ul className="eventos-lista">
                                {eventos.map(event => (
                                    <li key={event.id}>
                                        <strong>{event.name}</strong> - {new Date(event.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Você não está cadastrado em nenhum evento.</p>
                        )}
                        <h3 className="config">Configurações</h3>
                        <div className="botoes">
                            <Link to="/editar-perfil">
                                <button className="edit1">Editar Perfil</button>
                            </Link>
                            <button className="exclu" onClick={handleDeleteAccount}>Excluir Conta</button>
                            <button className="sair" onClick={handleLogout}>Sair</button>
                        </div>
                    </>
                ) : (
                    <p>Não foi possível carregar os dados do usuário.</p>
                )}
            </div>
        </>
    );
};

export default Perfil;