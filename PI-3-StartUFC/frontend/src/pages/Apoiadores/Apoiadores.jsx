import React, { useState, useEffect } from "react";
import "./Apoiadores.css"; 
import Footer from "../../components/Footer/Footer";
import Navbar2 from "../../components/Navbar2/Navbar2";
import api from "../../services/api";

const Apoiadores = () => {
    const [apoiadores, setApoiadores] = useState([]);
    // Adicionando estados de loading e erro 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchApoiadores = async () => {
            setLoading(true);
            setError('');
            try {
                // 1. CORREÇÃO: O endpoint correto é '/supporter'
                const response = await api.get('/supporter');

                // 2. CORREÇÃO: Os dados estão dentro de response.data.data
                if (response.data && Array.isArray(response.data.data)) {
                    setApoiadores(response.data.data);
                } else {
                    console.error("Dados recebidos da API não são um array:", response.data);
                    setApoiadores([]);
                }
            } catch (err) {
                console.error("Erro ao buscar apoiadores:", err);
                setError("Não foi possível carregar os apoiadores.");
            } finally {
                setLoading(false);
            }
        };
        fetchApoiadores();
    }, []);

    return (
        <div className="apoiadores-page-wrapper">
            <Navbar2 />
            <main className="apoiadores-container">
                <h1 className="main-title">Conheça Nossos Parceiros</h1>
                
                {loading ? (
                    <p className="apoiadores-mensagem">Carregando apoiadores...</p>
                ) : error ? (
                    <p className="apoiadores-mensagem">{error}</p>
                ) : apoiadores.length === 0 ? (
                    <p className="apoiadores-mensagem">Nenhum apoiador encontrado.</p>
                ) : (
                    apoiadores.map((apoiador) => (
                        <article className="supporter-block" key={apoiador.id}>
                            <div className="supporter-info">
                                {/* 3. CORREÇÃO: As propriedades são 'name' e 'description' */}
                                <h2>{apoiador.name}</h2>
                                <p>{apoiador.description}</p>
                            </div>
                            <div className="supporter-logo">
                                {/* 4. CORREÇÃO: A propriedade da imagem é 'imgURL' e adicionamos um placeholder */}
                                <img 
                                    src={apoiador.imgURL || 'https://placehold.co/150x150/a7e5d5/333333?text=Logo'} 
                                    alt={`Logo do ${apoiador.name}`} 
                                />
                            </div>
                        </article>
                    ))
                )}

            </main> 
            <Footer />
        </div>
    );
};

export default Apoiadores;
