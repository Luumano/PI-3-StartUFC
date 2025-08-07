import React, { useEffect, useState } from "react";
import "./EditarImagem.css";
import api from "../../services/api";
import NavbarAdmin from "../../components/Navbar/NavbarAdmin";
import { useAuth } from '../../context/AuthContext';

function EditarImagem() {
    const [galerias, setGalerias] = useState([]);
    const [galeriaSelecionada, setGaleriaSelecionada] = useState(null);
    const [mensagem, setMensagem] = useState('');
    const [loading, setLoading] = useState(true);

    const { user } = useAuth();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchGalerias();
        } else {
            setMensagem("Você não está autenticado. Faça login para acessar.");
            setLoading(false);
        }
    }, [user]);

    const fetchGalerias = async () => {
        setLoading(true);
        setMensagem('');
        try {
            const response = await api.get("/Gallery");
            const fetchedGalleryItems = response.data.data.map(item => {
                const displayUrl = (item.imageDetails && item.imageDetails.length > 0)
                    ? `data:image/${item.imageDetails[0].extension.substring(1)};base64,${item.imageDetails[0].base64}`
                    : 'https://placehold.co/150x150';
                return {
                    id: item.id,
                    titulo: item.title,
                    userId: item.userId,
                    imageDetails: item.imageDetails || [],
                    displayUrl: displayUrl
                };
            });
            setGalerias(fetchedGalleryItems);
        } catch (err) {
            console.error("Erro ao buscar galerias:", err);
            setMensagem("Erro ao carregar galerias. Verifique sua conexão ou autenticação.");
        } finally {
            setLoading(false);
        }
    };

    const handleSalvarGaleria = async () => {
        if (!galeriaSelecionada) return;

        const currentUserId = galeriaSelecionada.userId || (user ? (user.nameid || user.sub) : null);
        if (!currentUserId) {
            setMensagem("Erro: ID do usuário não disponível para salvar a galeria.");
            return;
        }

        const imageDetailsPayload = galeriaSelecionada.imageDetails.map(img => ({
            Id: img.id,
            Base64: img.base64,
            Extension: img.extension
        }));

        const payload = {
            Id: galeriaSelecionada.id,
            Title: galeriaSelecionada.titulo,
            ImageDetails: imageDetailsPayload,
            UserId: currentUserId
        };
        
        try {
            // CORREÇÃO: Adicionamos o ID da galeria à URL da requisição PUT
            await api.put(`/Gallery`, payload);
            
            setMensagem("Galeria salva com sucesso!");
            setGaleriaSelecionada(null);
            fetchGalerias();
        } catch (err) {
            console.error("Erro ao salvar galeria:", err);
            setMensagem("Erro ao salvar galeria. Tente novamente.");
            if (err.response && err.response.data) {
                setMensagem(err.response.data.message || 'Erro ao salvar galeria.');
            }
        }
    };
    
    const handleExcluirGaleria = async (galleryId) => {
      try {
        await api.delete(`/Gallery/${galleryId}`);
        setGalerias(prev => prev.filter(g => g.id !== galleryId));
        setMensagem("Galeria excluída com sucesso!");
      } catch (err) {
        console.error("Erro ao excluir galeria:", err);
        setMensagem("Erro ao excluir galeria. Tente novamente.");
      }
    };

    const handleExcluirImagem = (imageId) => {
        if (!galeriaSelecionada) return;
        const novasImagens = galeriaSelecionada.imageDetails.filter(img => img.id !== imageId);
        setGaleriaSelecionada({ ...galeriaSelecionada, imageDetails: novasImagens });
        setMensagem("Imagem removida localmente. Clique em 'Salvar Galeria' para confirmar a exclusão.");
    };

    const handleAlterarImagem = async (imageId, file) => {
        if (!file || !galeriaSelecionada) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            const parts = base64String.split(';');
            const mimeType = parts[0].split(':')[1];
            const extension = '.' + mimeType.split('/')[1];
            const base64Data = parts[1].split(',')[1];
    
            const novasImagens = galeriaSelecionada.imageDetails.map(img =>
                img.id === imageId
                    ? { ...img, base64: base64Data, extension: extension, displayUrl: `data:${mimeType};base64,${base64Data}` }
                    : img
            );
            
            setGaleriaSelecionada({ ...galeriaSelecionada, imageDetails: novasImagens });
            setMensagem("Imagem alterada localmente. Clique em 'Salvar Galeria' para confirmar a alteração.");
        };
        reader.readAsDataURL(file);
    };

    const handleAdicionarNovaImagem = async (file) => {
        if (!file || !galeriaSelecionada) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            const parts = base64String.split(';');
            const mimeType = parts[0].split(':')[1];
            const extension = '.' + mimeType.split('/')[1];
            const base64Data = parts[1].split(',')[1];
            
            const novaImagem = {
                id: `temp-${Date.now()}`,
                base64: base64Data,
                extension: extension,
                displayUrl: `data:${mimeType};base64,${base64Data}`
            };

            setGaleriaSelecionada({
                ...galeriaSelecionada,
                imageDetails: [...galeriaSelecionada.imageDetails, novaImagem]
            });
            setMensagem("Nova imagem adicionada localmente. Clique em 'Salvar Galeria' para finalizar.");
        };
        reader.readAsDataURL(file);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <NavbarAdmin />
                <p>Carregando imagens...</p>
            </div>
        );
    }

    if (galeriaSelecionada) {
        return (
            <div className="editar-imagem">
                <NavbarAdmin />
                <div className="container-editar">
                    <h2>Editando Galeria: {galeriaSelecionada.titulo}</h2>
                    <button className="back-button" onClick={() => setGaleriaSelecionada(null)}>
                        &larr; Voltar para as Galerias
                    </button>
                    {mensagem && <p className="mensagem">{mensagem}</p>}
                    
                    <div className="card-buttons top-buttons">
                        <button className="salvar" onClick={handleSalvarGaleria}>
                            Salvar Galeria
                        </button>
                    </div>

                    <div className="adicionar-imagem-form">
                        <label>Adicionar Nova Imagem:</label>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleAdicionarNovaImagem(e.target.files[0])}
                        />
                    </div>
                    
                    <div className="grid-cards">
                        {galeriaSelecionada.imageDetails.map((imagem) => (
                            <div className="card" key={imagem.id || `temp-${Math.random()}`}>
                                <img 
                                    src={imagem.displayUrl || `data:image/${imagem.extension.substring(1)};base64,${imagem.base64}`}
                                    alt={`Imagem da galeria ${galeriaSelecionada.titulo}`} 
                                />
                                <div className="card-buttons">
                                    <label className="file-upload-label">
                                        Substituir Imagem
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden-file-input"
                                            onChange={(e) => handleAlterarImagem(imagem.id, e.target.files[0])}
                                        />
                                    </label>
                                    <button 
                                        className="excluir" 
                                        onClick={() => handleExcluirImagem(imagem.id)}>
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="editar-imagem">
            <NavbarAdmin />
            <div className="container-editar">
                <h2>Selecione uma Galeria para Editar</h2>
                {mensagem && <p className="mensagem">{mensagem}</p>}
                <div className="grid-cards">
                    {galerias.length > 0 ? (
                        galerias.map((galeria) => (
                            <div className="card-galeria" key={galeria.id} onClick={() => setGaleriaSelecionada(galeria)}>
                                <img src={galeria.displayUrl} alt={galeria.titulo} />
                                <h3>{galeria.titulo}</h3>
                                <div className="botoes-galeria">
                                    <button onClick={(e) => { e.stopPropagation(); setGaleriaSelecionada(galeria); }}>
                                        Editar
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleExcluirGaleria(galeria.id); }}>
                                        Excluir Galeria
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Nenhuma galeria encontrada.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EditarImagem;