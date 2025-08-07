// Seu NavbarAdmin.jsx (já está quase correto)
import React, { useState, useEffect, useRef } from 'react';
import './NavBarAdmin.css';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaChevronDown, FaBell } from "react-icons/fa";
import Logo from '../../assets/StartUFC-azul.png';
import { Link, useNavigate } from "react-router-dom";
import Button from '../Button/Button';
import { Link as ScrollLink } from 'react-scroll';

import { useAuth } from '../../context/AuthContext'; // <--- Garanta que esta importação está correta
import api from '../../services/api';

function NavbarAdmin() {
    const [isOpen, setIsOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const userMenuRef = useRef(null);
    const notificacoesRef = useRef(null); // Você tinha isso, mas o endpoint 404 para notificações ainda existe
    const navigate = useNavigate();
    
    const { user, logout } = useAuth(); // <--- Se 'user' está vindo daqui, ele deve ser reativo.

    // Removi a parte de notificações por enquanto, já que o endpoint está dando 404.
    // Você pode re-adicionar quando o backend de notificações estiver pronto.

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
            // if (notificacoesRef.current && !notificacoesRef.current.contains(event.target)) {
            //     setNotificacoesOpen(false);
            // }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        if (isOpen) {
            setIsOpen(false);
        }
    };

    const handleLogout = () => {
        logout(); // Chame a função logout do contexto
        setMenuOpen(false);
        closeMenu();
        navigate('/'); // Redirecionar para a home após logout
    };

    const handleLogoClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        closeMenu();
    };

    return (
        <>
            <nav>
                <div className='navbar'>
                    <Link to="/" onClick={handleLogoClick}>
                        <img src={Logo} alt="StartUFC Logo" className='navbar-logo' />
                    </Link>
                    <ul className={isOpen ? "nav-link active" : "nav-link"}>
                        
                        {/* ==================================================================== */}
                        {/* ||           LINKS SEMPRE VISÍVEIS (movi para Navbar2)          || */}
                        {/* ==================================================================== */}
                        {/* Esses links (Cadastrar Membro, Eventos Exclusivos, etc.)
                           normalmente estariam na Navbar principal (Navbar2).
                           Se esta NavbarAdmin é APENAS para o painel de admin,
                           então esses links podem ser removidos daqui ou mantidos se fizerem sentido.
                           Para um admin, alguns desses links podem ser painéis de gerenciamento.
                           Para simplificar a depuração, considere se NavbarAdmin realmente precisa de TUDO isso.
                           Mantenho como estava, mas é uma observação.
                        */}
                        <li>
                            <Link to="/cadastrarMembro" onClick={closeMenu}>
                                Cadastrar Novo Membro
                            </Link>
                        </li>
                        <li>
                            <Link to="/eventosExclusivos" onClick={closeMenu}>
                                Eventos Exclusivos
                            </Link>
                        </li>
                        <li>
                            <Link to="/adicionarImagem" onClick={closeMenu}>
                                Adicionar Imagens
                            </Link>
                        </li>
                        <li>
                            <Link to="/ultimasNoticias" onClick={closeMenu}>
                                Últimas Notícias
                            </Link>
                        </li>

                        {/* A lógica condicional agora aplica-se apenas aos botões de autenticação */}
                        {!user ? ( // <--- Se 'user' for null ou undefined, mostra botões de login
                            <>
                                <li>
                                    <Link to="/login" onClick={closeMenu}>
                                        <Button text="Login" color="green" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/LoginAdmin" onClick={closeMenu}>
                                        <Button text="Login Administrador" color="green" />
                                    </Link>
                                </li>
                            </>
                        ) : ( // <--- Se 'user' tiver valor, mostra menu de perfil
                            <>
                                <li className="user-menu" ref={userMenuRef}>
                                    <div className="user-info" onClick={() => setMenuOpen(!menuOpen)}>
                                        <div className="user-icon"><FaUser size={20} /></div>
                                        <span>{user.name}</span> {/* user.name deve vir do AuthContext */}
                                        <FaChevronDown size={14} className={`chevron-icon ${menuOpen ? 'open' : ''}`} />
                                    </div>
                                    {menuOpen && (
                                        <div className="dropdown-menu">
                                            <Link to="/perfil" onClick={() => { setMenuOpen(false); closeMenu(); }}>
                                                <FaUser /> Meu Perfil
                                            </Link>
                                            <button onClick={handleLogout}>
                                                <FaSignOutAlt /> Sair
                                            </button>
                                        </div>
                                    )}
                                </li>
                            </>
                        )}
                    </ul>
                    <button className="menu" onClick={toggleMenu}>
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </nav>
        </>
    );
}

export default NavbarAdmin;