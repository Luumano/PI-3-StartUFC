import React, { useState } from 'react';
import './LoginAdmin.css'; 
import Navbar2 from "../../components/Navbar2/Navbar2";
import api from '../../services/api'; 
import { useNavigate } from "react-router-dom";
import { FaSpinner } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext'; // <--- Importe useAuth
import LogoStart from '../../assets/StartUFC-logo-verde.png';

const LoginAdmin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Mantendo isLoading para o botão
    const navigate = useNavigate();
    
    const { login } = useAuth(); // <--- Pegue a função 'login' do seu AuthContext

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Usar isLoading para o botão, renomeei para consistência
        setError('');

        const loginData = {
            login: email,
            password: password
        };

        try {
            const response = await api.post('/authenticate/authenticate', loginData);

            if (response.status === 200 && response.data.success) {
                const token = response.data.data.jwtToken;
                
                // Chame a função 'login' do AuthContext para definir o token e o usuário
                login(token); // Isso vai armazenar o token e decodificar o usuário no contexto

                // Redireciona para a página principal do administrador
                navigate("/adminDashboard");
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Email ou senha inválidos. Tente novamente.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Navbar2 /> {/* Se sua Navbar principal é a Navbar2, ela precisa do AuthContext também */}
    
            <div className="container-login-admin">
                <div className="side-bar-login-admin">
                    <div></div>
                    <p className="sidebar-text">Faz parte do START?</p>
                    <p className='sidebar-text2'>Faça login para acessar</p>
                    <p></p>
                    <img className='img-logo-admin' src={LogoStart} alt="Logo" />
                    <div></div>
                </div>
                <div className="login-info-admin">
                    <h1 className="login-title-admin">Login Administrador</h1>
                    <form onSubmit={handleLogin}>
                        <label htmlFor="email" className="login-email-label-admin">Email:</label>
                        <input 
                            type="email" 
                            className="login-email-input-admin" 
                            placeholder="Ex: antonio@gmail.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                        <label htmlFor="password" className="login-password-label-admin">Senha:</label>
                        <input 
                            type="password" 
                            className="login-password-input-admin" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                        <a href="#" className="reset-password-admin">Esqueceu a senha?</a>
                        <button type="submit" className="button-enter-admin" disabled={isLoading}>
                            {isLoading ? <FaSpinner className="spinner" /> : 'Entrar'}
                        </button> 
                    </form>
                    
                    {error && <p className="login-message login-error-message">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default LoginAdmin;
