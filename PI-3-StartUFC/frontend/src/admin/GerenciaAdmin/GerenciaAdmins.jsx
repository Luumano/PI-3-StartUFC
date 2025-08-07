import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/NavbarAdmin"; // Ou Navbar2, dependendo de qual você usa para admins
import Footer from "../../components/Footer/Footer";
import "./GerenciaAdmins.css";
import api from "../../services/api";
import { useAuth } from '../../context/AuthContext'; // Importar o contexto de autenticação
import { useNavigate } from 'react-router-dom'; // Para redirecionar o usuário

function GerenciarAdmins() {
    const [usuarios, setUsuarios] = useState([]);
    const [mensagem, setMensagem] = useState(''); // Para mensagens de sucesso/erro
    const [isLoadingData, setIsLoadingData] = useState(false); // Novo estado para carregar os usuários

    const { user, loading: loadingAuth, logout } = useAuth(); // Renomeei loadingAuth para 'loading' conforme meu exemplo de AuthContext

    const navigate = useNavigate();

    // Função para buscar os usuários
    const fetchUsers = async () => {
        setIsLoadingData(true); // Começa a carregar os dados
        try {
            const response = await api.get("/User");
            
            const fetchedUsers = response.data.data.map(userBackend => ({
                id: userBackend.id,
                nome: userBackend.name,
                email: userBackend.email,
                isAdmin: userBackend.isAdmin // Certifique-se que o backend envia esta propriedade
            }));

            setUsuarios(fetchedUsers);
            setMensagem('');
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
            if (error.response && error.response.status === 401) {
                // Se a API retornar 401 (Não Autorizado), o token pode ter expirado ou ser inválido
                setMensagem("Sessão expirada ou não autorizado. Redirecionando para o login...");
                logout(); // Limpa o token e o estado de autenticação
                setTimeout(() => navigate('/login'), 2000);
            } else if (error.response && error.response.status === 403) {
                 // Se a API retornar 403 (Proibido), o usuário não tem permissão
                setMensagem("Acesso negado. Você não tem permissão para esta ação. Redirecionando...");
                setTimeout(() => navigate('/'), 2000);
            } else {
                setMensagem("Erro ao carregar usuários. Verifique sua conexão ou permissões.");
            }
        } finally {
            setIsLoadingData(false); // Termina de carregar os dados
        }
    };

    // Efeito para verificar autenticação e autorização
    useEffect(() => {
        if (loadingAuth) {
            // Ainda carregando o estado de autenticação do AuthContext, nada a fazer ainda.
            setMensagem("Verificando autenticação...");
            return;
        }

        // Se loadingAuth é false, sabemos se user existe e se é admin
        if (!user) {
            setMensagem("Você não está autenticado. Redirecionando para o login...");
            setTimeout(() => navigate('/login'), 2000);
            return;
        }

        // Se user existe, verifica se é admin
        if (!user.isAdmin) {
            setMensagem("Acesso negado. Você não tem permissão de administrador. Redirecionando...");
            setTimeout(() => navigate('/'), 2000);
            return;
        }

        // Se chegou até aqui, o usuário está autenticado E é admin
        // Agora podemos buscar os usuários
        fetchUsers();

    }, [user, loadingAuth, navigate, logout]); // Adicione logout às dependências, pois é uma função do contexto

    // Funções de manipulação (handleSalvar, handleExcluir, handleChange, handleToggleAdminStatus)
    // Permanecem as mesmas, sem alterações críticas para este problema.
    const handleSalvar = async (id) => {
        const usuarioToUpdate = usuarios.find(u => u.id === id);
        if (!usuarioToUpdate) {
            setMensagem("Usuário não encontrado para salvar.");
            return;
        }

        const payload = {
            id: usuarioToUpdate.id,
            name: usuarioToUpdate.nome,
            email: usuarioToUpdate.email,
            isAdmin: usuarioToUpdate.isAdmin
        };

        try {
            await api.put(`/User/${id}`, payload); 
            setMensagem("Usuário atualizado com sucesso!");
            // Se o próprio admin mudar seu status, pode ser necessário recarregar o contexto do user
            // Mas para este caso, o ideal é que ele não mude o próprio status de admin ou que a lógica
            // de permissão no backend impeça isso para o usuário logado.
            // Ou, se o user logado mudar seu próprio isAdmin para false, você deve forçar um logout.
            if (user && user.id === id && !usuarioToUpdate.isAdmin) {
                 alert("Seu status de administrador foi removido. Você será desconectado.");
                 logout();
                 navigate('/');
            }
        } catch (err) {
            console.error("Erro ao salvar usuário:", err);
            const errorMessage = err.response?.data?.message || 'Erro ao salvar usuário.';
            setMensagem(`Erro: ${errorMessage}`);
        }
    };

    const handleExcluir = async (id) => {
        // Evita que um admin tente excluir a si mesmo
        if (user && user.id === id) {
            setMensagem("Erro: Você não pode excluir sua própria conta de administrador.");
            return;
        }

        if (!window.confirm("Tem certeza que deseja excluir este usuário?")) return;
        
        try {
            await api.delete(`/User/${id}`);
            setUsuarios(prev => prev.filter(u => u.id !== id));
            setMensagem("Usuário excluído com sucesso!");
        } catch (err) {
            console.error("Erro ao excluir usuário:", err);
            const errorMessage = err.response?.data?.message || 'Erro ao excluir usuário.';
            setMensagem(`Erro: ${errorMessage}`);
        }
    };

    const handleChange = (id, field, value) => {
        setUsuarios(prev => 
            prev.map(u => u.id === id ? { ...u, [field]: value } : u)
        );
    };

    const handleToggleAdminStatus = (id) => {
        setUsuarios(prev =>
            prev.map(u => 
                u.id === id ? { ...u, isAdmin: !u.isAdmin } : u
            )
        );
    };

    // Lógica de renderização:
    // 1. Mostrar mensagem de carregamento inicial do AuthContext
    // 2. Mostrar mensagem de redirecionamento se não for autenticado/autorizado
    // 3. Mostrar tela de gerenciamento se tudo estiver ok
    if (loadingAuth || !user || !user.isAdmin) { // user.isAdmin é crucial aqui
        return (
            <div className="gerenciar-usuarios">
                <Navbar/>
                <div className="usuarios-container">
                    <h2>Gerenciar Administradores</h2>
                    {loadingAuth && <p className="mensagem">Verificando autenticação...</p>}
                    {!loadingAuth && !user && <p className="mensagem">{mensagem || "Você não está autenticado. Redirecionando..."}</p>}
                    {!loadingAuth && user && !user.isAdmin && <p className="mensagem">{mensagem || "Acesso negado. Você não tem permissão de administrador. Redirecionando..."}</p>}
                </div>
                <Footer />
            </div>
        );
    }

    // Se chegou aqui, user está carregado e é admin
    return (
        <div className="gerenciar-usuarios">
            <Navbar/>
            <div className="usuarios-container">
                <h2>Gerenciar Administradores</h2>
                {mensagem && (
                    <p className={`mensagem ${mensagem.includes('Erro:') ? 'error' : 'success'}`}>
                        {mensagem}
                    </p>
                )}
                {isLoadingData ? (
                    <p>Carregando usuários...</p>
                ) : usuarios.length > 0 ? (
                    <div className="usuarios-grid">
                        {usuarios.map(usuario => (
                            <div className="usuario-card" key={usuario.id}>
                                <label>ID: {usuario.id}</label>
                                <label>Nome:</label>
                                <input 
                                    type="text" 
                                    value={usuario.nome} 
                                    onChange={(e) => handleChange(usuario.id, "nome", e.target.value)} 
                                    placeholder="Nome" 
                                />
                                <label>Email:</label>
                                <input 
                                    type="email" 
                                    value={usuario.email} 
                                    onChange={(e) => handleChange(usuario.id, "email", e.target.value)} 
                                    placeholder="Email" 
                                />
                                <div className="admin-status">
                                    <label>Administrador:</label>
                                    <input 
                                        type="checkbox" 
                                        checked={usuario.isAdmin} 
                                        onChange={() => handleToggleAdminStatus(usuario.id)} 
                                    />
                                </div>
                                <div className="usuario-actions">
                                    <button onClick={() => handleSalvar(usuario.id)}>Salvar</button>
                                    {/* Evitar que um admin delete a si mesmo */}
                                    {user && usuario.id !== user.id && ( 
                                        <button className="excluir" onClick={() => handleExcluir(usuario.id)}>Excluir</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Nenhum usuário encontrado.</p>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default GerenciarAdmins;