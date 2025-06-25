FROM node:20-alpine

WORKDIR /app

# Copier uniquement les fichiers package pour optimiser le cache
COPY package*.json ./

# Supprimer le lock et installer proprement
RUN rm -f package-lock.json && npm install

# Copier le reste du code
COPY . .

EXPOSE 5173

# Lancer le serveur de développement
CMD ["npm", "run", "dev:frontend"]
