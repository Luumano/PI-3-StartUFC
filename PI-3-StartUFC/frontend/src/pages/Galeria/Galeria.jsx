import React, { useState, useEffect } from "react";
import "./Galeria.css";
import Footer from "../../components/Footer/Footer";
import Navbar2 from "../../components/Navbar2/Navbar2";
import Carrossel from "../../components/Carrossel/Carrossel";
import api from "../../services/api";

const getMimeType = (ext) => {
    switch (ext.toLowerCase()) {
        case "jpg":
        case "jpeg":
            return "jpeg";
        case "png":
            return "png";
        case "gif":
            return "gif";
        case "webp":
            return "webp";
        default:
            return ext.toLowerCase();
    }
};

const Galeria = () => {
    const [galerias, setGalerias] = useState([]);
    const [galeriasFiltradas, setGaleriasFiltradas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Deixamos apenas o filtro de título
    const [filtroTitulo, setFiltroTitulo] = useState('');
    const [titulosDisponiveis, setTitulosDisponiveis] = useState([]);

    // Efeito para buscar os dados da API
    useEffect(() => {
        const fetchGalerias = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await api.get('/Gallery');
                if (response.data && Array.isArray(response.data.data)) {
                    const galeriasComImagensFormatadas = response.data.data.map(galeria => {
                        const imagensFormatadas = (galeria.imageDetails || [])
                            .map(imageDetails => {
                                if (imageDetails.base64 && imageDetails.extension) {
                                    const extension = imageDetails.extension.replace('.', '');
                                    const mimeType = getMimeType(extension);
                                    return `data:image/${mimeType};base64,${imageDetails.base64}`;
                                }
                                return null;
                            })
                            .filter(imgUrl => imgUrl !== null);

                        let dataCriacao = null;
                        if (galeria.createdAt) {
                            const dataObjeto = new Date(galeria.createdAt);
                            dataCriacao = !isNaN(dataObjeto.getTime()) ? dataObjeto : null;
                        }

                        const dataParaExibir = dataCriacao || new Date();
                        const dataFormatada = dataParaExibir.toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' });

                        return {
                            ...galeria,
                            formattedImages: imagensFormatadas,
                            formattedDate: dataFormatada,
                            dateObject: dataCriacao
                        };
                    });
                    
                    galeriasComImagensFormatadas.sort((a, b) => {
                        const dateA = a.dateObject || new Date(0);
                        const dateB = b.dateObject || new Date(0);
                        return dateB.getTime() - dateA.getTime();
                    });

                    setGalerias(galeriasComImagensFormatadas);
                    setGaleriasFiltradas(galeriasComImagensFormatadas);
                } else {
                    console.error("Dados da API não são válidos:", response.data);
                    setGalerias([]);
                    setGaleriasFiltradas([]);
                }
            } catch (err) {
                console.error("Erro ao buscar galerias:", err);
                setError("Não foi possível carregar a galeria.");
                setGalerias([]);
                setGaleriasFiltradas([]);
            } finally {
                setLoading(false);
            }
        };
        fetchGalerias();
    }, []);

    // Efeito para popular os títulos disponíveis
    useEffect(() => {
        if (galerias.length > 0) {
            const titulosUnicos = Array.from(new Set(
                galerias.map(g => g.title)
            )).sort((a, b) => a.localeCompare(b));

            setTitulosDisponiveis(["", ...titulosUnicos]);
        } else {
            setTitulosDisponiveis([]);
        }
    }, [galerias]);

    // Efeito para filtrar as galerias apenas pelo título
    useEffect(() => {
        let filtradas = galerias;

        if (filtroTitulo) {
            filtradas = filtradas.filter(galeria => 
                galeria.title === filtroTitulo
            );
        }

        setGaleriasFiltradas(filtradas);
    }, [filtroTitulo, galerias]);

    return (
        <div className="pagina-galeria">
            <Navbar2 />
            <div className="galeria-container-principal">
                <h1 className="galeria-titulo-pagina">Galeria</h1>

                <div className="galeria-filtros">
                    <div className="filtro-item">
                        <label htmlFor="filtro-titulo">Título:</label>
                        <select
                            id="filtro-titulo"
                            className="galeria-select-filtro"
                            value={filtroTitulo}
                            onChange={(e) => setFiltroTitulo(e.target.value)}
                        >
                            {titulosDisponiveis.map(titulo => (
                                <option key={titulo} value={titulo}>{titulo === "" ? "Todos os Títulos" : titulo}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <p className="galeria-mensagem">Carregando galerias...</p>
                ) : error ? (
                    <p className="galeria-mensagem">{error}</p>
                ) : galeriasFiltradas.length === 0 ? (
                    <p className="galeria-mensagem">Nenhuma galeria encontrada com os filtros selecionados.</p>
                ) : (
                    galeriasFiltradas.map((galeria) => (
                        <div key={galeria.id} className="galeria-evento">
                            <h2 className="galeria-evento-titulo">{galeria.title}</h2>
                            <p className="galeria-evento-data">
                                Data: {galeria.formattedDate}
                            </p>
                            <Carrossel imagens={galeria.formattedImages} />
                        </div>
                    ))
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Galeria;