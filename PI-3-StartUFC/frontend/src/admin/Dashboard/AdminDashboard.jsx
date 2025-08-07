import React from "react";
import './AdminDashboard.css';
import NavbarAdmin from "../../components/Navbar/NavbarAdmin";
import Footer from "../../components/Footer/Footer";
import { Link } from "react-router-dom";

function AdminDashboard() {
    return (
        <div className="admin-dashboard">
            <NavbarAdmin />
            <div className="admin-container">
                <h2 className="titulo-admin">Painel Administrador</h2>
                <div className="grid-funcionalidade">
                    <Link to="/criarNoticias" className="card-funcao">
                        <h3>📰 Criar Notícia</h3>
                        <p>Publique novas atualizações e notícias.</p>
                    </Link>
                    <Link to="/criarEvento" className="card-funcao">
                        <h3>📅 Criar Evento</h3>
                        <p>Agende e organize eventos exclusivos.</p>
                    </Link>
                    <Link to="/adicionarImagem" className="card-funcao">
                        <h3>🖼️ Adicionar Imagem</h3>
                        <p>Adicione fotos a galeria de imagens.</p>
                    </Link>

                    <Link to="/gerenciarAdmins" className="card-funcao">
                        <h3>👥 Gerenciar Administradores</h3>
                        <p>Visualize, edite ou remova usuários da plataforma.</p>
                    </Link>
                    <Link to="/listaFrequencia" className="card-funcao">
                        <h3>📋 Lista de Frequência</h3>
                        <p>Veja e exporte a lista de participantes por evento.</p>
                    </Link>
                    <Link to="/editarEventos" className="card-funcao">
                        <h3>✏️ Editar Eventos</h3>
                        <p>Edite as informações do evento ou exclua o evento.</p>
                    </Link>
                    <Link to="/editaNoticias" className="card-funcao">
                        <h3>📝 Editar noticia</h3>
                        <p>Edite as notícias cadastradas ou excluas elas.</p>
                    </Link>
                    <Link to="/editarImagem" className="card-funcao">
                        <h3>🖼️ Editar Imagem da Galeria</h3>
                        <p>Edite ou remova as imagens da plataforma.</p>
                    </Link>

                    <Link to="/" className="card-funcao">
                        <h3>🏠 Sair</h3>
                        <p>Voltar para a página inicial do portal.</p>
                    </Link>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default AdminDashboard;
