

FROM node:20.11.0

WORKDIR /app

COPY package.json ./
RUN npm install
COPY . .

EXPOSE 5000

# Modify the CMD to use server.js instead of index.js
CMD ["node", "server.js"]
