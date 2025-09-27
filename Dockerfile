FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production --no-audit --no-fund && \
    npm cache clean --force

COPY . .
RUN npm run build && \
    rm -rf node_modules && \
    npm ci --only=production --no-audit --no-fund

EXPOSE 3000
CMD ["npm", "run", "preview"]

