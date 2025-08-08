import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import Navbar2 from '../../components/Navbar2/Navbar2';
import { useAuth } from '../../context/AuthContext';
import './Login.css'; 
import { FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa'; // <-- NOVO: Importa os ícones de olho
import LogoStart from '../../assets/StartUFC-logo-verde.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // <-- NOVO: Estado para controlar a visibilidade da senha
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const loginData = {
            Login: email,
            Password: password
        };

        try {
            const response = await api.post('/authenticate/authenticate', loginData);

            if (response.status === 200 && response.data.success) {
                const token = response.data.data.jwtToken;
                const userClaims = response.data.data.user || {};
                
                await login(token, userClaims);
                
                navigate("/");
            } else {
                setError(response.data.message || 'Erro desconhecido durante o login.');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Email ou senha inválidos. Tente novamente.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar2 />
            <div className="login-page-wrapper">
                <div className="container-login">
                    <div className="side-bar-login">
                        <p>Bem Vindo de Volta!</p>
                          <img className='img-logo' src={LogoStart} alt="Logo" />
                        <p>Não tem uma conta?</p>
                        <Link to="/register" className='button_btn_register'>Cadastre-se</Link>
                    </div>
                    <div className="login-info">
                        <h1 className="login-title">Faça Login</h1>
                        <form onSubmit={handleLogin}>
                            <label htmlFor="email" className="login-email-label">Email:</label>
                            <input
                                type="email"
                                className="login-email-input"
                                placeholder="Ex: antonio@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <br />
                            <label htmlFor="password" className="login-password-label">Senha:</label>
                            
                          
                            <div className="password-input-container">
                                <input
                                    // O tipo muda dinamicamente entre 'password' e 'text'
                                    type={showPassword ? "text" : "password"}
                                    className="login-password-input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <span 
                                    className="password-toggle-icon" 
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {/* O ícone muda dependendo se a senha está visível ou não */}
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                            
                            <br />
                            <a href="#" className="reset-password">Esqueceu a senha?</a>
                            <br />
                            <button type="submit" className="button-enter" disabled={loading}>
                                {loading ? <FaSpinner className="spinner" /> : 'Entrar'}
                            </button>
                        </form>
                        {error && <p className="login-message login-error-message">{error}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
