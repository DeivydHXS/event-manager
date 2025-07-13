API de Gerenciamento de Eventos
Uma API RESTful completa construída com Node.js, Express e Sequelize para o gerenciamento de eventos. Este projeto foi desenvolvido como um estudo aprofundado sobre a criação de APIs robustas, seguras e escaláveis, seguindo as melhores práticas de desenvolvimento de software.

📖 Índice
Principais Funcionalidades

Tecnologias Utilizadas

Pré-requisitos

Como Rodar o Projeto

Scripts Disponíveis

Testes

Documentação da API (Swagger)

Docker

Variáveis de Ambiente

Licença

✨ Principais Funcionalidades
Gerenciamento de Usuários: Cadastro e autenticação segura com senhas criptografadas e tokens JWT.

CRUD de Eventos: Criação, leitura, atualização e exclusão de eventos, com associação ao usuário criador.

Sistema de Participação: Usuários autenticados podem se inscrever e cancelar a inscrição em eventos.

Controle de Acesso Baseado em Funções (RBAC):

Administrador: Possui acesso total para gerenciar todos os eventos e funcionalidades do sistema.

Dono do Evento: Tem permissões para editar e excluir apenas os eventos que criou.

Participante: Pode visualizar eventos e participar deles, mas não pode realizar alterações nos eventos.

Implementado com um middleware de autorização centralizado e regras de negócio específicas.

Listagem Avançada: A rota de listagem de eventos suporta:

Paginação (page e limit)

Filtros (por localização e por tempo - futuros/passados)

Ordenação (por qualquer campo, ascendente ou descendente)

Segurança:

Autenticação por Token JWT.

Middlewares de segurança com helmet.

Prevenção de ataques de força bruta com express-rate-limit.

Suporte a CORS para integração segura com front-ends.

Qualidade de Código:

Código padronizado com ESLint e Prettier.

Tratamento de erros centralizado.

Validação de dados de entrada com Yup.

Testes Automatizados: Suíte de testes de integração completa com Jest e Supertest.

Documentação: Documentação interativa da API gerada com Swagger.

Containerização: Suporte completo a Docker para um ambiente de desenvolvimento e produção padronizado.

🛠️ Tecnologias Utilizadas
Backend: Node.js, Express.js

Banco de Dados: Sequelize (ORM), SQLite3

Testes: Jest, Supertest, factory-girl

Autenticação: JWT, bcryptjs

Segurança: Helmet, Express Rate Limit, CORS

Validação: Yup

Qualidade de Código: ESLint, Prettier

Documentação: Swagger (swagger-ui-express, swagger-autogen)

Containerização: Docker

📋 Pré-requisitos
Antes de começar, você vai precisar ter instalado em sua máquina:

Node.js (v18.x ou superior)

npm ou Yarn

Docker (para rodar via container)

🚀 Como Rodar o Projeto
Siga os passos abaixo para executar o projeto em seu ambiente de desenvolvimento.

# 1. Clone este repositório
$ git clone https://github.com/seu-usuario/event-api.git

# 2. Navegue até o diretório do projeto
$ cd event-api

# 3. Instale as dependências
$ npm install

# 4. Crie o ficheiro de variáveis de ambiente
# Copie o ficheiro .env.example para um novo ficheiro .env
$ cp .env.example .env

# (Opcional) Altere as variáveis no ficheiro .env se necessário.

# 5. Execute as migrations para o banco de dados de desenvolvimento
$ npm run db:migrate

# 6. Popule o banco com dados de teste (opcional, mas recomendado)
$ npm run db:seed

# 7. Inicie a aplicação em modo de desenvolvimento
$ npm run dev

# O servidor estará a correr em http://localhost:3333

📜 Scripts Disponíveis
No package.json, você encontrará os seguintes scripts:

Script

Descrição

npm run dev

Inicia a aplicação em modo de desenvolvimento com nodemon.

npm test

Executa a suíte de testes de integração com Jest.

npm run lint

Analisa o código em busca de erros de padrão com ESLint.

npm run lint:fix

Tenta corrigir automaticamente os erros encontrados pelo ESLint.

npm run swagger

Gera (ou atualiza) o ficheiro swagger-output.json com base nas rotas.

npm run db:migrate

Executa as migrations do Sequelize para criar/atualizar as tabelas do banco.

npm run db:seed

Popula o banco de dados com dados de teste (seeders).

npm run db:seed:undo

Remove todos os dados inseridos pelos seeders.

✅ Testes
Para garantir a qualidade e o funcionamento correto da API, foram criados testes de integração. Para executá-los:

# 1. Certifique-se de que as migrations foram executadas no banco de teste
$ cross-env NODE_ENV=test npm run db:migrate

# 2. Rode a suíte de testes
$ npm test

📚 Documentação da API (Swagger)
A documentação completa e interativa dos endpoints está disponível via Swagger UI.

# 1. Gere o ficheiro de documentação
$ npm run swagger

# 2. Inicie o servidor
$ npm run dev

# 3. Abra o seu navegador e acesse:
http://localhost:3333/docs

Obs: É necessário regenerar a documentação (npm run swagger) sempre que novas rotas forem adicionadas ou modificadas.

🐳 Docker
Este projeto está totalmente containerizado. Para construir e rodar a aplicação com Docker:

# 1. Construa a imagem Docker a partir do Dockerfile
# (Certifique-se de que o serviço Docker está a correr na sua máquina)
$ docker build -t event-api .

# 2. Inicie um contentor a partir da imagem construída
$ docker run --name api-container -p 3333:3333 --env-file .env -d event-api

# Para parar o contentor:
$ docker stop api-container

# Para remover o contentor:
$ docker rm api-container

🔑 Variáveis de Ambiente
Para correr esta aplicação, você precisa de criar um ficheiro .env na raiz do projeto. Use o .env.example como referência.

Variável

Descrição

Exemplo

APP_PORT

A porta em que o servidor da API irá correr.

3333

APP_SECRET

Um segredo forte e único para a geração de tokens JWT.

segredo-muito-seguro-para-minha-api

DB_STORAGE

O caminho para o ficheiro da base de dados SQLite de desenvolvimento.

./src/database/database.sqlite

FRONTEND_URL

A URL do seu front-end, para a configuração do CORS em produção.

http://localhost:3000

📄 Licença
Este projeto está sob a licença MIT. Veja o ficheiro LICENSE.md para mais detalhes.

Feito com ❤️ por [Seu Nome Aqui]