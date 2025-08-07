import React, { useState, useEffect } from "react";
import "./GaleriaForm.css";
import Navbar2 from "../../components/Navbar2/Navbar2";
import Button from "../../components/Button/Button";
import { IoImagesOutline } from "react-icons/io5";
import api from "../../services/api";
import { useAuth } from '../../context/AuthContext'; // Importar useAuth
import { useNavigate } from 'react-router-dom'; // Importar useNavigate

const GaleriaForm = () => {
    const [titulo, setTitulo] = useState("");
    const [imagem, setImagem] = useState(null); // Vai ser um File object
    const [mensagem, setMensagem] = useState(""); // Mensagem de sucesso/erro
    const [loading, setLoading] = useState(false); // Estado de carregamento

    const { user } = useAuth(); // Obtém o objeto de usuário do contexto de autenticação
    const navigate = useNavigate();

    // NOVO useEffect para carregar o token do localStorage
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            // Se não houver token, redireciona para a página de login do admin
            // Ajuste o caminho se /LoginAdmin não for a rota de login principal para usuários regulares
            navigate('/login'); 
        }
    }, [navigate]);

    const enviarImagem = async (e) => {
        e.preventDefault();
        setLoading(true); // Inicia o estado de carregamento
        setMensagem(''); // Limpa mensagens anteriores

        if (titulo.trim() === '') {
            setMensagem('Por favor, insira um título para a imagem.');
            setLoading(false);
            return;
        }

        if (!imagem) {
            setMensagem('Selecione uma imagem antes de enviar.');
            setLoading(false);
            return;
        }

        // Verifica se o usuário está logado para obter o UserId
        if (!user || (!user.nameid && !user.sub && !user.Id)) { // Adicione user.Id se for o caso
            setMensagem('Erro: Usuário não autenticado. Faça login novamente.');
            setLoading(false);
            return;
        }
        // Obtém o UserId do token decodificado
        // Preferência para user.Id se seu token decodificado tiver uma propriedade 'Id'
        const userId = user.Id || user.nameid || user.sub; 

        const reader = new FileReader();

        reader.onloadend = async () => {
            try {
                const base64String = reader.result; // Ex: "data:image/png;base64,iVBORw0KGgo..."
                
                // Extrai o tipo MIME e a extensão da imagem
                const parts = base64String.split(';');
                const mimeType = parts[0].split(':')[1]; // Ex: "image/png"
                const extension = '.' + mimeType.split('/')[1]; // Ex: ".png"
                const base64Data = parts[1].split(',')[1]; // Apenas a parte base64 pura

                // Formata a imagem para o formato esperado pelo backend (List<ImageDetailsDTO>)
                const imageDetails = [{
                    Base64: base64Data,
                    Extension: extension
                }];

                // Payload alinhado com SaveGalleryRequest (o backend cria uma nova galeria para cada imagem neste cenário)
                const payload = {
                    Title: titulo,
                    ImageDetails: imageDetails, // Adicionado a lista de ImageDetails
                    UserId: userId
                };

                // Envia o payload como JSON
                const response = await api.post('/Gallery/SaveGallery', payload);

                setMensagem('Imagem da Galeria enviada com sucesso!');
                setTitulo('');
                setImagem(null);
                document.querySelector('input[type="file"]').value = ''; // Limpa o campo de arquivo

            } catch (error) {
                console.error('Erro ao enviar imagem da galeria:', error);
                let errorMessage = 'Erro ao enviar imagem da galeria. Tente novamente.';
                if (error.response && error.response.data) {
                    console.error('Detalhes do erro do backend (JSON):', JSON.stringify(error.response.data, null, 2));
                    errorMessage = error.response.data.message ||
                                   (error.response.data.errors && Object.values(error.response.data.errors).flat().join(', ')) ||
                                   'Erro de validação. Verifique os campos.';
                } else if (error.request) {
                    // A requisição foi feita, mas não houve resposta
                    errorMessage = "Sem resposta do servidor. Verifique sua conexão ou a URL da API.";
                } else {
                    // Algo aconteceu na configuração da requisição que disparou um erro
                    errorMessage = error.message;
                }
                setMensagem(errorMessage);
            } finally {
                setLoading(false); // Finaliza o estado de carregamento
            }
        };

        // Inicia a leitura do arquivo como Data URL (Base64)
        reader.readAsDataURL(imagem);
    };

    return (
        <div className="gallery-form">
            <Navbar2 />
            <div className="gallery-form-content">
                <h2>Adicionar Imagem à Galeria</h2>
                <form onSubmit={enviarImagem}>
                    <div className="input-title">
                        <input
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            required
                            placeholder="Título da imagem"
                            disabled={loading} // Desabilita o input durante o carregamento
                        />
                    </div>
                    <div className="upload-img">
                        <IoImagesOutline />
                        <label className="add-img">Imagem:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImagem(e.target.files[0])}
                            required
                            disabled={loading} // Desabilita o input durante o carregamento
                        />
                    </div>
                    <Button 
                        text={loading ? "Adicionando..." : "Adicionar Imagem"} 
                        type="submit" 
                        disabled={loading} // Desabilita o botão durante o carregamento
                    />
                    {mensagem && <p className={`mensagem ${mensagem.includes('sucesso') ? 'success' : 'error'}`}>{mensagem}</p>}
                </form>
            </div>
        </div>
    );
};

export default GaleriaForm;