# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar el resto del código
COPY . .

# Etapa 2: Production
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5005

# Instalar dumb-init para mejor manejo de señales
RUN apk add --no-cache dumb-init

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodeapp

# Copiar dependencias y código
COPY --from=builder --chown=nodeapp:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodeapp:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nodeapp:nodejs /app/index.js ./index.js
COPY --from=builder --chown=nodeapp:nodejs /app/configuration ./configuration
COPY --from=builder --chown=nodeapp:nodejs /app/controllers ./controllers
COPY --from=builder --chown=nodeapp:nodejs /app/middlewares ./middlewares
COPY --from=builder --chown=nodeapp:nodejs /app/models ./models
COPY --from=builder --chown=nodeapp:nodejs /app/routers ./routers
COPY --from=builder --chown=nodeapp:nodejs /app/services ./services

USER nodeapp

# Exponer el puerto 5005
EXPOSE 5005

# Comando para iniciar la aplicación
CMD ["dumb-init", "node", "index.js"]