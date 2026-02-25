FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

EXPOSE 3000

# Default is production; docker-compose overrides to dev.
RUN npm run build
CMD ["npm", "run", "start", "--", "-p", "3000", "-H", "0.0.0.0"]
