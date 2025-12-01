# Etapa 1: build
FROM node:20-alpine AS build
WORKDIR /app

# Copiamos paquetes e instalamos dependencias (incluyendo dev)
COPY package*.json ./
RUN npm ci

# Copiamos el resto del código
COPY . .

# Build de SvelteKit (usa adapter-node -> genera build/index.js)
RUN npm run build

# Etapa 2: runtime (más ligera)
FROM node:20-alpine AS run
WORKDIR /app
ENV NODE_ENV=production

# Solo deps de producción
COPY package*.json ./
RUN npm ci --omit=dev

# Copiamos el build generado
COPY --from=build /app/build ./build

# Puerto que expone SvelteKit con adapter-node
EXPOSE 3000

# Comando de arranque
CMD ["node", "build/index.js"]