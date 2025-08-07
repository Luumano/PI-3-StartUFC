import React, { useState } from 'react';
import './NovoMembro.css';
import NavbarAdmin from "../../components/Navbar/NavbarAdmin";
import api from '../../services/api'; 
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa'; // Importado para o spinner de loading

const NovoMembro = () => {

  const [name, setName] = useState('');
  const [cpf, setCpf] = useState(''); // Ou 'matricula', dependendo do que o backend espera
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // <--- NOVO ESTADO PARA ADMINISTRADOR
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false); // Estado para o spinner do botão
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');
    setSuccess('');

    // Usaremos um objeto JSON simples em vez de FormData se não estivermos enviando um arquivo diretamente
    // Se o backend espera um arquivo, teremos que converter o Base64 aqui ou ajustar o backend para receber FormData com JSON.
    // Para simplificar, vou assumir um JSON payload para os dados do usuário, e a imagem será tratada separadamente,
    // ou você precisará converter a imagem para Base64 antes de adicioná-la ao JSON.
    // Se o backend espera FormData com um campo 'image' que é um File, mantenha o FormData.
    // Se o backend espera imageDetails: { base64: "...", extension: "..." }, precisamos converter aqui.

    let imageDetails = null;
    if (image) {
      // Converte a imagem para Base64 antes de enviar no JSON
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = async () => {
        const base64String = reader.result;
        const parts = base64String.split(';');
        const mimeType = parts[0].split(':')[1];
        const extension = '.' + mimeType.split('/')[1];
        const base64Data = parts[1].split(',')[1];

        imageDetails = {
          base64: base64Data,
          extension: extension
        };
        // Agora que a imagem está pronta, chame a função de envio
        await sendRegistrationRequest(imageDetails);
      };
    } else {
      // Se não houver imagem, chame a função de envio diretamente
      await sendRegistrationRequest(null);
    }
  };

  const sendRegistrationRequest = async (imageDetails) => {
    const payload = {
      name: name,
      cpf: cpf, // Verifique se o backend espera 'cpf' ou 'matricula' ou outro nome
      email: email,
      phone: phone,
      password: password,
      isAdmin: isAdmin, // <--- INCLUÍDO O CAMPO isAdmin NO PAYLOAD
      imageDetails: imageDetails // Inclui a imagem em Base64, se houver
    };

    try {
      // ENDPOINT: Você precisará de um endpoint no backend que aceite este payload
      // e defina o IsAdmin no banco de dados. Pode ser '/users/registerAdmin'
      // ou o mesmo '/users/register' se ele for flexível.
      const response = await api.post('/user/saveuser', payload); // <--- Endpoint Sugerido

      if (response.status === 200) {
        setSuccess('Conta de administrador criada com sucesso!');
        // Limpar formulário
        setName('');
        setCpf('');
        setEmail('');
        setPhone('');
        setPassword('');
        setImage(null);
        setIsAdmin(false);
        
        setTimeout(() => {
          navigate('/adminDashboard'); // Redirecionar para o painel do admin
        }, 1500);
      }
    } catch (err) {
      console.error("Erro ao criar conta:", err.response?.data || err);
      const errorMessage = err.response?.data?.message || 'Erro ao criar conta. Verifique os dados.';
      setError(errorMessage);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div>
      <NavbarAdmin/>
      <div className="container-register-membro">
        <div className="side-bar-register-membro">
          <div></div>
          <div></div>
          <p id='ti1' style={{ color: 'white' }}>Bem Vindo</p>
          <img className='img-logo' src="/src/assets/StartUFC-logo-verde.png" alt="Logo" />
          <div></div>
        </div>
        <div className="register-info-membro">
          <h1 className="register-title-membro">Adicionar Novo Administrador</h1> {/* Título ajustado */}
          <form onSubmit={handleRegister}>
            <label htmlFor="full-name" className="register-full-name-label-membro">Nome Completo:</label>
            <input
              type="text"
              className="register-full-name-input-membro"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <br />
            <label htmlFor="tax-number" className="register-tax-number-label-membro">CPF/Matrícula:</label> {/* Label ajustado */}
            <input
              type="text"
              className="register-tax-number-input-membro"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              required
            />
            <br />
            <label htmlFor="email" className="register-email-label-membro">Email:</label>
            <input
              type="email"
              className="register-email-input-membro"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex: antonio@gmail.com"
              required
            />
            <br />
            <label htmlFor="phone" className="register-phone-label-membro">Telefone:</label>
            <input
              type="tel"
              className="register-phone-input-membro"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ex: (88) 99657 - 5242"
              required
            />
            <br />
            <label htmlFor="password" className="register-password-label-membro">Senha:</label>
            <input
              type="password"
              className="register-password-input-membro"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <br />
            <label htmlFor="image" className="register-image-label-membro">Imagem (opcional):</label>
            <input
              type="file"
              className="register-image-input-membro"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <br />

            {/* NOVO CAMPO: Checkbox para Administrador */}
            <div className="register-admin-checkbox">
              <input
                type="checkbox"
                id="isAdmin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
              <label htmlFor="isAdmin">Tornar Administrador</label>
            </div>
            <br />

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <button type="submit" className="create-account-button-membro" disabled={loading}>
              {loading ? <FaSpinner className="spinner" /> : 'Criar Conta'} 
            </button> 
          </form>
        </div>
      </div>
    </div>
  );
};

export default NovoMembro;