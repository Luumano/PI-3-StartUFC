// src/pages/ListaDeFrequencia/ListaDeFrequencia.jsx

import React, { useEffect, useState } from "react";
// Se a página não é mais exclusiva de admin, talvez você queira usar um Navbar padrão
// import Navbar from "../../components/Navbar/Navbar"; 
import NavbarAdmin from "../../components/Navbar/NavbarAdmin"; // Mantido por padrão, mas considere Navbar
import Footer from "../../components/Footer/Footer";
import jsPDF from "jspdf";
import "jspdf-autotable"; 
import './ListaFrequencia.css';
import api from "../../services/api";
import { useAuth } from '../../context/AuthContext'; 
import { useNavigate } from 'react-router-dom'; 

function ListaDeFrequencia() {
    const [eventos, setEventos] = useState([]);
    const [participantes, setParticipantes] = useState([]);
    const [eventoSelecionado, setEventoSelecionado] = useState("");
    const [mensagem, setMensagem] = useState(''); 
    const [isLoadingEvents, setIsLoadingEvents] = useState(false); 
    const [isLoadingParticipants, setIsLoadingParticipants] = useState(false); 

    const { user, loading: loadingAuth, logout } = useAuth(); 
    const navigate = useNavigate();

    // Função para buscar os eventos
    const fetchEventos = async () => {
        setIsLoadingEvents(true);
        setMensagem('Carregando eventos...'); 
        try {
            // *** MUDANÇA AQUI: /Event para /events ***
            const res = await api.get("/Event"); 
            setEventos(res.data.data || res.data); 
            setMensagem(''); 
        } catch (err) {
            console.error("Erro ao buscar eventos:", err);
            if (err.response) {
                if (err.response.status === 401) {
                    setMensagem("Sessão expirada ou não autorizado. Redirecionando para o login...");
                    logout(); 
                    // Se o login de admin for uma rota separada, mantenha, caso contrário mude para '/login'
                    setTimeout(() => navigate('/loginAdmin'), 2000); 
                } else if (err.response.status === 403) {
                    setMensagem("Acesso negado para buscar eventos. Redirecionando...");
                    setTimeout(() => navigate('/'), 2000); 
                } else {
                    setMensagem(`Erro ao carregar eventos: ${err.response.data.message || 'Erro desconhecido.'}`);
                }
            } else {
                setMensagem("Erro de rede ou servidor. Verifique sua conexão.");
            }
        } finally {
            setIsLoadingEvents(false);
        }
    };

    // Função para buscar os participantes de um evento
    const buscarParticipantes = async (id) => {
        if (!id) {
            setParticipantes([]);
            setEventoSelecionado("");
            setMensagem("Selecione um evento para ver os participantes.");
            return;
        }

        setEventoSelecionado(id);
        setIsLoadingParticipants(true);
        setMensagem('Carregando participantes...'); 
        try {
            // *** MUDANÇA AQUI: /Event para /events ***
            const res = await api.get(`/Event/${id}/participants`); 
            setParticipantes(res.data.data || res.data); 
            setMensagem('');
        } catch (err) {
            console.error("Erro ao buscar participantes:", err);
            if (err.response) {
                if (err.response.status === 401) {
                    setMensagem("Sessão expirada ou não autorizado. Redirecionando para o login...");
                    logout(); 
                    // Se o login de admin for uma rota separada, mantenha, caso contrário mude para '/login'
                    setTimeout(() => navigate('/loginAdmin'), 2000);
                } else if (err.response.status === 403) {
                    setMensagem("Acesso negado para buscar participantes. Redirecionando...");
                    setTimeout(() => navigate('/'), 2000);
                } else {
                    setMensagem(`Erro ao carregar participantes: ${err.response.data.message || 'Erro desconhecido.'}`);
                }
            } else {
                setMensagem("Erro de rede ou servidor. Verifique sua conexão.");
            }
            setParticipantes([]); 
        } finally {
            setIsLoadingParticipants(false);
        }
    };

    useEffect(() => {
        if (loadingAuth) {
            setMensagem("Verificando credenciais...");
            return; 
        }

        if (!user) { 
            console.log("Usuário não está logado. Redirecionando...", user);
            setMensagem("Você precisa estar logado para acessar esta página. Redirecionando para o login...");
            setTimeout(() => {
                logout(); 
                // Se o login de admin for uma rota separada, mantenha, caso contrário mude para '/login'
                navigate('/loginAdmin'); 
            }, 2000);
            return;
        }

        fetchEventos();

    }, [user, loadingAuth, navigate, logout]); 

    const exportarPDF = () => {
        const doc = new jsPDF();
        const eventoAtual = eventos.find(e => e.id === eventoSelecionado);
        const tituloEvento = eventoAtual ? (eventoAtual.Title || eventoAtual.title || eventoAtual.titulo) : "Lista de Frequência"; 

        doc.text(`Lista de Frequência - ${tituloEvento}`, 14, 20);
        doc.autoTable({
            startY: 30,
            head: [["Nome", "Email", "CPF"]],
            body: participantes.map(p => [p.name || p.nome, p.email, p.cpf]) 
        });
        doc.save(`lista_frequencia_${tituloEvento.replace(/\s/g, '_')}.pdf`); 
    };

    if (loadingAuth || !user) { 
        return (
            <div className="lista-frequencia">
                <NavbarAdmin/> 
                <div className="conteudo">
                    <h2>Lista de Frequência</h2>
                    <p className="mensagem">{mensagem}</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="lista-frequencia">
            <NavbarAdmin /> 
            <div className="conteudo">
                <h2>Lista de Frequência</h2>

                {mensagem && (
                    <p className={`mensagem ${mensagem.includes('Erro:') || mensagem.includes('negado') || mensagem.includes('expirada') ? 'error' : 'success'}`}>
                        {mensagem}
                    </p>
                )}

                {isLoadingEvents ? (
                    <p>Carregando eventos...</p>
                ) : (
                    <select onChange={(e) => buscarParticipantes(e.target.value)} value={eventoSelecionado}>
                        <option value="">Selecione um evento</option>
                        {eventos.length > 0 ? (
                            eventos.map(ev => (
                                <option key={ev.id} value={ev.id}>{ev.Title || ev.title || ev.titulo}</option> 
                            ))
                        ) : (
                            <option value="" disabled>Nenhum evento encontrado.</option>
                        )}
                    </select>
                )}

                {isLoadingParticipants ? (
                    <p>Carregando participantes...</p>
                ) : participantes.length > 0 ? (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Email</th>
                                    <th>CPF</th>
                                </tr>
                            </thead>
                            <tbody>
                                {participantes.map((p, idx) => (
                                    <tr key={idx}>
                                        <td>{p.name || p.nome}</td> 
                                        <td>{p.email}</td>
                                        <td>{p.cpf}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button onClick={exportarPDF} className="botao-download-pdf">Baixar PDF</button>
                    </>
                ) : eventoSelecionado && !isLoadingParticipants && (
                    <p className="mensagem">Nenhum participante inscrito para este evento.</p>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default ListaDeFrequencia;