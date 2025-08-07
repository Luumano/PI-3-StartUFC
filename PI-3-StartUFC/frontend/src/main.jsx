import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'; 
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from "./pages/Home/Home.jsx"
import QuemSomos from "./pages/QuemSomos/QuemSomos.jsx"
import Noticias from "./pages/Noticias/Noticias.jsx"
import GerminarPage from "./pages/Germinar/GerminarPage.jsx"
import Apoiadores from "./pages/Apoiadores/Apoiadores.jsx"
import RedesSociais from './pages/RedesSociais/RedesSociais.jsx'
import Galeria from './pages/Galeria/Galeria.jsx'
import NewsForm from './admin/NewsForm/NewsForm.jsx'
import Login from './pages/Login/Login.jsx'
import LoginAdmin from './admin/LoginAdm/LoginAdmin.jsx'
import Eventos from './pages/Eventos/Eventos.jsx'
import DetalhesEvento from "./pages/Eventos/DetalhesEvento.jsx"
import Inscricao from './pages/InscricaoEvento/Inscricao.jsx'
import GaleriaForm from './admin/GaleriaForm/GaleriaForm.jsx'
import NewsDetail from './pages/NewsDetail/NewsDetail.jsx'
import Register from './pages/Register/Register.jsx'
import Perfil from './pages/Perfil/Perfil.jsx'
import EditarPerfil from './pages/Perfil/EditarPerfil.jsx'
import NewList from './pages/NewsList/NewsList.jsx'
import CriarNoticias from './admin/Noticiais/CriarNoticias.jsx'
import CriarEvento from './admin/Evento/CriarEvento.jsx'
import UltimasNoticias from './admin/NoticiasAdm/UltimasNoticias.jsx'
import EventosExclusivos from './admin/EventosExclusivos/EventosExclusivos.jsx'
import AdminDashboard from './admin/Dashboard/AdminDashboard.jsx'
import NoticiasDetalhada from './pages/NoticiasDetalhadas/NoticiasDetalhadas.jsx'
import AdicionarImagem from './admin/AdicionarImagem/AdicionarImagem.jsx'
import CadastrarMembro from './admin/CadastrarMembro/NovoMembro.jsx'
import EditarEventos from './admin/EditarEvento/EditarEventos.jsx'
import EditaNoticias from './admin/EditarNoticias/EditaNoticias.jsx'
import EditarImagem from './admin/EditaImagem/EditarImagem.jsx'
import GerenciarAdmins from './admin/GerenciaAdmin/GerenciaAdmins.jsx'
import ListaFrequencia from './admin/ListaFrequencia/ListaDeFrequencia.jsx'

const router = createBrowserRouter([
  {
    
    path: "/",
    element: <App/>,
    children: [
      {
        path: "/",
        element: <Home/>,
      },
      {
        path: "quem-somos",
        element: <QuemSomos/>,
      },
      {
        path: "noticias",
        element: <Noticias/>,
      },
      {
        path: "germinar-page",
        element: <GerminarPage />
      },
      {
        path: "perfil",
        element: <Perfil/>,
      },
    
      {
        path: "editar-perfil",
        element: <EditarPerfil/>,
      },
      {
        path: "apoiadores",
        element: <Apoiadores/>,
      },
      {
      path: "redesSociais",
      element: <RedesSociais/>,
      },
      {
      path: "galeria",
      element: <Galeria/>,
      },
      {
        path: "news-form",
        element: <NewsForm/>
      },
      {
        path: "login",
        element: <Login/>
      },
      {
        path: "loginAdmin",
        element: <LoginAdmin/>
      },
      {
        path: "eventos",
        element: <Eventos/>
      },

     {
    path: "detalhesevento/:id", 
    element: <DetalhesEvento/>
     },

     {
    path: "inscricaoevento/:id", 
    element: <Inscricao/>
    },
      {
        path: "noticia/:id",
        element: <NewsDetail/>
      },
      {
        path: "noticiasDetalhadas/:id",
        element: <NoticiasDetalhada/>
      },
      { 
        path: "register",
        element: <Register/>
      },
      {
        path: "galeria-form",
        element: <GaleriaForm/>,
      },
      {
        path: "New-list",
        element: <NewList/>,
      },
      {
        path: "criarNoticias",
        element: <CriarNoticias/>,
      },
      {
        path: "criarEvento",
        element: <CriarEvento/>,
      },
      {
        path: "ultimasNoticias",
        element: <UltimasNoticias/>,
      },
      {
        path: "eventosExclusivos",
        element: <EventosExclusivos/>,
      },
      {
        path: "/adminDashboard",
        element: <AdminDashboard/>,
      },
      {
        path: "adicionarImagem",
        element: <AdicionarImagem/>,
      },
      {
        path: "cadastrarMembro",
        element: <CadastrarMembro/>,
      },
      {
        path: "editarEventos",
        element: <EditarEventos/>,
      },
      {
        path: "editaNoticias",
        element: <EditaNoticias/>,
      },
      {
        path: "editarImagem",
        element: <EditarImagem/>,
      },
      {
        path: "gerenciarAdmins",
        element: <GerenciarAdmins/>,
      },
      {
        path: "listaFrequencia",
        element: <ListaFrequencia/>
      },
    ]
  },
])


createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </StrictMode>,
);