import React, { useState } from 'react';
import './Register.css';
import Navbar2 from '../../components/Navbar2/Navbar2';
import api from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';
import LogoStart from '../../assets/StartUFC-logo-verde.png';

import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
    const [name, setName] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    
    // NOVO: Estado para controlar a visibilidade da senha
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const userData = {
            Name: name,
            Email: email,
            Password: password,
            Cpf: cpf,
            Phone: phone
        };

        try {
            const response = await api.post('/user/saveuser', userData);

            if (response.status === 200) {
                setSuccess('Conta criada com sucesso! A redirecionar para o login...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Erro ao criar conta. Verifique os dados e tente novamente.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar2 />
            <div className="register-page-wrapper">
                <div className="container-register">
                    <div className="side-bar-register">
                        <p>Bem Vindo</p>
                        <img className='img-logo' src={LogoStart} alt="Logo" />
                        <p>Já tem conta na Start?</p>
                        <Link to="/login" className='button-btn-login'>Logar</Link>
                    </div>
                    <div className="register-info">
                        <h1 className="register-title">Crie sua conta</h1>
                        <form onSubmit={handleRegister}>
                            <label htmlFor="full-name" className="register-full-name-label">Nome Completo:</label>
                            <input
                                type="text"
                                className="register-full-name-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <label htmlFor="tax-number" className="register-tax-number-label">CPF:</label>
                            <input
                                type="text"
                                className="register-tax-number-input"
                                value={cpf}
                                onChange={(e) => setCpf(e.target.value)}
                                required
                            />
                            <label htmlFor="email" className="register-email-label">Email:</label>
                            <input
                                type="email"
                                className="register-email-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Ex: antonio@gmail.com"
                                required
                            />
                            <label htmlFor="phone" className="register-phone-label">Telefone:</label>
                            <input
                                type="tel"
                                className="register-phone-input"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Ex: (88) 99657 - 5242"
                                required
                            />
                            <label htmlFor="password" className="register-password-label">Senha:</label>
                            
                            
                            <div className="password-input-container">
                                <input
                                    // O tipo muda dinamicamente
                                    type={showPassword ? "text" : "password"}
                                    className="register-password-input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <span 
                                    className="password-toggle-icon" 
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {/* O ícone muda dinamicamente */}
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>

                            <button type="submit" className="create-account-button" disabled={loading}>
                                {loading ? 'Criando...' : 'Criar Conta'}
                            </button>
                        </form>
                        {error && <p className="register-message register-error-message">{error}</p>}
                        {success && <p className="register-message register-success-message">{success}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
