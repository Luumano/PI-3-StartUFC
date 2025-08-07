import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import './EditarPerfil.css'; 
import seta from '../../assets/seta2.png'; 
import logo from '../../assets/StartUFC-logo-verde.png'; 
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const EditarPerfil = () => {
    const navigate = useNavigate();
    // 2. OBTEMOS O UTILIZADOR DO NOSSO CONTEXTO
    const { user } = useAuth();

    // 3. CRIAMOS UM ESTADO SEPARADO PARA OS DADOS DO FORMULÁRIO
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        cpf: '',
        phone: ''
        // Nota: A atualização de foto e senha são processos mais complexos
        // e geralmente feitos em formulários separados.
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // 4. USAMOS O useEffect PARA BUSCAR OS DADOS ATUAIS E PREENCHER O FORMULÁRIO
    useEffect(() => {
        // Se não houver 'user' no contexto, redireciona para o login
        if (!user) {
            navigate("/login");
            return;
        }

        const fetchUserData = async () => {
            try {
                // O ID do utilizador vem do token JWT, que está no nosso contexto
                const userId = user.nameid || user.sub;
                const response = await api.get(`/user/${userId}`);
                
                // Preenchemos o formulário com os dados que vieram da API
                const userData = response.data.data;
                setFormData({
                    name: userData.name || '',
                    email: userData.email || '',
                    cpf: userData.cpf || '',
                    phone: userData.phone || ''
                });

            } catch (err) {
                console.error("Erro ao buscar dados do perfil", err);
                setError("Não foi possível carregar os dados para edição.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user, navigate]); // A dependência [user] garante que isto roda quando o utilizador é definido

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 5. A FUNÇÃO DE SUBMISSÃO AGORA ENVIA OS DADOS ATUALIZADOS
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userId = user.nameid || user.sub;
            
            // O backend espera um objeto que inclua o Id do utilizador
            const dataToUpdate = {
                id: userId,
                ...formData
            };

            // Usamos o método PUT para a rota '/user'
            await api.put(`/user`, dataToUpdate);
            
            alert("Perfil atualizado com sucesso!");
            navigate("/perfil"); // Redireciona de volta ao perfil

        } catch (err) {
            console.error("Erro ao atualizar o perfil", err);
            const errorMessage = err.response?.data?.message || "Erro ao atualizar o perfil. Tente novamente.";
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Carregando perfil para edição...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <div className="Nav"> 
                <Link to="/perfil">
                    <img src={seta} alt="Voltar" className='seta'/>
                </Link>
                <img src={logo} alt="logo" className="logo"/>
                <div className="Nav1"></div>
                <h2 className="titulo">Editar Perfil do Usuário</h2>
            </div>

            <div className="editar-perfil-container">
                <h2>Editar Perfil</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nome" required />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
                    <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} placeholder="CPF" />
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Telefone" />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </form>
            </div>
        </>
    );
};

export default EditarPerfil;
