FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
COPY . .
RUN npm ci --no-audit --no-fund && \
    npx vite build && \
    rm -rf node_modules && \
    npm ci --only=production --no-audit --no-fund && \
    npm cache clean --force

EXPOSE 3000
CMD ["npm", "run", "preview"]

