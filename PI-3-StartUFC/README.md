# Transferência de Tecnologia: Deploy dos Sistemas em Ambiente Conteinerizado

## Visão Geral

Este documento tem como objetivo orientar qualquer pessoa a executar e realizar o deploy dos sistemas desenvolvidos utilizando Docker e Docker Compose.

## Pré-requisitos

- Docker instalado ([Download](https://www.docker.com/products/docker-desktop))
- Docker Compose instalado (já incluso no Docker Desktop)
- Git instalado (opcional, para clonar o repositório)

## Estrutura do Projeto

- `APIStartUFC`: Backend (.NET)
- `frontend`: Frontend (React/Angular/etc.)
- `docker-compose.yml`: Orquestração dos containers
- `Dockerfile`: Configuração de build para cada serviço

## Passos para Execução

### 1. Clonar o Repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd PI-3-StartUFC/PI-3-StartUFC
```

### 2. Build e Deploy dos Containers

Execute o comando abaixo na raiz do projeto (onde está o `docker-compose.yml`):

```bash
docker-compose up --build
```

Este comando irá:
- Construir as imagens dos serviços (API, Frontend, Banco de Dados)
- Subir os containers e conectar em rede interna

### 3. Acessar os Sistemas

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **API:** [http://localhost:8080](http://localhost:8080)
- **Banco de Dados:** SQL Server disponível na porta 1433

### 4. Parar os Containers

```bash
docker-compose down
```

## Observações

- As configurações de portas podem ser ajustadas no arquivo `docker-compose.yml`.
- Para atualizar o código, basta alterar os arquivos e executar novamente o comando de build.
- Certifique-se de que as portas 3000, 8080 e 1433 estejam livres no seu sistema.

## Suporte

Em caso de dúvidas, consulte a documentação oficial do Docker ou entre em contato com o responsável técnico do projeto.
