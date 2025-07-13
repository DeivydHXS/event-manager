# ---- Estágio 1: Build ----
# Usamos uma imagem oficial e leve do Node.js como base.
# A tag 'alpine' refere-se a uma versão muito pequena, ideal para produção.
FROM node:18-alpine AS build

# Definimos o diretório de trabalho dentro do contentor.
WORKDIR /usr/src/app

# Copiamos os ficheiros de definição de dependências primeiro.
# Isto aproveita o cache do Docker: se estes ficheiros não mudarem, o Docker não reinstala as dependências.
COPY package*.json ./

# Instalamos apenas as dependências de produção para manter a imagem final mais leve.
RUN npm install --only=production

# Copiamos o resto do código da nossa aplicação para o diretório de trabalho.
COPY . .

# ---- Estágio 2: Produção ----
# Começamos de novo com uma imagem limpa para o ambiente final.
FROM node:18-alpine

WORKDIR /usr/src/app

# Copiamos as dependências já instaladas do estágio de 'build'.
COPY --from=build /usr/src/app/node_modules ./node_modules

# Copiamos o código da aplicação do estágio de 'build'.
COPY --from=build /usr/src/app .

# Expomos a porta em que a nossa aplicação corre.
EXPOSE 3333

# O comando que será executado quando o contentor iniciar.
CMD ["node", "src/server.js"]