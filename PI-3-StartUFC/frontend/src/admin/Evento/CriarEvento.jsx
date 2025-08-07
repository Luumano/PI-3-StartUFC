import React, { useState, useEffect } from "react";
import api from '../../services/api';
import './CriarEvento.css';
import StartUFC from '../../assets/StartUFC-logo.png';
import Navbar2 from "../../components/Navbar/NavbarAdmin";
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function CriarEvento() {
    const [titulo, setTitulo] = useState('');
    const [conteudo, setConteudo] = useState('');
    const [imagem, setImagem] = useState(null);
    const [local, setLocal] = useState('');
    const [dataHoraInicio, setDataHoraInicio] = useState('');
    const [dataHoraFim, setDataHoraFim] = useState('');
    const [capacidade, setCapacidade] = useState('');
    const [mensagem, setMensagem] = useState('');

    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            navigate('/LoginAdmin');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!imagem) {
            setMensagem('Selecione uma imagem antes de enviar.');
            return;
        }

        const parsedCapacidade = parseInt(capacidade, 10);
        if (isNaN(parsedCapacidade) || parsedCapacidade <= 0) {
            setMensagem('A capacidade deve ser um número maior que zero.');
            return;
        }

        const token = localStorage.getItem('authToken');
        if (!token || !user || (!user.nameid && !user.sub)) {
            setMensagem('Sessão expirada. Faça login novamente.');
            navigate('/LoginAdmin');
            return;
        }

        const userId = parseInt(user.nameid || user.sub, 10);
        if (isNaN(userId)) {
            setMensagem('Erro: ID do usuário inválido.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result;
            const parts = base64String.split(';');
            const mimeType = parts[0].split(':')[1];
            const extension = '.' + mimeType.split('/')[1];
            const base64Data = parts[1].split(',')[1];

            const imageDetailsList = [{
                Base64: base64Data,
                Extension: extension
            }];

            // Recriado a lógica de extração e formatação de data/hora
            const dataObjeto = new Date(dataHoraInicio);
            const ano = dataObjeto.getFullYear();
            const mes = (dataObjeto.getMonth() + 1).toString().padStart(2, '0');
            const dia = dataObjeto.getDate().toString().padStart(2, '0');
            const dateOnly = `${ano}-${mes}-${dia}`;
            
            const startTimeOnly = dataHoraInicio.substring(11, 16);
            const endTimeOnly = dataHoraFim.substring(11, 16);
            
            const payload = {
                Name: titulo,
                Description: conteudo,
                Place: local,
                // Agora envia StartTime e EndTime como campos separados
                StartTime: `${startTimeOnly}:00`,
                EndTime: `${endTimeOnly}:00`,
                Date: `${dateOnly}T00:00:00`,
                Capacity: parsedCapacidade,
                ImageDetails: imageDetailsList,
                UserId: userId
            };

            try {
                console.log("Payload FINAL e CORRETO:", payload);
                const response = await api.post('/Event/SaveEvent', payload);
                console.log("Resposta do servidor:", response.data);

                setMensagem('Evento cadastrado com sucesso!');
                setTitulo('');
                setConteudo('');
                setImagem(null);
                setLocal('');
                setDataHoraInicio('');
                setDataHoraFim('');
                setCapacidade('');
                document.querySelector('input[type="file"]').value = '';

            } catch (error) {
                console.error('Erro ao enviar evento:', error);
                
                if (error.response && error.response.status === 401) {
                    setMensagem('Sua sessão expirou. Por favor, faça login novamente.');
                    navigate('/LoginAdmin');
                } else if (error.response && error.response.status === 400) {
                    const responseData = error.response.data;
                    const errorDetails = responseData.errors;

                    if (errorDetails && errorDetails.length > 0) {
                        const errorMessages = errorDetails.map(err => `${err.Field}: ${err.Error}`).join('\n');
                        setMensagem(`Erro de validação do servidor:\n${errorMessages}`);
                    } else if (responseData.message) {
                        setMensagem(`Erro do servidor: ${responseData.message}`);
                    } else {
                        setMensagem('Erro de validação. Verifique os dados e tente novamente.');
                    }
                } else {
                    setMensagem('Erro ao enviar evento. Verifique os dados e tente novamente.');
                }
            }
        };

        reader.readAsDataURL(imagem);
    };

    return (
        <React.Fragment>
            <Navbar2 />
            <div className="criar-evento-container">
                <div className="logo-com-bloco">
                    <img src={StartUFC} alt="Start UFC" className="logo-esquerda" />
                </div>
                <div className="bolinhas-verdes">
                    <span className="bolinha"></span>
                    <span className="bolinha"></span>
                    <span className="bolinha"></span>
                </div>
                <h2 className="titulo-pagina-evento">Criar um Evento</h2>
                <form onSubmit={handleSubmit} className="formulario-evento">
                    <label>Título do evento:</label>
                    <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />

                    <label>Descrição do evento:</label>
                    <textarea rows="8" value={conteudo} onChange={(e) => setConteudo(e.target.value)} required></textarea>

                    <label>Local do evento:</label>
                    <input type="text" value={local} onChange={(e) => setLocal(e.target.value)} required />

                    <label>Data e Hora de Início:</label>
                    <input type="datetime-local" value={dataHoraInicio} onChange={(e) => setDataHoraInicio(e.target.value)} required />

                    <label>Data e Hora de Fim:</label>
                    <input type="datetime-local" value={dataHoraFim} onChange={(e) => setDataHoraFim(e.target.value)} required />

                    <label>Capacidade do evento:</label>
                    <input
                        type="number"
                        value={capacidade}
                        onChange={(e) => setCapacidade(e.target.value)}
                        required
                        min="1"
                    />

                    <label>Imagem do evento:</label>
                    <input type="file" accept="image/*" onChange={(e) => setImagem(e.target.files[0])} required />

                    <button type="submit" className="btn-enviar">Criar Evento</button>
                    {mensagem && <p className="mensagem" style={{ whiteSpace: 'pre-wrap' }}>{mensagem}</p>}
                </form>
            </div>
        </React.Fragment>
    );
}

export default CriarEvento;