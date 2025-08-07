import React, { useState, useEffect } from "react";
import api from '../../services/api';
import './AdicionarImagem.css';
import StartUFC from '../../assets/StartUFC-logo.png';
import NavbarAdmin from "../../components/Navbar/NavbarAdmin";
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // Adicionado para redirecionamento

function AdicionarImagem() {
    const [titulo, setTitulo] = useState('');
    const [imagensSelecionadas, setImagensSelecionadas] = useState([]); // Alterado para um array
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

    const handleFileChange = (e) => {
        setImagensSelecionadas(Array.from(e.target.files)); // Captura a lista de arquivos
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (imagensSelecionadas.length === 0) {
            setMensagem('Selecione pelo menos uma imagem antes de enviar.');
            return;
        }
        
        if (!user || (!user.nameid && !user.sub)) {
            setMensagem('Erro: Usuário não autenticado. Faça login novamente.');
            return;
        }
        const userId = user.nameid || user.sub;

        // Processa as imagens sequencialmente
        const processarImagens = async () => {
            const imageDetails = [];
            for (const imagem of imagensSelecionadas) {
                const base64String = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(imagem);
                });

                const parts = base64String.split(';');
                const mimeType = parts[0].split(':')[1];
                const extension = '.' + mimeType.split('/')[1];
                const base64Data = parts[1].split(',')[1];

                imageDetails.push({
                    Base64: base64Data,
                    Extension: extension
                });
            }
            return imageDetails;
        };

        setMensagem('Processando e enviando imagens...');

        try {
            const imageDetails = await processarImagens();
            
            const payload = {
                Title: titulo,
                ImageDetails: imageDetails,
                UserId: userId
            };

            const response = await api.post('/Gallery/SaveGallery', payload);
            
            console.log('Resposta da API:', response.data);

            setMensagem(`Galeria "${titulo}" adicionada com sucesso com ${imagensSelecionadas.length} imagem(ns)!`);
            setTitulo('');
            setImagensSelecionadas([]);
            document.querySelector('input[type="file"]').value = '';
        } catch (error) {
            console.error('Erro ao enviar imagens da galeria:', error);
            let errorMessage = 'Erro ao enviar imagens da galeria. Tente novamente.';
            if (error.response && error.response.data) {
                console.error('Detalhes do erro do backend (JSON):', JSON.stringify(error.response.data, null, 2));
                errorMessage = error.response.data.message || 
                               (error.response.data.errors && Object.values(error.response.data.errors).flat().join(', ')) ||
                               errorMessage;
            }
            setMensagem(errorMessage);
        }
    };

    return (
        <React.Fragment>
            <NavbarAdmin />
            <div className="adicionar-imagem-container">
                <div className="logo-com-bloco">
                    <img src={StartUFC} alt="Start UFC" className="logo-esquerda" />
                </div>
                <div className="bolinhas-verdes">
                    <span className="bolinha"></span>
                    <span className="bolinha"></span>
                    <span className="bolinha"></span>
                </div>
                <h2 className="titulo-pagina">Adicionar Imagens à Galeria</h2>
                <form onSubmit={handleSubmit} className="formulario-imagem">
                    <label>Título da Galeria:</label>
                    <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />

                    <label>Imagens:</label>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        multiple // Adicionado o atributo multiple
                        required 
                    />

                    {imagensSelecionadas.length > 0 && (
                      <p className="arquivos-selecionados">{imagensSelecionadas.length} arquivo(s) selecionado(s)</p>
                    )}
                    
                    <button type="submit" className="btn-enviar">Adicionar Galeria</button>
                    {mensagem && <p className="mensagem">{mensagem}</p>}
                </form>
            </div>
        </React.Fragment>
    );
}

export default AdicionarImagem;