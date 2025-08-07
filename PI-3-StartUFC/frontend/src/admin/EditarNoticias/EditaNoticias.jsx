import React, { useEffect, useState } from "react";
import "./EditaNoticias.css";
import api from "../../services/api";
import NavbarAdmin from "../../components/Navbar/NavbarAdmin";
import { useAuth } from '../../context/AuthContext'; 

function EditaNoticias() {
    const [noticias, setNoticias] = useState([]);
    const [mensagem, setMensagem] = useState(''); 

    const { user } = useAuth(); 

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        console.log("DEBUG AUTH: Token encontrado no localStorage:", token ? "Sim" : "Não"); 
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            console.log("DEBUG AUTH: Cabeçalho de Autorização definido."); 
        } else {
            delete api.defaults.headers.common['Authorization'];
            console.log("DEBUG AUTH: Cabeçalho de Autorização removido. Usuário não autenticado."); 
            setMensagem("Você não está autenticado. Faça login para acessar.");
        }
    }, [user]); 

    useEffect(() => {
        if (localStorage.getItem('authToken')) {
            fetchNoticias();
        } else {
            setMensagem("Faça login para ver e editar as notícias.");
        }
    }, [user]); 

    const fetchNoticias = async () => {
        try {
            const response = await api.get("/News"); 
            
            const fetchedNews = response.data.data.map(noticiaBackend => {
                let imageDetailsArrayForState = [];

                // Lida com a imagem vindo como objeto único (como no Swagger do PUT)
                // OU como um array (como o erro 400 indicou que o PUT espera)
                // OU como null/undefined (se não houver imagem)
                if (noticiaBackend.imageDetails) {
                    if (Array.isArray(noticiaBackend.imageDetails)) {
                        imageDetailsArrayForState = noticiaBackend.imageDetails;
                    } else if (typeof noticiaBackend.imageDetails === 'object') {
                        imageDetailsArrayForState = [noticiaBackend.imageDetails];
                    }
                }

                const displayImageUrl = (imageDetailsArrayForState.length > 0 && imageDetailsArrayForState[0].base64)
                    ? `data:image/${imageDetailsArrayForState[0].extension.substring(1)};base64,${imageDetailsArrayForState[0].base64}`
                    : 'https://placehold.co/150x150?text=Sem+Imagem';

                return {
                    id: noticiaBackend.id,
                    title: noticiaBackend.title,
                    content: noticiaBackend.content,
                    userId: noticiaBackend.creationUserId, 
                    imageDetails: imageDetailsArrayForState, // Sempre um array no estado do frontend
                    displayUrl: displayImageUrl
                };
            });
            setNoticias(fetchedNews);
            setMensagem(""); 
        } catch (err) {
            console.error("Erro ao buscar notícias:", err);
            setMensagem("Erro ao carregar notícias. Verifique sua conexão ou autenticação.");
        }
    };

    const handleChange = (id, field, value) => {
        setNoticias((prev) => 
            prev.map((n) => (n.id === id ? { ...n, [field]: value } : n))
        );
    };

    const handleImageFileChange = (id, file) => {
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            const parts = base64String.split(';');
            const mimeType = parts[0].split(':')[1];
            const extension = '.' + mimeType.split('/')[1];
            const base64Data = parts[1].split(',')[1];

            setNoticias((prev) =>
                prev.map((item) =>
                    item.id === id
                        ? {
                              ...item,
                              // imageDetails DEVE SER UM ARRAY PARA O PUT (baseado no erro 400 anterior)
                              imageDetails: [{ base64: base64Data, extension: extension }], 
                              displayUrl: `data:image/${extension.substring(1)};base64,${base64Data}`
                          }
                        : item
                )
            );
        };
        reader.readAsDataURL(file);
    };

    const handleSalvar = async (id) => {
        const noticiaToSave = noticias.find((n) => n.id === id);
        if (!noticiaToSave) {
            setMensagem("Notícia não encontrada para salvar.");
            return;
        }

        const currentUserId = noticiaToSave.userId || (user ? (user.nameid || user.sub) : null);
        if (!currentUserId) {
            setMensagem("Erro: ID do usuário não disponível para salvar a notícia. Faça login novamente.");
            return;
        }

        const payload = {
            Id: noticiaToSave.id,
            Title: noticiaToSave.title,      
            Content: noticiaToSave.content,  
            ImageDetails: noticiaToSave.imageDetails, // JÁ É UM ARRAY AQUI E SERÁ ENVIADO COMO TAL
            UserId: currentUserId
        };

        console.log("DEBUG PAYLOAD: Payload enviado para /News PUT:", JSON.stringify(payload, null, 2));

        try {
            await api.put(`/News`, payload); 
            setMensagem("Notícia salva com sucesso!");
            
            setTimeout(() => {
                setMensagem('');
            }, 3000); 

            fetchNoticias(); 
        } catch (err) {
            console.error("Erro ao salvar notícia:", err);
            const errorMessage = err.response?.data?.message || 'Erro ao salvar notícia. Verifique os dados e tente novamente.';
            setMensagem(`Erro: ${errorMessage}`); 
            if (err.response) {
                console.error('Detalhes do erro do backend (status, data):', err.response.status, err.response.data);
                if (err.response.status === 401) {
                    setMensagem("Erro: Não autorizado. Sua sessão pode ter expirado. Faça login novamente.");
                } else if (err.response.data) {
                    console.error('Detalhes do erro do backend (JSON):', JSON.stringify(err.response.data, null, 2));
                }
            }
        }
    };

    const handleExcluir = async (id) => {
        try {
            await api.delete(`/News/${id}`); 
            setNoticias((prev) => prev.filter((n) => n.id !== id));
            setMensagem("Notícia excluída com sucesso!");

            setTimeout(() => {
                setMensagem('');
            }, 3000); 

        } catch (err) {
            console.error("Erro ao excluir notícia:", err);
            const errorMessage = err.response?.data?.message || 'Erro ao excluir notícia. Tente novamente.';
            setMensagem(`Erro: ${errorMessage}`); 
            if (err.response) {
                console.error('Detalhes do erro do backend (status, data):', err.response.status, err.response.data);
                if (err.response.status === 401) {
                    setMensagem("Erro: Não autorizado. Sua sessão pode ter expirado. Faça login novamente.");
                } else if (err.response.data) {
                    console.error('Detalhes do erro do backend (JSON):', JSON.stringify(err.response.data, null, 2));
                }
            }
        }
    };

    return (
        <div className="editar-noticia">
            <NavbarAdmin />
            <div className="container-editar">
                <h2>Editar Notícias</h2>
                {mensagem && (
                    <p className={`mensagem ${mensagem.includes('Erro:') ? 'error' : 'success'}`}>
                        {mensagem}
                    </p>
                )}
                <div className="grid-cards">
                    {noticias.length > 0 ? (
                        noticias.map((noticia) => (
                            <div className="card" key={noticia.id}>
                                <img src={noticia.displayUrl} alt={noticia.title} className="img-noticia" /> 
                                
                                <label>Título:</label>
                                <input
                                    type="text"
                                    value={noticia.title} 
                                    onChange={(e) => handleChange(noticia.id, "title", e.target.value)}
                                />
                                
                                <label>Conteúdo:</label>
                                <textarea
                                    rows="4" 
                                    value={noticia.content} 
                                    onChange={(e) => handleChange(noticia.id, "content", e.target.value)}
                                />

                                <label>Alterar Imagem:</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageFileChange(noticia.id, e.target.files[0])}
                                />

                                <div className="card-buttons">
                                    <button className="salvar" onClick={() => handleSalvar(noticia.id)}>Salvar</button>
                                    <button className="excluir" onClick={() => handleExcluir(noticia.id)}>Excluir</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Nenhuma notícia para editar no momento.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EditaNoticias;