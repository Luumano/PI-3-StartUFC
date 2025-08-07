import React, { useState, useEffect } from "react";
import './UltimasNoticias.css';
import api from '../../services/api'; // Importamos nossa 'api'
import Navbar from "../../components/Navbar/NavbarAdmin";
import Footer from "../../components/Footer/Footer";
import { Link } from "react-router-dom";
// import event from "../../assets/event6.png"; // Não é mais necessário se as imagens vêm da API

function UltimasNoticias() {
    // 2. Criamos um estado para guardar as notícias que virão da API.
    const [noticias, setNoticias] = useState([]);
    const [loading, setLoading] = useState(true); // Novo estado para controle de carregamento
    const [error, setError] = useState(null); // Novo estado para erros

    // 3. Usamos o useEffect para buscar os dados da API assim que a página carrega.
    useEffect(() => {
        const fetchNoticias = async () => {
            try {
                // Usamos nossa 'api' para fazer a busca no endpoint de notícias
                // CORREÇÃO: O endpoint correto é /News
                const response = await api.get('/News'); 
                console.log("Resposta da API para /News:", response.data); // Debug da resposta

                // CORREÇÃO: A estrutura da resposta é response.data.data
                const fetchedNews = response.data.data.map(noticiaBackend => {
                    let imageDetailsArrayForState = [];

                    // Lógica para lidar com imageDetails, similar à tela de edição
                    // Supondo que imageDetails pode vir como objeto único, array ou null/undefined
                    if (noticiaBackend.imageDetails) {
                        if (Array.isArray(noticiaBackend.imageDetails)) {
                            imageDetailsArrayForState = noticiaBackend.imageDetails;
                        } else if (typeof noticiaBackend.imageDetails === 'object') {
                            imageDetailsArrayForState = [noticiaBackend.imageDetails];
                        }
                    }

                    const displayImageUrl = (imageDetailsArrayForState.length > 0 && imageDetailsArrayForState[0].base64)
                        ? `data:image/${imageDetailsArrayForState[0].extension.substring(1)};base64,${imageDetailsArrayForState[0].base64}`
                        : 'https://placehold.co/300x200?text=Sem+Imagem'; // Placeholder maior para notícias

                    return {
                        id: noticiaBackend.id,
                        titulo: noticiaBackend.title, // Mapeia title do backend para titulo do frontend
                        conteudo: noticiaBackend.content, // Mapeia content do backend para conteudo do frontend
                        displayUrl: displayImageUrl, // URL da imagem para exibição
                        // Você pode manter imageDetails aqui se precisar para algo futuro, mas para exibição, displayUrl é suficiente
                        imageDetails: imageDetailsArrayForState 
                    };
                });

                setNoticias(fetchedNews); // Guardamos a lista de notícias no nosso estado
                setLoading(false); // Dados carregados
            } catch (err) {
                console.error("Erro ao buscar notícias:", err);
                setError("Não foi possível carregar as notícias. Tente novamente mais tarde.");
                setLoading(false); // Terminou o carregamento (com erro)
            }
        };

        fetchNoticias(); // Executamos a função de busca
    }, []); // O array vazio [] garante que isso rode apenas uma vez.

    if (loading) {
        return (
            <div className="ultimas-noticias">
                <Navbar />
                <div className="noticias-container">
                    <h2 className="titulo-noticias">Últimas Notícias</h2>
                    <p>Carregando notícias...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="ultimas-noticias">
                <Navbar />
                <div className="noticias-container">
                    <h2 className="titulo-noticias">Últimas Notícias</h2>
                    <p className="error-message">{error}</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="ultimas-noticias">
            <Navbar />
            <div className="noticias-container">
                <h2 className="titulo-noticias">Últimas Notícias</h2>
                <div className="grid-noticias">
                    {noticias.length > 0 ? (
                        noticias.map((noticia) => (
                            <div className="card-noticia" key={noticia.id}>
                                {/* CORREÇÃO: Usamos 'displayUrl' para a imagem */}
                                <img src={noticia.displayUrl} alt={noticia.titulo} className="img-noticia" />
                                <h3>{noticia.titulo}</h3>
                                <p>{noticia.conteudo}</p>
                                {/* Se tiver uma tela de detalhes da notícia, você pode usar a Link para ela */}
                                <Link to={`/noticias/${noticia.id}`}><button className="btn-ver-mais">Ver Mais</button></Link>
                            </div>
                        ))
                    ) : (
                        <p>Nenhuma notícia encontrada no momento.</p>
                    )}
                </div>
                {/* O botão "Criar Notícia" pode não ser para esta tela, mas mantido conforme seu código */}
                <Link to="/criarNoticias"><button className="btn-criar-noticia">Criar Notícia</button></Link>
            </div>
            <Footer />
        </div>
    );
}

export default UltimasNoticias;