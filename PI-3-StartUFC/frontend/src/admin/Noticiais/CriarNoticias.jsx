import React, { useState } from "react";
import api from '../../services/api';
import './CriarNoticias.css';
import StartUFC from '../../assets/StartUFC-logo.png';
import NavbarAdmin from "../../components/Navbar/NavbarAdmin";

function CriarNoticias() {
    const [titulo, setTitulo] = useState('');
    const [conteudo, setConteudo] = useState('');
    const [imagem, setImagem] = useState(null);
    const [mensagem, setMensagem] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!imagem) {
            setMensagem('Selecione uma imagem antes de enviar.');
            return;
        }

        const reader = new FileReader();

        reader.onloadend = async () => {
            const base64String = reader.result;

            // --- Lógica de EXTRAÇÃO do CriarEvento APLICADA AQUI ---
             // Extrai o tipo MIME e a extensão da imagem
            const parts = base64String.split(';');
            const mimeType = parts[0].split(':')[1]; // Ex: "image/png"
            const extension = '.' + mimeType.split('/')[1]; // Ex: ".png"
            const base64Data = parts[1].split(',')[1]; // Apenas a parte base64 pura

            
            // --- ESTRUTURA DO PAYLOAD IGUAL AO DO CriarEvento ---
            const imageDetailsList = [{
                Base64: base64Data,
                Extension: extension
            }];

            const payload = {
                Title: titulo,
                Content: conteudo,
                ImageDetails: imageDetailsList // O nome da propriedade deve ser "ImageDetails"
            };

            try {
                await api.post('/News/SaveNews', payload);

                setMensagem('Notícia enviada com sucesso!');
                setTitulo('');
                setConteudo('');
                setImagem(null);
                document.querySelector('input[type="file"]').value = '';
            } catch (error) {
                console.error('Erro ao enviar notícia:', error);
                setMensagem('Erro ao enviar notícia. Verifique os dados e tente novamente.');
                if (error.response && error.response.data) {
                    console.error('Detalhes do erro do backend:', error.response.data);
                    setMensagem(error.response.data.message || 'Erro ao enviar notícia. Verifique os dados e tente novamente.');
                }
            }
        };

        reader.readAsDataURL(imagem);
    };

    return (
        <React.Fragment>
            <NavbarAdmin />
            <div className="criar-noticias-container">
                <div className="logo-com-bloco">
                    <img src={StartUFC} alt="Start UFC" className="logo-esquerda" />
                </div>
                <div className="bolinhas-verdes">
                    <span className="bolinha"></span>
                    <span className="bolinha"></span>
                    <span className="bolinha"></span>
                </div>
                <h2 className="titulo-pagina">Criar uma Notícia</h2>
                <form onSubmit={handleSubmit} className="formulario-noticia">
                    <label>Título da notícia:</label>
                    <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
                    <label>Conteúdo da notícia:</label>
                    <textarea rows="8" value={conteudo} onChange={(e) => setConteudo(e.target.value)} required></textarea>
                    <label>Imagem da notícia:</label>
                    <input type="file" accept="image/*" onChange={(e) => setImagem(e.target.files[0])} required />
                    <button type="submit" className="btn-enviar">Enviar Notícia</button>
                    {mensagem && <p className="mensagem">{mensagem}</p>}
                </form>
            </div>
        </React.Fragment>
    );
}

export default CriarNoticias;