
import event1 from '../assets/event1.png';
import event2 from '../assets/event2.png';
import event3 from '../assets/event3.png';
import event4 from '../assets/event4.png';
import event5 from '../assets/event5.png';
import event6 from '../assets/event6.png';
import ImgDetalheGame from '../assets/EditEvento.png'; // Imagem específica para o detalhe do "Game Bora Criar"

// A exportação permite que outros arquivos importem esta variável
export const mockEventos = [
    { 
        id: 1, 
        titulo: "Palestra sobre inovação", 
        imagem: event1, 
        status: "em-andamento",
        descricao: "<p>Descrição detalhada sobre a Palestra de Inovação. Fique ligado para mais informações.</p>",
        data: "10 de Setembro de 2025",
        horario: "19:00 - 21:00",
        local: "Online via YouTube"
    },
    { 
        id: 2, 
        titulo: "Feira de Startups", 
        imagem: event2, 
        status: "em-andamento",
        descricao: "<p>Descrição detalhada sobre a Feira de Startups. Fique ligado para mais informações.</p>",
        data: "15-17 de Outubro de 2025",
        horario: "09:00 - 18:00",
        local: "Centro de Convenções"
    },
    { 
        id: 6, 
        titulo: "Game Bora Criar!", 
        imagem: event6, 
        imagemDetalhe: ImgDetalheGame, // Uma imagem maior ou diferente para a página de detalhes
        status: "em-andamento",
        data: "28 de Novembro de 2025",
        horario: "14:00 - 17:00",
        local: "Campus da UFC - Crateús",
        descricao: `
            <p>🎮✨ Você está pronto para transformar ideias em realidade? ✨🎮</p>
            <p>Ei, pessoal! 🚀 O <strong>Game Bora Criar!</strong> está chegando e você não pode ficar de fora dessa! É a sua chance de soltar a criatividade, trabalhar em equipe e ainda concorrer a uma super cesta de guloseimas! 🍫🍬</p>
            <h3>O que é o Game Bora Criar?</h3>
            <p>É um jogo incrível desenvolvido pelo projeto de extensão <strong>Germinar</strong>, onde você e sua equipe vão pensar em soluções criativas para problemas reais. E o melhor: essas ideias podem virar startups! 💡💼</p>
        `
    },
    { 
        id: 3, 
        titulo: "Gestão Pública: O caso 2", 
        imagem: event3, 
        status: "encerrado",
        descricao: "<p>Análise aprofundada sobre o Caso 2 de Gestão Pública. Este evento já foi encerrado.</p>" 
    },
    { 
        id: 4, 
        titulo: "Sertão do Inhamuns", 
        imagem: event4, 
        status: "encerrado",
        descricao: "<p>Discussão sobre as potencialidades do Sertão do Inhamuns. Este evento já foi encerrado.</p>" 
    },
    { 
        id: 5, 
        titulo: "Edital Startup Nordeste", 
        imagem: event5, 
        status: "encerrado",
        descricao: "<p>Informações sobre o Edital Startup Nordeste. Este evento já foi encerrado.</p>"
    }
];