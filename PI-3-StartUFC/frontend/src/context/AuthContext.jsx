// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Você precisará instalar esta biblioteca: npm install jwt-decode
import api from '../services/api'; // Certifique-se de que o caminho para o seu 'api.js' está correto

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                // Você pode adicionar mais validações aqui, como expirou, etc.
                setUser(decodedUser);
                // Configura o header de autorização para o axios
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            } catch (error) {
                console.error("Erro ao decodificar token JWT:", error);
                localStorage.removeItem('authToken'); // Remove token inválido
            }
        }
        setLoading(false);
    }, []);

    const login = (token) => {
        localStorage.setItem('authToken', token);
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
        delete api.defaults.headers.common['Authorization']; // Remove o header de autorização
    };

    // Renderiza um loader enquanto verifica o token inicial
    if (loading) {
        return <div>Carregando autenticação...</div>; 
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};