# Usa la versión correcta de Node.js
FROM node:20.17.0

# Define la carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copia solo los archivos necesarios para instalar dependencias
COPY package*.json ./

# Instala dependencias del proyecto
RUN npm install --legacy-peer-deps

# Copia todo el código del proyecto
COPY . .

# Compila el código
RUN npm run build

# Expón el puerto (debe coincidir con el usado en tu Express)
EXPOSE 3000

# Comando para iniciar el servidor
CMD ["npm", "start"]
